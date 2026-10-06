/* ═══════════════════════════════════════════════
   INFOX — ONBOARDING CONTROLLER
   Handles multi-step flow, auth, state saving
═══════════════════════════════════════════════ */

'use strict';

// ── State ──────────────────────────────────────
const TOTAL_STEPS = 6;

const state = {
  currentStep: 1,
  name:    '',
  level:   '',
  goal:    '',
  topics:  [],
  time:    '',
  style:   ''
};

// Saved answers per step (to restore on back navigation)
const answers = {};

// Auth state
let isBusy = false;
let lastEmail = '';
let lastPassword = '';

// ── DOM refs ────────────────────────────────────
const toastWrap = document.getElementById('toastWrap');

// ── Screens ─────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.ob-screen').forEach(s => {
    s.classList.remove('active');
  });
  const screen = document.getElementById(id);
  if (screen) screen.classList.add('active');
  window.scrollTo(0, 0);
}

// ── START ────────────────────────────────────────
function startOnboarding() {
  showScreen('screenOnboarding');
  renderStep(1);
  updateProgress(1);
}

// ── PROGRESS ─────────────────────────────────────
function updateProgress(step) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const pctEl = document.getElementById('progressPct');
  const dots  = document.getElementById('progressDots');

  if (fill)  fill.style.width  = pct + '%';
  if (label) label.textContent = `${TOTAL_STEPS}-ның ${step}-қадамы`;
  if (pctEl) pctEl.textContent = pct + '%';

  // Dots
  if (dots) {
    dots.innerHTML = '';
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const d = document.createElement('div');
      d.className = 'prog-dot' + (i < step ? ' done' : i === step ? ' current' : '');
      dots.appendChild(d);
    }
  }

  // Left panel contextual text
  updateLeftPanel(step);
}

const leftPanelData = {
  1: { quote: 'Танысайық', desc: 'Бірнеше сұрақ жеке жоспарыңды құруға көмектеседі.' },
  2: { quote: 'Деңгейіңді анықтайық', desc: 'Бұл оңтайлы қарқынды таңдауға көмектеседі.' },
  3: { quote: 'Мақсат қоямыз', desc: 'Нақты мақсат — табыстың жартысы. Біз жоспарды соған қарай құрамыз.' },
  4: { quote: 'Олқылықтарды табамыз', desc: 'Бұл саған көп балл жоғалтатын тақырыптарға назар аударуға көмектеседі.' },
  5: { quote: 'Уақытты жоспарлаймыз', desc: 'Жүйелі дайындық — нәтиже кілті. Күніне 20 минуттың өзі пайдалы!' },
  6: { quote: 'Оқу стилін таңдаймыз', desc: 'Оқу өз ырғағыңмен болғанда тиімдірек.' }
};

function updateLeftPanel(step) {
  const data = leftPanelData[step];
  if (!data) return;
  const q = document.getElementById('leftQuote');
  const d = document.getElementById('leftDesc');
  if (q) { q.style.opacity = '0'; setTimeout(() => { q.textContent = data.quote; q.style.opacity = '1'; }, 200); }
  if (d) { d.style.opacity = '0'; setTimeout(() => { d.textContent = data.desc;  d.style.opacity = '1'; }, 200); }
}

// ── RENDER STEP ───────────────────────────────────
function renderStep(step, goingBack = false) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'going-back'));

  const stepEl = document.getElementById('step' + step);
  if (!stepEl) return;

  if (goingBack) stepEl.classList.add('going-back');
  stepEl.classList.add('active');

  state.currentStep = step;

  // Restore saved answers
  restoreStepAnswer(step);

  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.style.display = step > 1 ? 'inline-flex' : 'none';

  // Update continue button state
  updateContinueBtn();
  updateProgress(step);

  // Auto-focus name input
  if (step === 1) {
    setTimeout(() => document.getElementById('inputName')?.focus(), 100);
  }
}

// ── NAVIGATION ────────────────────────────────────
function goNext() {
  if (!validateStep(state.currentStep)) return;
  saveStepAnswer(state.currentStep);

  if (state.currentStep < TOTAL_STEPS) {
    renderStep(state.currentStep + 1);
  } else {
    // All steps done — show auth
    showScreen('screenAuth');
    setTimeout(() => document.getElementById('authEmail')?.focus(), 150);
  }
}

