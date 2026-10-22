/**
 * InFormatX — Auth Routes
 * POST /auth/register  — create account
 * POST /auth/login     — get JWT token
 * GET  /auth/me        — verify token
 */

'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Users, Ratings, getRank } = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ifx_dev_secret_change_in_prod_2025';
const JWT_EXPIRES = '7d';

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: 'Too many auth attempts, try again in 15 minutes' }
});

// ── Middleware: verify JWT ─────────────────────────────────────────
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── POST /auth/register ───────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  const { email, password, name, grade } = req.body || {};

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const emailClean = String(email).toLowerCase().trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRx.test(emailClean)) return res.status(400).json({ error: 'Invalid email format' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  if (Users.findByEmail(emailClean)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(String(password), 12);
  const user = Users.create({
    email: emailClean,
    passwordHash,
    name: String(name || emailClean.split('@')[0]).trim().slice(0, 50),
    grade: String(grade || '11')
  });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  const rating = Ratings.getByUserId(user.id);
  const rank = getRank(rating.rating);

  res.status(201).json({
    token,
    user: {
      id:    user.id,
      email: user.email,
      name:  user.name,
      grade: user.grade
    },
    rating: {
      rating:    rating.rating,
      rankLabel: rank.label,
      rankEmoji: rank.emoji
    }
  });
});

// ── POST /auth/login ──────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = Users.findByEmail(String(email).trim());
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  const rating = Ratings.getByUserId(user.id);
  const rank   = getRank(rating ? rating.rating : 1200);

  res.json({
    token,
    user: {
      id:    user.id,
      email: user.email,
      name:  user.name,
      grade: user.grade
    },
    rating: {
      rating:    rating ? rating.rating : 1200,
      rankLabel: rank.label,
      rankEmoji: rank.emoji
    }
  });
});

// ── GET /auth/me ──────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const user   = Users.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const rating = Ratings.getByUserId(user.id);
  const rank   = getRank(rating ? rating.rating : 1200);
  res.json({
    user: { id: user.id, email: user.email, name: user.name, grade: user.grade },
    rating: {
      rating:    rating ? rating.rating : 1200,
      wins:      rating ? rating.wins : 0,
      losses:    rating ? rating.losses : 0,
      draws:     rating ? rating.draws : 0,
      streak:    rating ? rating.streak : 0,
      bestRating:rating ? rating.bestRating : 1200,
      rankLabel: rank.label,
      rankEmoji: rank.emoji,
      rankColor: rank.color
    }
  });
});

module.exports = { router, authenticate };
