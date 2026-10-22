/**
 * InFormatX — Database Layer (LowDB v1 JSON)
 * Handles all persistent storage: users, ratings, matches, security logs
 */

'use strict';

const low   = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path  = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'db', 'data.json');

const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// ── Schema defaults ────────────────────────────────────────────────
db.defaults({
  users:          [],   // {id, email, passwordHash, name, grade, createdAt}
  ratings:        [],   // {userId, rating, rank, wins, losses, draws, bestRating, streak, updatedAt}
  ratingHistory:  [],   // {id, userId, matchId, oldRating, newRating, delta, reason, createdAt}
  matches:        [],   // {id, player1Id, player2Id, quizId, status, startedAt, endedAt, winnerId, ratingApplied}
  matchAnswers:   [],   // {matchId, userId, qIndex, selectedIndex, isCorrect, answeredAt}
  securityEvents: [],   // {id, userId, matchId, type, details, riskLevel, createdAt}
  queue:          []    // {userId, ratingMin, ratingMax, joinedAt, quizId}
}).write();

// ── Elo Configuration ──────────────────────────────────────────────
const ELO_CONFIG = {
  K_FACTOR:       32,
  INITIAL_RATING: 1200,
  MIN_RATING:     800,
  MAX_RATING:     3000
};

// ── Rank thresholds (config-driven, not hardcoded in conditionals) ──
const RANKS = [
  { min: 2000, label: 'Grandmaster', emoji: '👑', color: '#FFD700' },
  { min: 1800, label: 'Master',      emoji: '💎', color: '#B9F2FF' },
  { min: 1600, label: 'Diamond',     emoji: '🔷', color: '#00BFFF' },
  { min: 1400, label: 'Platinum',    emoji: '⚡', color: '#E5E4E2' },
  { min: 1200, label: 'Gold',        emoji: '🥇', color: '#FFD700' },
  { min: 1000, label: 'Silver',      emoji: '🥈', color: '#C0C0C0' },
  { min: 0,    label: 'Bronze',      emoji: '🥉', color: '#CD7F32' }
];

function getRank(rating) {
  return RANKS.find(r => rating >= r.min) || RANKS[RANKS.length - 1];
}

// ── Elo calculation ────────────────────────────────────────────────
function calculateElo(ratingA, ratingB, outcomeA) {
  // outcomeA: 1 = win, 0.5 = draw, 0 = loss
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const delta = Math.round(ELO_CONFIG.K_FACTOR * (outcomeA - expectedA));
  const newA = Math.min(ELO_CONFIG.MAX_RATING, Math.max(ELO_CONFIG.MIN_RATING, ratingA + delta));
  const newB = Math.min(ELO_CONFIG.MAX_RATING, Math.max(ELO_CONFIG.MIN_RATING, ratingB - delta));
  return { newA, newB, deltaA: delta, deltaB: -delta };
}

// ── User helpers ───────────────────────────────────────────────────
const Users = {
  findByEmail(email) {
    return db.get('users').find(u => u.email.toLowerCase() === email.toLowerCase()).value();
  },
  findById(id) {
    return db.get('users').find({ id }).value();
  },
  create({ email, passwordHash, name, grade }) {
    const user = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name || email.split('@')[0],
      grade: grade || '11',
      createdAt: new Date().toISOString()
    };
    db.get('users').push(user).write();
    // Create initial rating
    Ratings.createForUser(user.id);
    return user;
  }
};

// ── Rating helpers ─────────────────────────────────────────────────
const Ratings = {
  createForUser(userId) {
    const r = {
      userId,
      rating:     ELO_CONFIG.INITIAL_RATING,
      rank:       'Bronze',
      wins:       0,
      losses:     0,
      draws:      0,
      bestRating: ELO_CONFIG.INITIAL_RATING,
      streak:     0,
      updatedAt:  new Date().toISOString()
    };
    db.get('ratings').push(r).write();
    return r;
  },
  getByUserId(userId) {
    return db.get('ratings').find({ userId }).value();
  },
  update(userId, patch) {
    db.get('ratings').find({ userId }).assign({ ...patch, updatedAt: new Date().toISOString() }).write();
    return db.get('ratings').find({ userId }).value();
  },
  getLeaderboard(limit = 50, offset = 0) {
    return db.get('ratings')
      .sortBy(r => -r.rating)
      .slice(offset, offset + limit)
      .map(r => {
        const user = Users.findById(r.userId);
        const rank = getRank(r.rating);
        return {
          ...r,
          name:       user ? user.name : 'Unknown',
          rankLabel:  rank.label,
          rankEmoji:  rank.emoji,
          rankColor:  rank.color
        };
      })
      .value();
  }
};