function goBack() {
  if (state.currentStep > 1) {
    saveStepAnswer(state.currentStep);
    renderStep(state.currentStep - 1, true);
    showScreen('screenOnboarding');
  } else {
    showScreen('screenLanding');
  }
}

function goBackToOnboarding() {
  showScreen('screenOnboarding');
  renderStep(TOTAL_STEPS, true);
}

// ── VALIDATION ────────────────────────────────────
function validateStep(step) {
  switch (step) {
    case 1: {
      const name = (document.getElementById('inputName')?.value || '').trim();
      if (!name) {
        markInputInvalid(document.getElementById('inputName'));
        showToast('Жалғастыру үшін есіміңді енгіз', 'warn');
        return false;
      }
      state.name = name;
      return true;
    }
    case 2: return !!state.level   || (showToast('Деңгейіңді таңда', 'warn'), false);
    case 3: return !!state.goal    || (showToast('Қажетті нәтижені таңда', 'warn'), false);
    case 4: return true; // optional multi-select
    case 5: return !!state.time    || (showToast('Қанша уақыт бөле алатыныңды таңда', 'warn'), false);
    case 6: return !!state.style   || (showToast('Ыңғайлы оқу стилін таңда', 'warn'), false);
    default: return true;
  }
}

// ── SAVE / RESTORE STATE ──────────────────────────
function saveStepAnswer(step) {
  switch (step) {
    case 1: answers[1] = (document.getElementById('inputName')?.value || '').trim(); break;
    case 2: answers[2] = state.level;   break;
    case 3: answers[3] = state.goal;    break;
    case 4: answers[4] = [...state.topics]; break;
    case 5: answers[5] = state.time;    break;
    case 6: answers[6] = state.style;   break;
  }
  // Persist to sessionStorage for reload-safe state
  try { sessionStorage.setItem('infox_onb', JSON.stringify(answers)); } catch(e) {}
}

function restoreStepAnswer(step) {
  switch (step) {
    case 1: {
      const input = document.getElementById('inputName');
      if (input && answers[1]) input.value = answers[1];
      break;
    }
    case 2: {
      clearCards('levelCards');
      if (answers[2]) {
        const card = document.querySelector(`#levelCards [data-value="${answers[2]}"]`);
        if (card) { card.classList.add('selected'); state.level = answers[2]; }
      }
      break;
    }
    case 3: {
      clearCards('goalCards');
      if (answers[3]) {
        const card = document.querySelector(`#goalCards [data-value="${answers[3]}"]`);
        if (card) { card.classList.add('selected'); state.goal = answers[3]; }
      }
      break;
    }
    case 4: {
      // Restore multi-select chips
      document.querySelectorAll('#topicsChips .chip-card').forEach(c => c.classList.remove('selected'));
      (answers[4] || []).forEach(val => {
        const c = document.querySelector(`#topicsChips [data-value="${val}"]`);
        if (c) c.classList.add('selected');
      });
      state.topics = answers[4] ? [...answers[4]] : [];
      break;
    }
    case 5: {
      clearCards('timeCards');
      if (answers[5]) {
        const card = document.querySelector(`#timeCards [data-value="${answers[5]}"]`);
        if (card) { card.classList.add('selected'); state.time = answers[5]; }
      }
      break;
    }
    case 6: {
      clearCards('styleCards');
      if (answers[6]) {
        const card = document.querySelector(`#styleCards [data-value="${answers[6]}"]`);
        if (card) { card.classList.add('selected'); state.style = answers[6]; }
      }
      break;
    }
  }
  updateContinueBtn();
}

function clearCards(gridId) {
  document.querySelectorAll(`#${gridId} .sel-card`).forEach(c => c.classList.remove('selected'));
}

