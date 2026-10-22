/**
 * InFormatX — Rating & Leaderboard API Routes
 */

'use strict';

const express = require('express');
const { Ratings, RatingHistory, Matches, SecurityLog, Users, getRank } = require('./db');
const { authenticate } = require('./routes_auth');

const router = express.Router();

// ── GET /api/rating/me ────────────────────────────────────────────
router.get('/rating/me', authenticate, (req, res) => {
  const rating = Ratings.getByUserId(req.user.userId);
  if (!rating) return res.status(404).json({ error: 'Rating not found' });
  const rank = getRank(rating.rating);
  const history = RatingHistory.getByUser(req.user.userId, 20);
  const matches = Matches.getByUser(req.user.userId);
  const total = matches.filter(m => m.status === 'finished').length;
  res.json({
    rating:    rating.rating,
    wins:      rating.wins,
    losses:    rating.losses,
    draws:     rating.draws,
    streak:    rating.streak,
    bestRating:rating.bestRating,
    matchesPlayed: total,
    winRate:   total > 0 ? Math.round((rating.wins / total) * 100) : 0,
    rankLabel: rank.label,
    rankEmoji: rank.emoji,
    rankColor: rank.color,
    history
  });
});

// ── GET /api/leaderboard ─────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(50, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const board  = Ratings.getLeaderboard(limit, offset);
  const total  = require('../db').db.get('ratings').value().length;
  res.json({ data: board, page, limit, total, pages: Math.ceil(total / limit) });
});

// ── GET /api/matches/history ──────────────────────────────────────
router.get('/matches/history', authenticate, (req, res) => {
  const matches = Matches.getByUser(req.user.userId)
    .filter(m => m.status === 'finished')
    .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt))
    .slice(0, 20)
    .map(m => {
      const isPlayer1 = m.player1Id === req.user.userId;
      const opponentId = isPlayer1 ? m.player2Id : m.player1Id;
      const opponent   = Users.findById(opponentId);
      const opRating   = Ratings.getByUserId(opponentId);
      const myAnswers  = (m.answers || {})[req.user.userId] || [];
      const correct    = myAnswers.filter(a => a.isCorrect).length;
      return {
        id:            m.id,
        quizId:        m.quizId,
        opponentName:  opponent ? opponent.name : 'Unknown',
        opponentRating:opRating ? opRating.rating : 1200,
        result:        m.winnerId === null ? 'draw' : m.winnerId === req.user.userId ? 'win' : 'loss',
        myScore:       correct,
        endedAt:       m.endedAt
      };
    });
  res.json({ matches });
});

// ── GET /api/player/:id ─────────────────────────────────────────
router.get('/player/:id', (req, res) => {
  const user = Users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Player not found' });
  const rating = Ratings.getByUserId(user.id);
  const rank   = getRank(rating ? rating.rating : 1200);
  const matches = Matches.getByUser(user.id).filter(m => m.status === 'finished');
  res.json({
    id:    user.id,
    name:  user.name,
    grade: user.grade,
    rating: rating ? rating.rating : 1200,
    wins:   rating ? rating.wins : 0,
    losses: rating ? rating.losses : 0,
    draws:  rating ? rating.draws : 0,
    matchesPlayed: matches.length,
    rankLabel: rank.label,
    rankEmoji: rank.emoji
  });
});

module.exports = router;
