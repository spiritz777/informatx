/**
 * InFormatX — Leaderboard & Blitz Arena Module (Presentation Mode)
 * Статикалық рейтингтер, қазақстандық оқушылар лигасы және 100% жергілікті жұмыс істейтін
 * интерактивті 1-ге-1 блиц-дуэль симуляторы.
 * Ешқандай сыртқы Node/WebSocket серверді талап етпейді, презентацияға толық дайын!
 */

(function (global) {
  'use strict';

  // ── 15 ТОП ОҚУШЫЛАР РЕЙТИНГІ (ҚАЗАҚСТАН) ───────────────────
  const DEFAULT_LEADERBOARD = [
    { rank: 1, name: "Данияр Нұрланұлы", school: "НЗМ ФМБ, Астана", rating: 1580, wins: 48, losses: 3, streak: 12, league: "grandmaster", leagueName: "Грандмастер", avatar: "ДН", badge: "🥇" },
    { rank: 2, name: "Аружан Серікқызы", school: "БИЛ, Алматы", rating: 1495, wins: 42, losses: 4, streak: 8, league: "diamond", leagueName: "Алмаз лига", avatar: "АС", badge: "🥈" },
    { rank: 3, name: "Ернұр Бақытжан", school: "РФМШ, Астана", rating: 1440, wins: 39, losses: 5, streak: 6, league: "diamond", leagueName: "Алмаз лига", avatar: "ЕБ", badge: "🥉" },
    { rank: 4, name: "Мадина Омарова", school: "№134 Гимназия, Алматы", rating: 1390, wins: 33, losses: 7, streak: 4, league: "gold", leagueName: "Алтын лига", avatar: "МО", badge: "4" },
    { rank: 5, name: "Әлішер Сүлеймен", school: "НЗМ ХББ, Қарағанды", rating: 1365, wins: 29, losses: 6, streak: 5, league: "gold", leagueName: "Алтын лига", avatar: "ӘС", badge: "5" },
    { rank: 6, name: "Диас Тұрсынбек", school: "БИЛ, Шымкент", rating: 1340, wins: 26, losses: 8, streak: 3, league: "gold", leagueName: "Алтын лига", avatar: "ДТ", badge: "6" },
    { rank: 7, name: "", school: "", rating: 1320, wins: 18, losses: 4, streak: 5, league: "gold", leagueName: "Алтын лига", avatar: "", badge: "7", isMe: true },
    { rank: 8, name: "Камила Нұрғали", school: "НЗМ, Талдықорған", rating: 1280, wins: 22, losses: 9, streak: 2, league: "silver", leagueName: "Күміс лига", avatar: "КН", badge: "8" },
    { rank: 9, name: "Санжар Болатұлы", school: "№8 Лицей, Павлодар", rating: 1245, wins: 20, losses: 11, streak: 1, league: "silver", leagueName: "Күміс лига", avatar: "СБ", badge: "9" },
    { rank: 10, name: "Нұржан Қайрат", school: "Дарын, Ақтөбе", rating: 1210, wins: 17, losses: 10, streak: 3, league: "silver", leagueName: "Күміс лига", avatar: "НҚ", badge: "10" },
    { rank: 11, name: "Жансая Мұратқызы", school: "№39 Гимназия, Өскемен", rating: 1180, wins: 15, losses: 12, streak: 2, league: "silver", leagueName: "Күміс лига", avatar: "ЖМ", badge: "11" },
    { rank: 12, name: "Бекзат Ержан", school: "№1 Лицей, Қостанай", rating: 1150, wins: 14, losses: 13, streak: 1, league: "silver", leagueName: "Күміс лига", avatar: "БЕ", badge: "12" },
    { rank: 13, name: "Айсұлтан Темір", school: "НЗМ, Тараз", rating: 1090, wins: 11, losses: 14, streak: 0, league: "bronze", leagueName: "Қола лига", avatar: "АТ", badge: "13" },
    { rank: 14, name: "Гүлім Асқарқызы", school: "№60 Мектеп, Астана", rating: 1060, wins: 9, losses: 15, streak: 0, league: "bronze", leagueName: "Қола лига", avatar: "ГА", badge: "14" },
    { rank: 15, name: "Ислам Жұмабек", school: "№22 Мектеп, Орал", rating: 1020, wins: 7, losses: 16, streak: 0, league: "bronze", leagueName: "Қола лига", avatar: "ИЖ", badge: "15" }
  ];

  // ── ЖЕДЕЛ БЛИЦ СҰРАҚТАРЫ (ИНФОРМАТИКА) ──────────────────────
  const BLITZ_QUESTIONS = [
    {
      q: "Python-да тізімнің (list) ұзындығын анықтайтын кірістірілген функция қайсысы?",
      options: ["len()", "count()", "size()", "length()"],
      correct: 0,
      expl: "len(list) тізімдегі элементтердің жалпы санын қайтарады."
    },
    {
      q: "Екілік санау жүйесіндегі 1010₂ саны ондық жүйеде қандай санға сәйкес келеді?",
      options: ["8", "10", "12", "14"],
      correct: 1,
      expl: "1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 2 = 10"
    },
    {
      q: "Реляциялық деректер қорында (SQL) кестеден мәліметтерді оқу үшін қай сұраныс қолданылады?",
      options: ["SELECT", "FETCH", "GET", "READ"],
      correct: 0,
      expl: "SELECT командасы кестеден таңдалған бағандарды сұрауға арналған."
    },
    {
      q: "Логикалық ЖӘНЕ (AND / конъюнкция) амалы қай жағдайда ғана АҚИҚАТ (1) болады?",
      options: ["Екі пікір де 1 болғанда", "Кем дегенде біреуі 1 болғанда", "Екеуі де 0 болғанда", "Әрқашан 1 болады"],
      correct: 0,
      expl: "Конъюнкция тек барлық кіру аргументтері 1 болғанда ғана 1 болады."
    },
    {
      q: "IPv4 желілік мекенжайындағы әрбір санның (октеттің) максималды шекті мәні қандай?",
      options: ["128", "255", "256", "1024"],
      correct: 1,
      expl: "1 октет = 8 бит (2⁸ = 256 мән: 0-ден 255-ке дейін)."
    }
  ];

  // ── КҮЙ БАҚЫЛАУ (STATE) ───────────────────────────────────
  let activeFilter = 'all';
  let searchQuery = '';
  let duelState = {
    active: false,
    round: 0,
    questions: [],
    myScore: 0,
    oppScore: 0,
    timer: null,
    timeLeft: 10,
    answered: false,
    opponentName: "Айдос Қасымов",
    opponentSchool: "НЗМ Талдықорған",
    opponentElo: 1315
  };

  // Считаем базовый ELO из реальных квиз-данных (1320 база = Алтын лига #7)
  function calcBaseElo() {
    try {
      const raw = localStorage.getItem('physx_quiz_attempts');
      const attempts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(attempts) || attempts.length === 0) return 1320;

      let correct = 0, total = 0;
      attempts.forEach(a => {
        correct += (a.correctCount || 0);
        total += (a.totalQuestions || 0);
      });
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 84;
      // ELO = 1000 (база) + правильные ответы * 2 + точность * 3
      return Math.min(2000, 1000 + correct * 2 + accuracy * 3);
    } catch (_) { return 1320; }
  }

  function getUserRating() {
    try {
      // Дуэль-дельта (накапливается от побед/поражений в дуэлях)
      const delta = parseInt(localStorage.getItem('ifx_elo_delta') || '0', 10);
      return calcBaseElo() + delta;
    } catch (_) {}
    return 1320;
  }

  function setUserRating(newTotal) {
    try {
      // Сохраняем только разницу от базового ELO (дуэль-дельта)
      const base = calcBaseElo();
      const delta = newTotal - base;
      localStorage.setItem('ifx_elo_delta', String(delta));
    } catch (_) {}
  }

  function getLeaderboard() {
    const userRating = getUserRating();
    const realName = getUserName();
    const list = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
    const me = list.find(u => u.isMe);
    if (me) {
      me.rating = userRating;
      me.name = realName;
      me.avatar = realName.charAt(0).toUpperCase();
      if (userRating >= 1400) { me.league = "diamond"; me.leagueName = "Алмаз лига"; }
      else if (userRating >= 1300) { me.league = "gold"; me.leagueName = "Алтын лига"; }
      else if (userRating >= 1100) { me.league = "silver"; me.leagueName = "Күміс лига"; }
      else { me.league = "bronze"; me.leagueName = "Қола лига"; }
    }
    // Сұрыптау
    list.sort((a, b) => b.rating - a.rating);
    list.forEach((item, idx) => {
      item.rank = idx + 1;
      if (item.rank === 1) item.badge = "🥇";
      else if (item.rank === 2) item.badge = "🥈";
      else if (item.rank === 3) item.badge = "🥉";
      else item.badge = String(item.rank);
    });
    return list;
  }

  // ── РЕНДЕРИНГ ─────────────────────────────────────────────
  function renderAll() {
    renderStatusBadge();
    renderUserCard();
    renderPodium();
    renderLeaderboardList();
  }

  function renderStatusBadge() {
    const el = document.getElementById('mpConnectionStatus');
    if (!el) return;
    el.innerHTML = `<span class="pulse-dot"></span> Белсенді • Маусым 2026 (Live)`;
    el.style.color = 'var(--success)';
    el.style.borderColor = 'rgba(16, 185, 129, 0.3)';
  }

  function getUserName() {
    try {
      const user = JSON.parse(localStorage.getItem('physx_user') || '{}');
      return user.name || 'Оқушы';
    } catch (_) { return 'Оқушы'; }
  }

  function renderUserCard() {
    const list = getLeaderboard();
    const me = list.find(u => u.isMe) || { rank: 7, rating: 1320, leagueName: "Алтын лига" };
    const realName = getUserName();
    
    const rankEl = document.getElementById('myRankVal');
    const eloEl = document.getElementById('myEloVal');
    const leagueEl = document.getElementById('myLeagueVal');
    const nameEl = document.getElementById('mpMyName');
    const avatarEl = document.getElementById('mpMyAvatar');

    if (rankEl) rankEl.textContent = `#${me.rank}`;
    if (eloEl) eloEl.textContent = `${me.rating} ELO`;
    if (leagueEl) leagueEl.textContent = me.leagueName;
    if (nameEl) nameEl.textContent = realName;
    if (avatarEl) avatarEl.textContent = realName.charAt(0).toUpperCase();
  }

  function renderPodium() {
    const podiumEl = document.getElementById('mpPodiumContainer');
    if (!podiumEl) return;
    const list = getLeaderboard();
    const first = list[0] || {};
    const second = list[1] || {};
    const third = list[2] || {};

    podiumEl.innerHTML = `
      <div class="podium-card second">
        <div class="podium-medal">🥈</div>
        <div class="podium-name">${second.name || '—'}</div>
        <div class="podium-school">${second.school || ''}</div>
        <div class="podium-rating">${second.rating || 0} ELO</div>
      </div>
      <div class="podium-card first">
        <div class="podium-medal">🥇</div>
        <div class="podium-name">${first.name || '—'}</div>
        <div class="podium-school">${first.school || ''}</div>
        <div class="podium-rating">${first.rating || 0} ELO</div>
      </div>
      <div class="podium-card third">
        <div class="podium-medal">🥉</div>
        <div class="podium-name">${third.name || '—'}</div>
        <div class="podium-school">${third.school || ''}</div>
        <div class="podium-rating">${third.rating || 0} ELO</div>
      </div>
    `;
  }

  function renderLeaderboardList() {
    const listEl = document.getElementById('mpLeaderboardList');
    if (!listEl) return;

    let items = getLeaderboard();

    // Фильтр
    if (activeFilter === 'gold') {
      items = items.filter(u => u.rating >= 1300);
    } else if (activeFilter === 'silver') {
      items = items.filter(u => u.rating >= 1100 && u.rating < 1300);
    } else if (activeFilter === 'bronze') {
      items = items.filter(u => u.rating < 1100);
    }

    // Іздеу
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.school.toLowerCase().includes(q)
      );
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:30px 10px; opacity:0.6;">
          <div style="font-size:32px; margin-bottom:8px;">🔍</div>
          <div class="txt-sm">Сәйкес келетін оқушылар табылмады</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map(u => `
      <div class="mp-rank-row ${u.isMe ? 'is-me' : ''}">
        <div class="mp-rank-num">${u.badge}</div>
        <div class="mp-rank-avatar" style="${u.isMe ? 'background:var(--primary-dim);color:var(--primary);font-weight:800;' : ''}">
          ${u.avatar}
        </div>
        <div class="mp-rank-info">
          <div class="mp-rank-name">
            ${u.name}
            ${u.isMe ? '<span class="mp-me-badge">Сіз</span>' : ''}
          </div>
          <div class="mp-rank-school">${u.school}</div>
        </div>
        <div class="mp-rank-right">
          <div class="mp-rank-elo">${u.rating} ELO</div>
          <div class="mp-rank-league">${u.leagueName}</div>
        </div>
      </div>
    `).join('');
  }

  // ── БЛИЦ-ДУЭЛЬ СИМУЛЯТОРЫ (ИНТЕРАКТИВТІ ДЕМО) ─────────────
  function startBlitzDuel() {
    const arenaBox = document.getElementById('mpArenaInteractive');
    const startBtn = document.getElementById('mpStartDuelBtn');
    if (!arenaBox) return;

    if (startBtn) startBtn.style.display = 'none';
    arenaBox.style.display = 'block';

    // 1-қадам: Іздеу анимациясы
    arenaBox.innerHTML = `
      <div class="duel-box" style="text-align:center; padding:30px 20px;">
        <div style="font-size:36px; margin-bottom:12px; animation:bounce 1s infinite;">⚔️</div>
        <div class="h3" style="margin-bottom:6px;">Қарсылас іздестірілуде...</div>
        <div class="txt-sm" style="color:var(--text-sec); margin-bottom:16px;">Сіздің ELO рейтингіңізге сәйкес ойыншы таңдалуда</div>
        <div style="width:36px; height:36px; border:3px solid var(--border); border-top-color:var(--primary); border-radius:50%; margin:0 auto; animation:spin 1s linear infinite;"></div>
      </div>
    `;

    setTimeout(() => {
      // Кездейсоқ 3 сұрақ таңдау
      const shuffled = [...BLITZ_QUESTIONS].sort(() => 0.5 - Math.random());
      duelState = {
        active: true,
        round: 0,
        questions: shuffled.slice(0, 3),
        myScore: 0,
        oppScore: 0,
        timer: null,
        timeLeft: 10,
        answered: false,
        opponentName: "Айдос Қасымов",
        opponentSchool: "НЗМ Талдықорған",
        opponentElo: 1315
      };
      renderDuelRound();
    }, 1200);
  }

  function renderDuelRound() {
    const arenaBox = document.getElementById('mpArenaInteractive');
    if (!arenaBox || !duelState.active) return;

    if (duelState.round >= duelState.questions.length) {
      finishDuel();
      return;
    }

    const currentQ = duelState.questions[duelState.round];
    duelState.answered = false;
    duelState.timeLeft = 10;

    arenaBox.innerHTML = `
      <div class="duel-box">
        <div class="duel-vs-header">
          <div class="duel-fighter">
            <div class="duel-fighter-avatar">${getUserName().charAt(0).toUpperCase()}</div>
            <div>
              <div style="font-size:12px; font-weight:800; color:var(--navy);">${getUserName()} (Сіз)</div>
              <div style="font-size:11px; color:var(--primary); font-weight:700;">Ұпай: ${duelState.myScore}</div>
            </div>
          </div>
          <div style="font-size:14px; font-weight:800; color:var(--text-sec);">VS</div>
          <div class="duel-fighter" style="text-align:right;">
            <div>
              <div style="font-size:12px; font-weight:800; color:var(--navy);">${duelState.opponentName}</div>
              <div style="font-size:11px; color:var(--gold); font-weight:700;">Ұпай: <span id="oppScoreDisplay">${duelState.oppScore}</span></div>
            </div>
            <div class="duel-fighter-avatar opponent">АҚ</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase;">Раунд ${duelState.round + 1} / 3</span>
          <span id="duelTimerText" style="font-size:11px; font-weight:800; color:var(--text-sec); font-family:var(--font-mono);">⏳ 10с</span>
        </div>

        <div class="duel-timer-bar">
          <div id="duelTimerFill" class="duel-timer-fill" style="width:100%;"></div>
        </div>

        <div class="duel-question">${currentQ.q}</div>

        <div class="duel-options-grid">
          ${currentQ.options.map((opt, idx) => `
            <button class="duel-opt-btn" onclick="Multiplayer.handleDuelAnswer(${idx})">
              <b>${String.fromCharCode(65 + idx)}.</b> ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Қарсыластың жауап беруін симуляциялау (0.9s - 2.2s аралығында)
    const oppAnswerDelay = 900 + Math.random() * 1300;
    setTimeout(() => {
      if (duelState.active && Math.random() < 0.7) {
        duelState.oppScore++;
        const oppEl = document.getElementById('oppScoreDisplay');
        if (oppEl) oppEl.textContent = String(duelState.oppScore);
      }
    }, oppAnswerDelay);

    // Таймер
    clearInterval(duelState.timer);
    duelState.timer = setInterval(() => {
      duelState.timeLeft--;
      const timerText = document.getElementById('duelTimerText');
      const timerFill = document.getElementById('duelTimerFill');
      if (timerText) timerText.textContent = `⏳ ${duelState.timeLeft}с`;
      if (timerFill) timerFill.style.width = `${(duelState.timeLeft / 10) * 100}%`;

      if (duelState.timeLeft <= 0) {
        clearInterval(duelState.timer);
        if (!duelState.answered) {
          handleDuelAnswer(-1); // Уақыт бітті
        }
      }
    }, 1000);
  }

  function handleDuelAnswer(selectedIdx) {
    if (duelState.answered) return;
    duelState.answered = true;
    clearInterval(duelState.timer);

    const currentQ = duelState.questions[duelState.round];
    const isCorrect = selectedIdx === currentQ.correct;

    if (isCorrect) {
      duelState.myScore++;
    }

    const buttons = document.querySelectorAll('.duel-opt-btn');
    buttons.forEach((btn, idx) => {
      btn.style.pointerEvents = 'none';
      if (idx === currentQ.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong');
      }
    });

    if (typeof showToast === 'function') {
      if (isCorrect) showToast("Дұрыс жауап! 🎯 +1 ұпай", "✓");
      else showToast("Қате жауап! Дұрысы: " + currentQ.options[currentQ.correct], "✗");
    }

    setTimeout(() => {
      duelState.round++;
      renderDuelRound();
    }, 1400);
  }

  function finishDuel() {
    clearInterval(duelState.timer);
    duelState.active = false;

    const arenaBox = document.getElementById('mpArenaInteractive');
    if (!arenaBox) return;

    const isWin = duelState.myScore > duelState.oppScore;
    const isDraw = duelState.myScore === duelState.oppScore;
    const eloDelta = isWin ? 25 : (isDraw ? 5 : -10);

    const currentRating = getUserRating();
    const newRating = Math.max(1000, currentRating + eloDelta);
    setUserRating(newRating);

    arenaBox.innerHTML = `
      <div class="duel-box" style="text-align:center; padding:24px 18px;">
        <div style="font-size:46px; margin-bottom:8px;">${isWin ? '🏆' : (isDraw ? '🤝' : '⚡')}</div>
        <div class="h2" style="margin-bottom:6px;">
          ${isWin ? 'Керемет Жеңіс!' : (isDraw ? 'Тең ойын!' : 'Жақсы ойын!')}
        </div>
        <div class="txt-sm" style="color:var(--text-sec); margin-bottom:14px;">
          Нәтиже: Сіз <b>${duelState.myScore}</b> : <b>${duelState.oppScore}</b> ${duelState.opponentName}
        </div>

        <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(37,99,235,0.08); border:1.5px solid #BFDBFE; padding:8px 18px; border-radius:12px; margin-bottom:16px;">
          <span style="font-size:13px; font-weight:700; color:var(--navy);">Рейтинг өзгерісі:</span>
          <span style="font-size:16px; font-weight:800; font-family:var(--font-mono); color:${isWin ? 'var(--success)' : (isDraw ? 'var(--primary)' : 'var(--danger)')};">
            ${eloDelta > 0 ? '+' : ''}${eloDelta} ELO
          </span>
          <span style="font-size:13px; color:var(--text-sec);">(${newRating} ELO)</span>
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button class="cta-btn" style="padding:10px 18px;" onclick="Multiplayer.startBlitzDuel()">
            🔄 Тағы ойнау
          </button>
          <button class="btn-back" style="padding:10px 18px;" onclick="Multiplayer.closeBlitzDuel()">
            Артқа
          </button>
        </div>
      </div>
    `;

    // Рейтинг тақтасын дереу жаңарту
    renderAll();
  }

  function closeBlitzDuel() {
    clearInterval(duelState.timer);
    duelState.active = false;
    const arenaBox = document.getElementById('mpArenaInteractive');
    const startBtn = document.getElementById('mpStartDuelBtn');
    if (arenaBox) arenaBox.style.display = 'none';
    if (startBtn) startBtn.style.display = 'flex';
  }

  // ── СҮЗГІ ЖӘНЕ ІЗДЕУ ──────────────────────────────────────
  function setLeagueFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.mp-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    renderLeaderboardList();
  }

  function handleSearch(query) {
    searchQuery = query || '';
    renderLeaderboardList();
  }

  // ── ҮЙЛЕСІМДІЛІК API (БАСТАПҚЫ ФУНКЦИЯЛАР ҮШІН) ───────────
  function init() {
    renderAll();
  }

  function loadLeaderboard() {
    renderAll();
  }

  function showView(viewName) {
    // Ескі интерфейс шақыруларымен үйлесімділік
    if (viewName === 'leaderboard') {
      renderAll();
    }
  }

  // ── PUBLIC EXPORT ─────────────────────────────────────────
  global.Multiplayer = {
    init,
    loadLeaderboard,
    showView,
    renderAll,
    setLeagueFilter,
    handleSearch,
    startBlitzDuel,
    closeBlitzDuel,
    handleDuelAnswer,
    // Ескі шақыруларға қауіпсіз заглушкалар:
    joinQueue: () => startBlitzDuel(),
    leaveQueue: () => closeBlitzDuel(),
    logout: () => { if (typeof showToast === 'function') showToast("Сіз басты беттесіз", "ℹ️"); },
    quickAuth: () => { if (typeof showToast === 'function') showToast("Жүйеге кіру орындалды", "✓"); },
    login: async () => true,
    register: async () => true,
    checkServerHealth: async () => true,
    answer: () => {}
  };

  // Бет жүктелгенде автоматты іске қосу
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      renderAll();
    });
  }

})(typeof window !== 'undefined' ? window : this);