// ── CARD SELECTION ────────────────────────────────
function selectCard(el, group) {
  // Deselect siblings
  el.closest('.cards-grid').querySelectorAll('.sel-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  const val = el.getAttribute('data-value');
  switch (group) {
    case 'level': state.level = val; break;
    case 'goal':  state.goal  = val; break;
    case 'time':  state.time  = val; break;
    case 'style': state.style = val; break;
  }

  updateContinueBtn();
}

// ── CHIP TOGGLE (multi-select) ────────────────────
function toggleChip(el) {
  el.classList.toggle('selected');
  const val = el.getAttribute('data-value');
  if (el.classList.contains('selected')) {
    if (!state.topics.includes(val)) state.topics.push(val);
  } else {
    state.topics = state.topics.filter(t => t !== val);
  }
  // Step 4 is always valid (optional) — just enable continue
  updateContinueBtn();
}

// ── CONTINUE BUTTON STATE ─────────────────────────
function updateContinueBtn() {
  const btn = document.getElementById('continueBtn');
  if (!btn) return;

  let enabled = false;
  switch (state.currentStep) {
    case 1: enabled = !!(document.getElementById('inputName')?.value || '').trim(); break;
    case 2: enabled = !!state.level;  break;
    case 3: enabled = !!state.goal;   break;
    case 4: enabled = true;           break; // optional
    case 5: enabled = !!state.time;   break;
    case 6: enabled = !!state.style;  break;
    default: enabled = true;
  }
  btn.disabled = !enabled;
}

// Realtime validation for name input
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('inputName');
  if (nameInput) {
    nameInput.addEventListener('input', updateContinueBtn);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') goNext();
    });
  }

  // Restore from session if available
  try {
    const saved = sessionStorage.getItem('infox_onb');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(answers, parsed);
      if (answers[1]) state.name = answers[1];
      if (answers[2]) state.level = answers[2];
      if (answers[3]) state.goal = answers[3];
      if (answers[4]) state.topics = [...answers[4]];
      if (answers[5]) state.time = answers[5];
      if (answers[6]) state.style = answers[6];
    }
  } catch(e) {}

  // Back btn starts hidden
  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.style.display = 'none';

  // Progress dots init
  renderProgressDots(1);

  // Auth input listeners
  const authEmail    = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const loginEmail   = document.getElementById('loginEmail');
  const loginPassword= document.getElementById('loginPassword');

  [authEmail, authPassword].forEach(el => {
    el?.addEventListener('keydown', e => { if (e.key === 'Enter') handleAuth(); });
  });
  [loginEmail, loginPassword].forEach(el => {
    el?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  });

  // Close login modal on overlay click
  document.getElementById('loginModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'loginModal') closeLoginModal();
  });

  // ESC key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLoginModal();
    if (e.key === 'Enter' && document.getElementById('screenOnboarding')?.classList.contains('active')) {
      const activeStep = document.querySelector('.step.active');
      if (activeStep && state.currentStep !== 1) goNext();
    }
  });
});

function renderProgressDots(step) {
  const dots = document.getElementById('progressDots');
  if (!dots) return;
  dots.innerHTML = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'prog-dot' + (i < step ? ' done' : i === step ? ' current' : '');
    dots.appendChild(d);
  }
}

// ── AUTHENTICATION ────────────────────────────────

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('loginEmail')?.focus(), 100);
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function switchToLogin() {
  // Show login modal from auth screen
  showScreen('screenLanding');
  setTimeout(openLoginModal, 100);
}

function togglePw() {
  const input = document.getElementById('authPassword');
  const eye   = document.getElementById('pwEye');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  if (eye) eye.textContent = input.type === 'password' ? '👁' : '🙈';
}