// ── Match helpers ──────────────────────────────────────────────────
const Matches = {
  create({ player1Id, player2Id, quizId }) {
    const match = {
      id:            uuidv4(),
      player1Id,
      player2Id,
      quizId:        quizId || 'test-ent',
      status:        'active',    // active | finished | cancelled
      startedAt:     new Date().toISOString(),
      endedAt:       null,
      winnerId:      null,
      ratingApplied: false,
      answers:       {}           // {userId: [{qIndex, selectedIndex, isCorrect, answeredAt}]}
    };
    db.get('matches').push(match).write();
    return match;
  },
  findById(id) {
    return db.get('matches').find({ id }).value();
  },
  update(id, patch) {
    db.get('matches').find({ id }).assign(patch).write();
    return db.get('matches').find({ id }).value();
  },
  getByUser(userId) {
    return db.get('matches').filter(m => m.player1Id === userId || m.player2Id === userId).value();
  },
  hasActiveMatch(userId) {
    return db.get('matches').some(m =>
      (m.player1Id === userId || m.player2Id === userId) && m.status === 'active'
    ).value();
  }
};

// ── Rating history ─────────────────────────────────────────────────
const RatingHistory = {
  record({ userId, matchId, oldRating, newRating, delta, reason }) {
    const entry = {
      id: uuidv4(),
      userId,
      matchId: matchId || null,
      oldRating,
      newRating,
      delta,
      reason,
      createdAt: new Date().toISOString()
    };
    db.get('ratingHistory').push(entry).write();
    return entry;
  },
  getByUser(userId, limit = 20) {
    return db.get('ratingHistory')
      .filter({ userId })
      .sortBy(e => -new Date(e.createdAt).getTime())
      .slice(0, limit)
      .value();
  }
};

// ── Security Events ────────────────────────────────────────────────
const SecurityLog = {
  record({ userId, matchId, type, details, riskLevel = 1 }) {
    // riskLevel: 1=log, 2=warn, 3=restrict, 4=manual-review
    const evt = {
      id:         uuidv4(),
      userId:     userId || null,
      matchId:    matchId || null,
      type,       // 'impossible_answer_time'|'duplicate_submit'|'invalid_answer'|etc
      details:    typeof details === 'string' ? details : JSON.stringify(details),
      riskLevel,
      createdAt:  new Date().toISOString()
    };
    db.get('securityEvents').push(evt).write();
    return evt;
  },
  getUserRiskLevel(userId) {
    const recentEvents = db.get('securityEvents')
      .filter(e => e.userId === userId)
      .sortBy(e => -new Date(e.createdAt).getTime())
      .slice(0, 20)
      .value();
    if (recentEvents.length === 0) return 0;
    const score = recentEvents.reduce((sum, e) => sum + e.riskLevel, 0);
    return Math.min(4, Math.floor(score / 5));
  }
};

// ── Queue helpers ──────────────────────────────────────────────────
const Queue = {
  add({ userId, quizId }) {
    const rating = Ratings.getByUserId(userId);
    const r = rating ? rating.rating : ELO_CONFIG.INITIAL_RATING;
    const entry = {
      userId,
      quizId:    quizId || 'test-ent',
      rating:    r,
      ratingMin: r - 200,
      ratingMax: r + 200,
      joinedAt:  new Date().toISOString()
    };
    db.get('queue').push(entry).write();
    return entry;
  },
  remove(userId) {
    db.get('queue').remove({ userId }).write();
  },
  isInQueue(userId) {
    return !!db.get('queue').find({ userId }).value();
  },
  findMatch(userId) {
    const myEntry = db.get('queue').find({ userId }).value();
    if (!myEntry) return null;

    const waitSeconds = (Date.now() - new Date(myEntry.joinedAt).getTime()) / 1000;
    // Expand range by 50 per 30 seconds waiting (max 400 total expansion)
    const expansion = Math.min(400, Math.floor(waitSeconds / 30) * 50);
    const minR = myEntry.ratingMin - expansion;
    const maxR = myEntry.ratingMax + expansion;

    return db.get('queue').find(e =>
      e.userId !== userId &&
      e.quizId === myEntry.quizId &&
      e.rating >= minR &&
      e.rating <= maxR
    ).value();
  },
  getAll() {
    return db.get('queue').value();
  }
};

module.exports = {
  db,
  Users,
  Ratings,
  Matches,
  RatingHistory,
  SecurityLog,
  Queue,
  getRank,
  calculateElo,
  ELO_CONFIG
};
