/**
 * InFormatX — WebSocket Matchmaking & Game Handler
 * 
 * Message protocol (JSON):
 *   Client -> Server:
 *     {type:"join_queue",  token, quizId}
 *     {type:"leave_queue", token}
 *     {type:"answer",      token, matchId, qIndex, selectedIndex}
 *     {type:"ping"}
 * 
 *   Server -> Client:
 *     {type:"queue_joined",   position}
 *     {type:"match_found",    matchId, opponentName, opponentRating, quizId, questions, timeLimit}
 *     {type:"opponent_progress", answered}
 *     {type:"match_finished", result, myDelta, newRating, myScore, opponentScore, winnerId}
 *     {type:"match_cancelled", reason}
 *     {type:"error",          message}
 *     {type:"pong"}
 */

'use strict';

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const {
  Users, Ratings, Matches, RatingHistory,
  Queue, SecurityLog, calculateElo, getRank, ELO_CONFIG
} = require('./db');

// ── Quiz question bank (server-side only, answers hidden from client) ────
// Maps quizId -> array of {q, topic, options, correct}
let QUIZ_QUESTIONS_SERVER = {};

function loadServerQuizData() {
  try {
    // Try to parse quiz-data.js server-side (not expose to clients)
    const fs = require('fs');
    const path = require('path');
    const quizFile = fs.readFileSync(path.join(__dirname, '..', 'quiz-data.js'), 'utf-8');
    // Execute in isolated scope to get QUIZ_QUESTIONS
    const globalMock = {};
    const fn = new Function('window', quizFile + '\n return window.QUIZ_QUESTIONS;');
    const result = fn(globalMock);
    if (result && typeof result === 'object') {
      QUIZ_QUESTIONS_SERVER = result;
      console.log('[WS] Loaded quiz questions server-side for', Object.keys(result).length, 'quizzes');
    }
  } catch (e) {
    console.warn('[WS] Could not load quiz-data.js server-side:', e.message);
    // Fallback minimal dataset
    QUIZ_QUESTIONS_SERVER = {
      'test-ent': [
        { q:'2^8 = ?', topic:'Алгоритм', options:['128','256','512','64'], correct:1 },
        { q:'Python-да print() не жасайды?', topic:'Python', options:['Экранға шығарады','Оқиды','Жояды','Қосады'], correct:0 }
      ]
    };
  }
}

loadServerQuizData();

const JWT_SECRET = process.env.JWT_SECRET || 'ifx_dev_secret_change_in_prod_2025';

// Match time limit per question (seconds)
const ANSWER_TIME_LIMIT_S = 30;
// Total match time limit (seconds) = questions * time per question + buffer
const MATCH_TIME_LIMIT_S  = 300; // 5 minutes max

// Active WS connections: userId -> ws
const connections = new Map();

// Active match timers: matchId -> timeout handle
const matchTimers = new Map();

// Per-answer submission timestamps for anti-cheat: matchId+userId+qIndex -> timestamp
const answerTimestamps = new Map();

