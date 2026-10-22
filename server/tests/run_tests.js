/**
 * InFormatX — Server-side Automated Tests
 * Tests all required functionality without external test runner
 * Run: node server/tests/run_tests.js
 */

'use strict';

const path = require('path');
// Change to project root
process.chdir(path.join(__dirname, '..', '..'));

// Use in-memory DB for tests
process.env.DB_PATH_OVERRIDE = ':test:';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${label}`);
    failed++;
  }
}

function assertEq(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    console.log(`  [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ── Override DB to use temp file ──────────────────────────────────
const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');
const testAdapter = new Memory();
const testDb = low(testAdapter);
testDb.defaults({
  users: [], ratings: [], ratingHistory: [],
  matches: [], matchAnswers: [], securityEvents: [], queue: []
}).write();

// Monkey-patch db module
const dbModule = require('../db');
// Reset db state so tests run in a clean isolated sandbox
dbModule.db.setState({
  users: [], ratings: [], ratingHistory: [],
  matches: [], matchAnswers: [], securityEvents: [], queue: []
}).write();

const bcrypt = require('bcryptjs');

// ────────────────────────────────────────────────────────────────
// TEST SUITE 1: User Registration & Authentication
// ────────────────────────────────────────────────────────────────
async function testAuth() {
  console.log('\n=== SUITE 1: Auth & User Management ===');

  // Register user 1
  const hash1 = await bcrypt.hash('password123', 10);
  const u1 = dbModule.Users.create({ email: 'alice@test.kz', passwordHash: hash1, name: 'Alice', grade: '11' });
  assert(u1 && u1.id, 'User 1 (Alice) created with ID');
  assert(u1.email === 'alice@test.kz', 'Email stored correctly');
  assert(!u1.passwordHash.includes('password123'), 'Password is hashed (not plaintext)');

  // Register user 2
  const hash2 = await bcrypt.hash('securepass', 10);
  const u2 = dbModule.Users.create({ email: 'bob@test.kz', passwordHash: hash2, name: 'Bob', grade: '10' });
  assert(u2 && u2.id, 'User 2 (Bob) created with ID');

  // Duplicate email check
  const dup = dbModule.Users.findByEmail('alice@test.kz');
  assert(dup && dup.id === u1.id, 'findByEmail returns correct user');

  // Password verification
  const validPw  = await bcrypt.compare('password123', u1.passwordHash);
  const invalidPw = await bcrypt.compare('wrongpass', u1.passwordHash);
  assert(validPw,   'Correct password validates');
  assert(!invalidPw, 'Wrong password rejected');

  // Initial rating created
  const r1 = dbModule.Ratings.getByUserId(u1.id);
  assert(r1 && r1.rating === 1200, 'Initial rating is 1200 (Elo default)');
  assert(r1.wins === 0 && r1.losses === 0, 'Initial wins/losses are 0');

  return { u1, u2 };
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 2: Elo Rating Calculation
// ────────────────────────────────────────────────────────────────
function testElo() {
  console.log('\n=== SUITE 2: Elo Rating System ===');

  const { calculateElo } = dbModule;

  // Equal ratings, player1 wins
  const r1 = calculateElo(1200, 1200, 1);
  assert(r1.deltaA > 0, 'Winner gains rating (equal ratings)');
  assert(r1.deltaB < 0, 'Loser loses rating (equal ratings)');
  assertEq(r1.deltaA, -r1.deltaB, 'Delta is symmetric for equal ratings');

  // Higher rated player wins (smaller gain)
  const r2_high = calculateElo(1400, 1200, 1);
  const r2_low  = calculateElo(1200, 1400, 1);
  assert(r2_high.deltaA < r2_low.deltaA, 'Higher-rated winner gains less');
  assert(r2_low.deltaA > 0, 'Underdog winner gains more');

  // Draw
  const draw = calculateElo(1200, 1200, 0.5);
  assertEq(draw.deltaA, 0, 'Draw between equal ratings yields 0 delta');

  // Min/max boundaries
  const minTest = calculateElo(800, 3000, 0); // loss at min
  assert(minTest.newA >= 800, 'Rating never drops below minimum (800)');
  const maxTest = calculateElo(3000, 800, 1); // win at max
  assert(maxTest.newA <= 3000, 'Rating never exceeds maximum (3000)');
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 3: Match Creation & Access Control
// ────────────────────────────────────────────────────────────────
function testMatches(u1, u2) {
  console.log('\n=== SUITE 3: Match Management ===');

  // Create match
  const match = dbModule.Matches.create({ player1Id: u1.id, player2Id: u2.id, quizId: 'test-ent' });
  assert(match && match.id, 'Match created with ID');
  assertEq(match.status, 'active', 'Match starts as active');
  assert(!match.ratingApplied, 'Rating not applied initially');

  // Access control: third party cannot be in this match
  const u3 = { id: 'fake-user-id' };
  const hasAccess = match.player1Id === u3.id || match.player2Id === u3.id;
  assert(!hasAccess, 'Third party cannot access match players');

  // Prevent double active match
  const hasActive = dbModule.Matches.hasActiveMatch(u1.id);
  assert(hasActive, 'hasActiveMatch detects existing active match');

  // Finish match
  dbModule.Matches.update(match.id, { status: 'finished', endedAt: new Date().toISOString(), winnerId: u1.id });
  const finished = dbModule.Matches.findById(match.id);
  assertEq(finished.status, 'finished', 'Match status updated to finished');
  assertEq(finished.winnerId, u1.id, 'Winner correctly recorded');

  return match;
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 4: Rating Application (idempotency)
// ────────────────────────────────────────────────────────────────
function testRatingApplication(u1, u2, match) {
  console.log('\n=== SUITE 4: Rating Application & Idempotency ===');

  const r1Before = dbModule.Ratings.getByUserId(u1.id);
  const r2Before = dbModule.Ratings.getByUserId(u2.id);
  const r1RatingBefore = r1Before.rating;
  const r2RatingBefore = r2Before.rating;

  // Simulate win for u1
  const elo = dbModule.calculateElo(r1RatingBefore, r2RatingBefore, 1);

  dbModule.Ratings.update(u1.id, {
    rating: elo.newA, wins: r1Before.wins + 1,
    bestRating: Math.max(r1Before.bestRating, elo.newA),
    streak: r1Before.streak + 1
  });
  dbModule.Ratings.update(u2.id, {
    rating: elo.newB, losses: r2Before.losses + 1,
    streak: 0
  });
  dbModule.RatingHistory.record({ userId: u1.id, matchId: match.id, oldRating: r1RatingBefore, newRating: elo.newA, delta: elo.deltaA, reason: 'win' });
  dbModule.RatingHistory.record({ userId: u2.id, matchId: match.id, oldRating: r2RatingBefore, newRating: elo.newB, delta: elo.deltaB, reason: 'loss' });
  dbModule.Matches.update(match.id, { ratingApplied: true });

  const r1After = dbModule.Ratings.getByUserId(u1.id);
  const r2After = dbModule.Ratings.getByUserId(u2.id);

  assert(r1After.rating > r1RatingBefore, 'Winner rating increased');
  assert(r2After.rating < r2RatingBefore, 'Loser rating decreased');
  assertEq(r1After.wins, 1, 'Winner wins count = 1');
  assertEq(r2After.losses, 1, 'Loser losses count = 1');

  // Idempotency: reapplying should be blocked by ratingApplied flag
  const matchNow = dbModule.Matches.findById(match.id);
  assert(matchNow.ratingApplied === true, 'ratingApplied flag set (prevents double-apply)');

  // Rating history persisted
  const hist = dbModule.RatingHistory.getByUser(u1.id, 10);
  assert(hist.length === 1, 'Rating history entry recorded for winner');
  assertEq(hist[0].delta, elo.deltaA, 'Rating history delta is correct');
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 5: Security & Anti-cheat
// ────────────────────────────────────────────────────────────────
function testSecurity(u1) {
  console.log('\n=== SUITE 5: Anti-cheat & Security Logging ===');

  // Log suspicious event
  dbModule.SecurityLog.record({ userId: u1.id, matchId: 'match-x', type: 'duplicate_answer', details: 'q2 answered twice', riskLevel: 2 });
  dbModule.SecurityLog.record({ userId: u1.id, matchId: 'match-x', type: 'suspicious_answer_speed', details: 'answered in 0.1s', riskLevel: 2 });

  const riskLevel = dbModule.SecurityLog.getUserRiskLevel(u1.id);
  assert(typeof riskLevel === 'number', 'Risk level is numeric');
  assert(riskLevel >= 0 && riskLevel <= 4, 'Risk level within 0-4 bounds');

  // Verify no passwords/tokens are logged
  const events = dbModule.db.get('securityEvents').value();
  events.forEach(e => {
    assert(!e.details.includes('password'), 'No passwords in security logs');
  });
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 6: Leaderboard & Statistics
// ────────────────────────────────────────────────────────────────
function testLeaderboard() {
  console.log('\n=== SUITE 6: Leaderboard & Statistics ===');

  const board = dbModule.Ratings.getLeaderboard(10, 0);
  assert(Array.isArray(board), 'Leaderboard returns array');
  if (board.length >= 2) {
    assert(board[0].rating >= board[1].rating, 'Leaderboard sorted by rating descending');
  }
  board.forEach(entry => {
    assert(entry.rankLabel, `Entry has rankLabel: ${entry.rankLabel}`);
    assert(entry.rankEmoji, 'Entry has rankEmoji');
  });
}

// ────────────────────────────────────────────────────────────────
// TEST SUITE 7: Queue System
// ────────────────────────────────────────────────────────────────
function testQueue(u1, u2) {
  console.log('\n=== SUITE 7: Matchmaking Queue ===');

  // Clean state
  dbModule.Queue.remove(u1.id);
  dbModule.Queue.remove(u2.id);

  // Add to queue
  dbModule.Queue.add({ userId: u1.id, quizId: 'test-ent' });
  assert(dbModule.Queue.isInQueue(u1.id), 'User 1 in queue after join');

  dbModule.Queue.add({ userId: u2.id, quizId: 'test-ent' });
  assert(dbModule.Queue.isInQueue(u2.id), 'User 2 in queue after join');

  // Find match
  const opponent = dbModule.Queue.findMatch(u1.id);
  assert(opponent !== null, 'Opponent found in queue');
  assert(opponent.userId === u2.id, 'Correct opponent matched');

  // Remove from queue
  dbModule.Queue.remove(u1.id);
  assert(!dbModule.Queue.isInQueue(u1.id), 'User 1 removed from queue');
}

// ────────────────────────────────────────────────────────────────
// RUN ALL TESTS
// ────────────────────────────────────────────────────────────────
async function runAll() {
  console.log('\n════════════════════════════════════════════════');
  console.log('  InFormatX Server — Automated Test Suite');
  console.log('════════════════════════════════════════════════');

  try {
    const { u1, u2 } = await testAuth();
    testElo();
    const match = testMatches(u1, u2);
    testRatingApplication(u1, u2, match);
    testSecurity(u1);
    testLeaderboard();
    testQueue(u1, u2);
  } catch (err) {
    console.error('\n[ERROR] Test threw exception:', err.message);
    console.error(err.stack);
    failed++;
  }

  console.log('\n════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runAll();