function toggleLoginPw() {
  const input = document.getElementById('loginPassword');
  const eye   = document.getElementById('loginPwEye');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  if (eye) eye.textContent = input.type === 'password' ? '👁' : '🙈';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPassword(pw) {
  return pw.length >= 6;
}

function handleAuth() {
  if (isBusy) return;

  const emailEl = document.getElementById('authEmail');
  const pwEl    = document.getElementById('authPassword');
  const email   = (emailEl?.value || '').trim();
  const pw      = (pwEl?.value || '').trim();

  if (!isValidEmail(email)) {
    markInputInvalid(emailEl);
    showToast('Дұрыс email енгіз', 'warn');
    return;
  }
  if (!isValidPassword(pw)) {
    markInputInvalid(pwEl);
    showToast('Құпиясөз кем дегенде 6 таңба болуы тиіс', 'warn');
    return;
  }

  lastEmail    = email;
  lastPassword = pw;

  const btn = document.getElementById('authBtn');
  setBusy(btn, true);

  setTimeout(() => {
    setBusy(btn, false);
    finishRegistration(email, pw);
  }, 800);
}

function handleLogin() {
  if (isBusy) return;

  const emailEl = document.getElementById('loginEmail');
  const pwEl    = document.getElementById('loginPassword');
  const email   = (emailEl?.value || '').trim();
  const pw      = (pwEl?.value || '').trim();

  if (!isValidEmail(email)) {
    markInputInvalid(emailEl);
    showToast('Дұрыс email енгіз', 'warn');
    return;
  }
  if (!isValidPassword(pw)) {
    markInputInvalid(pwEl);
    showToast('Құпиясөзді енгіз (кем дегенде 6 таңба)', 'warn');
    return;
  }

  const btn = document.getElementById('loginBtn');
  setBusy(btn, true);

  setTimeout(() => {
    setBusy(btn, false);

    try {
      const stored = localStorage.getItem('physx_user');
      let user;
      if (stored) {
        user = JSON.parse(stored);
      } else {
        // Create minimal profile for login
        const name = email.split('@')[0] || 'Оқушы';
        user = { role: 'student', name, email, grade: '11' };
        localStorage.setItem('physx_user', JSON.stringify(user));
      }
    } catch(e) {}

    closeLoginModal();
    showToast('Қайта оралуыңмен! 👋', 'success');
    setTimeout(() => window.location.href = 'home.html', 800);
  }, 700);
}

function finishRegistration(email, pw) {
  // Collect final name from state
  const name = state.name || (document.getElementById('inputName')?.value || 'Оқушы').trim();

  const userData = {
    role:     'student',
    name,
    email,
    password: pw,
    grade:    '11',
    goal:     state.goal,
    level:    state.level,
    topics:   state.topics,
    time:     state.time,
    style:    state.style
  };

  try {
    localStorage.setItem('physx_user', JSON.stringify(userData));
    localStorage.setItem('physx_selected_grade', '11');
    // Clear session state
    sessionStorage.removeItem('infox_onb');
  } catch(e) {}

  // Build level label for display
  const levelLabels = { beginner: 'Бастаушы', medium: 'Орташа', advanced: 'Озат', ready: 'ҰБТ-ға дайынмын' };
  const timeLabels  = { '15 мин': 'Күніне 15–20 мин', '30 мин': '30 минут', '1 сағат': '1 сағат', '2+ сағат': '2+ сағат' };

  // Populate success screen
  const title = document.getElementById('successTitle');
  if (title) title.textContent = `Керемет, ${name}! 🎉`;

  const sumLevel = document.getElementById('sumLevel');
  const sumGoal  = document.getElementById('sumGoal');
  const sumTime  = document.getElementById('sumTime');

  if (sumLevel) sumLevel.textContent = levelLabels[state.level] || state.level || '—';
  if (sumGoal)  sumGoal.textContent  = state.goal || '—';
  if (sumTime)  sumTime.textContent  = timeLabels[state.time] || state.time || '—';

  showScreen('screenSuccess');
}

function goToHome() {
  window.location.href = 'home.html';
}

// ── HELPERS ───────────────────────────────────────

function setBusy(btn, busy) {
  isBusy = busy;
  if (!btn) return;
  btn.disabled = !!busy;
  if (busy) {
    btn.dataset.origText = btn.textContent;
    btn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.5);border-top-color:white;border-radius:50%;animation:spin 0.75s linear infinite;vertical-align:-3px;margin-right:8px;"></span>Күте тұрыңыз...';
  } else {
    if (btn.dataset.origText) btn.innerHTML = btn.dataset.origText;
  }
}

function markInputInvalid(el) {
  if (!el) return;
  el.classList.add('invalid');
  el.focus();
  setTimeout(() => el.classList.remove('invalid'), 1500);
}

function showToast(message, type = 'info', timeout = 3000) {
  if (!toastWrap) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="left">
      <div class="dot"></div>
      <div class="msg">${escapeHtml(message)}</div>
    </div>
    <button class="close" aria-label="закрыть">&times;</button>
  `;
  toastWrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const closeBtn = toast.querySelector('.close');
  const remove = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  };
  closeBtn?.addEventListener('click', remove);
  setTimeout(remove, timeout);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// ── CSS for spin animation (added dynamically) ────
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
