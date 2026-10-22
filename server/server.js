/**
 * InFormatX — Main Server Entry Point
 * Run: node server/server.js
 * 
 * API endpoints:
 *   POST   /auth/register
 *   POST   /auth/login
 *   GET    /auth/me
 *   GET    /api/rating/me
 *   GET    /api/leaderboard
 *   GET    /api/matches/history
 *   GET    /api/player/:id
 *   WS     /ws
 */

'use strict';

const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const helmet     = require('helmet');
const path       = require('path');
const rateLimit  = require('express-rate-limit');

const { router: authRouter } = require('./routes_auth');
const apiRouter  = require('./routes_api');
const { setupWebSocket } = require('./websocket');

const PORT = process.env.PORT || 3000;
const app  = express();

// ── Security middleware ───────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off for local dev
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));

// ── General rate limiter ──────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Rate limit exceeded' }
}));

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Static files (serve the HTML/JS/CSS app) ─────────────────────
app.use(express.static(path.join(__dirname, '..')));

// ── Routes ────────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/api',  apiRouter);

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── 404 handler ───────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Error handler ─────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── HTTP server + WebSocket ───────────────────────────────────────
const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log(`  ║   InFormatX Server running on :${PORT}     ║`);
  console.log('  ║   http://localhost:' + PORT + '                  ║');
  console.log('  ║   WebSocket: ws://localhost:' + PORT + '/ws     ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = { app, server };