// ── Token verification ─────────────────────────────────────────────
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ── Send JSON to WebSocket ────────────────────────────────────────
function send(ws, data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// ── Send to user by ID ────────────────────────────────────────────
function sendToUser(userId, data) {
  const ws = connections.get(userId);
  send(ws, data);
}

// ── Get sanitized questions (no correct answers) ──────────────────
function getSanitizedQuestions(quizId) {
  const qs = QUIZ_QUESTIONS_SERVER[quizId] || QUIZ_QUESTIONS_SERVER['test-ent'] || [];
  return qs.map(({ q, topic, options }) => ({ q, topic, options })); // correct NOT included
}

// ── Apply match result (Elo + history + stats) ────────────────────
function applyMatchResult(match) {
  if (match.ratingApplied) return; // idempotency guard

  const { player1Id, player2Id, winnerId } = match;
  const r1 = Ratings.getByUserId(player1Id);
  const r2 = Ratings.getByUserId(player2Id);
  if (!r1 || !r2) return;

  // Determine outcomes
  let outcome1, outcome2;
  if (winnerId === null) {
    outcome1 = outcome2 = 0.5; // draw
  } else if (winnerId === player1Id) {
    outcome1 = 1; outcome2 = 0;
  } else {
    outcome1 = 0; outcome2 = 1;
  }

  const { newA, newB, deltaA, deltaB } = calculateElo(r1.rating, r2.rating, outcome1);

  // Update rating records
  Ratings.update(player1Id, {
    rating:     newA,
    rank:       getRank(newA).label,
    wins:       r1.wins    + (outcome1 === 1 ? 1 : 0),
    losses:     r1.losses  + (outcome1 === 0 ? 1 : 0),
    draws:      r1.draws   + (outcome1 === 0.5 ? 1 : 0),
    bestRating: Math.max(r1.bestRating, newA),
    streak:     outcome1 === 1 ? r1.streak + 1 : (outcome1 === 0 ? 0 : r1.streak)
  });
  Ratings.update(player2Id, {
    rating:     newB,
    rank:       getRank(newB).label,
    wins:       r2.wins    + (outcome2 === 1 ? 1 : 0),
    losses:     r2.losses  + (outcome2 === 0 ? 1 : 0),
    draws:      r2.draws   + (outcome2 === 0.5 ? 1 : 0),
    bestRating: Math.max(r2.bestRating, newB),
    streak:     outcome2 === 1 ? r2.streak + 1 : (outcome2 === 0 ? 0 : r2.streak)
  });

  // Record history
  const reason = winnerId === null ? 'draw' : (winnerId === player1Id ? 'win_as_p1' : 'loss_as_p1');
  RatingHistory.record({ userId: player1Id, matchId: match.id, oldRating: r1.rating, newRating: newA, delta: deltaA, reason });
  RatingHistory.record({ userId: player2Id, matchId: match.id, oldRating: r2.rating, newRating: newB, delta: deltaB, reason: winnerId === null ? 'draw' : (winnerId === player2Id ? 'win_as_p2' : 'loss_as_p2') });

  // Mark rating applied (atomic)
  Matches.update(match.id, { ratingApplied: true });

  return { player1: { delta: deltaA, newRating: newA }, player2: { delta: deltaB, newRating: newB } };
}

// ── Determine match winner from submitted answers ─────────────────
function determineWinner(match) {
  const allQs = QUIZ_QUESTIONS_SERVER[match.quizId] || QUIZ_QUESTIONS_SERVER['test-ent'] || [];
  const answers = match.answers || {};

  function countCorrect(userId) {
    return (answers[userId] || []).filter(a => a.isCorrect).length;
  }

  const score1 = countCorrect(match.player1Id);
  const score2 = countCorrect(match.player2Id);

  return {
    winnerId:  score1 > score2 ? match.player1Id : (score2 > score1 ? match.player2Id : null),
    score1, score2, totalQ: allQs.length
  };
}

// ── Finish match (called when both done or timer fires) ───────────
function finishMatch(matchId, reason = 'completed') {
  if (matchTimers.has(matchId)) {
    clearTimeout(matchTimers.get(matchId));
    matchTimers.delete(matchId);
  }

  let match = Matches.findById(matchId);
  if (!match || match.status !== 'active') return;

  const { winnerId, score1, score2 } = determineWinner(match);
  Matches.update(matchId, {
    status:   'finished',
    endedAt:  new Date().toISOString(),
    winnerId
  });
  match = Matches.findById(matchId); // refresh

  const eloResult = applyMatchResult(match);
  if (!eloResult) return;

  const r1 = Ratings.getByUserId(match.player1Id);
  const r2 = Ratings.getByUserId(match.player2Id);

  // Notify both players
  [match.player1Id, match.player2Id].forEach(uid => {
    const isP1     = uid === match.player1Id;
    const myScore  = isP1 ? score1 : score2;
    const oppScore = isP1 ? score2 : score1;
    const result   = winnerId === null ? 'draw' : (winnerId === uid ? 'win' : 'loss');
    const delta    = isP1 ? eloResult.player1.delta : eloResult.player2.delta;
    const newRating= isP1 ? eloResult.player1.newRating : eloResult.player2.newRating;
    const rank     = getRank(newRating);

    sendToUser(uid, {
      type:        'match_finished',
      result,
      myScore,
      opponentScore: oppScore,
      winnerId,
      myDelta:    delta,
      newRating,
      rankLabel:  rank.label,
      rankEmoji:  rank.emoji,
      reason
    });
  });

  console.log(`[MATCH] ${matchId} finished: ${match.player1Id}(${score1}) vs ${match.player2Id}(${score2}), winner=${winnerId}`);
}

// ── Check if match is complete (both players answered all questions) ──
function checkMatchComplete(matchId) {
  const match = Matches.findById(matchId);
  if (!match || match.status !== 'active') return;
  const totalQ = (QUIZ_QUESTIONS_SERVER[match.quizId] || QUIZ_QUESTIONS_SERVER['test-ent'] || []).length;
  const ans1 = ((match.answers || {})[match.player1Id] || []).length;
  const ans2 = ((match.answers || {})[match.player2Id] || []).length;
  if (ans1 >= totalQ && ans2 >= totalQ) {
    finishMatch(matchId, 'both_answered');
  }
}

// ── Handle join_queue ─────────────────────────────────────────────
function handleJoinQueue(ws, payload, userId) {
  // Prevent joining queue while in active match
  if (Matches.hasActiveMatch(userId)) {
    send(ws, { type: 'error', message: 'You are already in an active match' });
    return;
  }
  if (Queue.isInQueue(userId)) {
    send(ws, { type: 'error', message: 'Already in queue' });
    return;
  }

  const quizId = payload.quizId || 'test-ent';
  Queue.add({ userId, quizId });
  send(ws, { type: 'queue_joined', quizId, message: 'Searching for opponent...' });
  console.log(`[QUEUE] ${userId} joined queue for ${quizId}`);

  // Try to find a match immediately
  tryMatchmaking(userId);
}

// ── Matchmaking attempt ───────────────────────────────────────────
function tryMatchmaking(userId) {
  const opponent = Queue.findMatch(userId);
  if (!opponent) return;

  // Remove both from queue atomically
  Queue.remove(userId);
  Queue.remove(opponent.userId);

  const quizId = opponent.quizId;
  const match  = Matches.create({ player1Id: userId, player2Id: opponent.userId, quizId });
  const questions = getSanitizedQuestions(quizId);

  const p1 = Users.findById(userId);
  const p2 = Users.findById(opponent.userId);
  const r1 = Ratings.getByUserId(userId);
  const r2 = Ratings.getByUserId(opponent.userId);

  // Notify player 1
  sendToUser(userId, {
    type:           'match_found',
    matchId:        match.id,
    quizId,
    opponentName:   p2 ? p2.name : 'Unknown',
    opponentRating: r2 ? r2.rating : 1200,
    questions,
    totalQuestions: questions.length,
    timeLimit:      MATCH_TIME_LIMIT_S
  });

  // Notify player 2
  sendToUser(opponent.userId, {
    type:           'match_found',
    matchId:        match.id,
    quizId,
    opponentName:   p1 ? p1.name : 'Unknown',
    opponentRating: r1 ? r1.rating : 1200,
    questions,
    totalQuestions: questions.length,
    timeLimit:      MATCH_TIME_LIMIT_S
  });

  // Set match timeout
  const timer = setTimeout(() => finishMatch(match.id, 'timeout'), MATCH_TIME_LIMIT_S * 1000);
  matchTimers.set(match.id, timer);

  console.log(`[MATCH] Created ${match.id}: ${userId} vs ${opponent.userId}`);
}

// ── Handle answer submission ──────────────────────────────────────
function handleAnswer(ws, payload, userId) {
  const { matchId, qIndex, selectedIndex } = payload || {};
  if (!matchId || qIndex === undefined || selectedIndex === undefined) {
    send(ws, { type: 'error', message: 'Invalid answer payload' });
    return;
  }

  const match = Matches.findById(matchId);
  if (!match) { send(ws, { type: 'error', message: 'Match not found' }); return; }
  if (match.status !== 'active') { send(ws, { type: 'error', message: 'Match is not active' }); return; }

  // Authorization: verify player belongs to this match
  if (match.player1Id !== userId && match.player2Id !== userId) {
    SecurityLog.record({ userId, matchId, type: 'unauthorized_match_access', details: `Tried to answer match ${matchId}`, riskLevel: 3 });
    send(ws, { type: 'error', message: 'Access denied' });
    return;
  }

  const allQs = QUIZ_QUESTIONS_SERVER[match.quizId] || QUIZ_QUESTIONS_SERVER['test-ent'] || [];
  const qi    = parseInt(qIndex, 10);

  // Bounds check
  if (qi < 0 || qi >= allQs.length) {
    send(ws, { type: 'error', message: 'Invalid question index' });
    return;
  }

  // Duplicate answer check
  const existingAnswers = ((match.answers || {})[userId] || []);
  if (existingAnswers.some(a => a.qIndex === qi)) {
    SecurityLog.record({ userId, matchId, type: 'duplicate_answer', details: `Duplicate answer for q${qi}`, riskLevel: 2 });
    send(ws, { type: 'error', message: 'Question already answered' });
    return;
  }

  // ── Anti-cheat: timing check ──────────────────────────────────
  const now = Date.now();
  const matchStart = new Date(match.startedAt).getTime();
  const elapsedS = (now - matchStart) / 1000;
  // Minimum reasonable time to answer q[qi]: assume 2s per prev question
  const minExpectedTime = qi * 2;
  if (elapsedS < minExpectedTime) {
    SecurityLog.record({
      userId, matchId,
      type: 'suspicious_answer_speed',
      details: `q${qi} answered in ${elapsedS.toFixed(1)}s, expected >= ${minExpectedTime}s`,
      riskLevel: 2
    });
    // Don't block — just log (heuristic, not definitive proof)
  }

  // Validate against server-side correct answer
  const isCorrect = parseInt(selectedIndex, 10) === allQs[qi].correct;

  // Update match answers
  const updatedAnswers = match.answers || {};
  if (!updatedAnswers[userId]) updatedAnswers[userId] = [];
  updatedAnswers[userId].push({ qIndex: qi, selectedIndex: parseInt(selectedIndex, 10), isCorrect, answeredAt: new Date().toISOString() });
  Matches.update(matchId, { answers: updatedAnswers });

  // Notify opponent about progress (no answer revealed)
  const opponentId = match.player1Id === userId ? match.player2Id : match.player1Id;
  sendToUser(opponentId, {
    type:     'opponent_progress',
    answered: updatedAnswers[userId].length
  });

  // Check if match complete
  checkMatchComplete(matchId);
}

// ── Handle leave_queue ────────────────────────────────────────────
function handleLeaveQueue(userId) {
  Queue.remove(userId);
  console.log(`[QUEUE] ${userId} left queue`);
}

// ── Periodically try matchmaking for all queue members ───────────
setInterval(() => {
  const queueEntries = Queue.getAll();
  queueEntries.forEach(entry => {
    // Only try if they are still in queue and not already in a match
    if (!Matches.hasActiveMatch(entry.userId)) {
      tryMatchmaking(entry.userId);
    }
  });
}, 3000);

// ── WebSocket setup ───────────────────────────────────────────────
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    let userId = null;

    ws.on('message', (rawMsg) => {
      let msg;
      try { msg = JSON.parse(rawMsg); } catch { return; }

      const { type, token } = msg;

      // Auth check for all messages except ping
      if (type !== 'ping') {
        const decoded = verifyToken(token);
        if (!decoded) { send(ws, { type: 'error', message: 'Authentication required' }); return; }

        // Register connection
        if (!userId) {
          userId = decoded.userId;
          connections.set(userId, ws);
          console.log(`[WS] User connected: ${userId}`);
        }
      }

      switch (type) {
        case 'ping':
          send(ws, { type: 'pong' });
          break;
        case 'join_queue':
          handleJoinQueue(ws, msg, userId);
          break;
        case 'leave_queue':
          handleLeaveQueue(userId);
          send(ws, { type: 'queue_left' });
          break;
        case 'answer':
          handleAnswer(ws, msg, userId);
          break;
        default:
          send(ws, { type: 'error', message: 'Unknown message type' });
      }
    });

    ws.on('close', () => {
      if (userId) {
        connections.delete(userId);
        Queue.remove(userId);
        // If user disconnects mid-match, cancel or timeout match
        const activeMatches = Matches.getByUser(userId).filter(m => m.status === 'active');
        activeMatches.forEach(m => {
          SecurityLog.record({ userId, matchId: m.id, type: 'player_disconnected', details: 'WebSocket closed mid-match', riskLevel: 1 });
          // Give opponent a 30s grace period (timer already handles it)
        });
        console.log(`[WS] User disconnected: ${userId}`);
      }
    });

    ws.on('error', (err) => console.error('[WS] Error:', err.message));
  });

  return wss;
}

module.exports = { setupWebSocket };
