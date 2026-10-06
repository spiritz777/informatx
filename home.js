// ================== COIN SYSTEM ==================
function getCoins() {
  try { return parseInt(localStorage.getItem('physx_coins') || "50"); }
  catch { return 50; }
}
function setCoins(val) {
  try { localStorage.setItem('physx_coins', String(val)); }
  catch { }
  updateCoinDisplay();
}
function addCoins(amount, reason = "") {
  const current = getCoins();
  const next = current + amount;
  setCoins(next);

  const display = document.getElementById("coinCount");
  if (display) {
    display.classList.add("coin-pop");
    setTimeout(() => display.classList.remove("coin-pop"), 600);
  }

  if (reason) {
    addNotification("coin", `+${amount} ◆`, reason, "Жаңа ғана");
  }

  showToast(`+${amount} бит! 🎉`, '◆');
}
function updateCoinDisplay() {
  const coins = getCoins();
  document.getElementById("coinCount").textContent = `◆ ${coins}`;
  ["shopCoins", "profileCoins", "sidebarCoins"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = coins;
  });
}

// ================== NOTIFICATIONS ==================
function getNotifications() {
  try { return JSON.parse(localStorage.getItem('physx_notifs') || "[]"); }
  catch { return []; }
}
function saveNotifications(arr) {
  try { localStorage.setItem('physx_notifs', JSON.stringify(arr)); }
  catch { }
}
function addNotification(type, title, text, time = "Жаңа") {
  const notifs = getNotifications();
  notifs.unshift({ type, title, text, time, id: Date.now() });
  if (notifs.length > 20) notifs.pop();
  saveNotifications(notifs);
  renderNotifications();
  showNotifBadge();
}
function renderNotifications() {
  const list = document.getElementById("notifList");
  if (!list) return;
  const notifs = getNotifications();
  if (notifs.length === 0) {
    list.innerHTML = `<div style="text-align: center; padding: 40px 20px; opacity: 0.5;">
          <div class="txt-sm">Хабарландырулар жоқ</div>
        </div>`;
    return;
  }
  const icons = { coin: "◆", achievement: "🏆", course: "📚" };
  list.innerHTML = notifs.map(n => `
        <div class="notif-item" onclick="clearNotification(${n.id})">
          <div class="notif-icon ${n.type}">${icons[n.type] || "📢"}</div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join("");
}
function clearNotification(id) {
  const notifs = getNotifications().filter(n => n.id !== id);
  saveNotifications(notifs);
  renderNotifications();
  if (notifs.length === 0) hideNotifBadge();
}
function clearNotifications() {
  saveNotifications([]);
  renderNotifications();
  hideNotifBadge();
  showToast("Барлық хабарландырулар тазартылды", '✓');
}
function toggleNotifications() {
  const panel = document.getElementById("notifPanel");
  panel.classList.toggle("active");
  if (panel.classList.contains("active")) {
    hideNotifBadge();
  }
}
function showNotifBadge() {
  const badge = document.getElementById("notifBadge");
  if (badge) badge.style.display = "block";
}
function hideNotifBadge() {
  const badge = document.getElementById("notifBadge");
  if (badge) badge.style.display = "none";
}

document.addEventListener("click", (e) => {
  const panel = document.getElementById("notifPanel");
  const notifBtn = e.target.closest(".menu-btn");
  if (!panel.contains(e.target) && !notifBtn) {
    panel.classList.remove("active");
  }
});

// ================== COURSE CONTENT ==================
const COURSE_CONTENT = {
  kinematics: {
    title: "Алгоритмдер",
    level: "8-сынып",
    videoId: "8hly31xKli0",
    sections: [
      {
        title: "Алгоритм дегеніміз не?",
        content: "Алгоритм — берілген есепті шешуге арналған нақты қадамдар тізбегі. Информатикада алгоритмдер программалаудың негізі болып табылады. Жақсы алгоритм түсінікті, бір мәнді және аяқталатын болуы керек.",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Algorithms"
      },
      {
        title: "Алгоритм қасиеттері",
        content: "Дискреттілік, анықтылық, нәтижелілік, жалпылық және түсініктілік — алгоритмнің негізгі қасиеттері. Әр қадам нақты орындалуы тиіс және шектеулі қадамнан кейін нәтиже шығуы керек.",
        formula: "input → process → output"
      },
      {
        title: "Алгоритм түрлері",
        content: "Сызықтық, тармақталған және циклдік алгоритмдер бар. Сызықтықта қадамдар кезекпен орындалады. Тармақталғанда шартқа байланысты жол таңдалады. Циклдікте әрекет қайталанады.",
        formula: "if / else / for / while",
        example: {
          title: "Мысал:",
          content: "Егер балл ≥ 50 болса — «Өтті», әйтпесе — «Қайта тапсыр». Бұл тармақталған алгоритм."
        }
      }
    ]
  },
  electricity: {
    title: "Python негіздері",
    level: "8-сынып",
    videoId: "rfscVS0vtbw",
    sections: [
      {
        title: "Python дегеніміз не?",
        content: "Python — қарапайым әрі күшті программалау тілі. ҰБТ информатикасында алгоритмдерді кодтау үшін жиі қолданылады. Айнымалылар, шарттар және циклдар — бастапқы деңгейдің негізі.",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Python"
      },
      {
        title: "Айнымалылар және типтер",
        content: "Айнымалы — дерек сақтайтын атау. Негізгі типтер: int (бүтін), float (нақты), str (мәтін), bool (True/False).",
        formula: "x = 10\nname = \"Азамат\"\nflag = True"
      },
      {
        title: "Шарттар және циклдар",
        content: "if/elif/else шартты тексереді. for және while циклдары әрекетті қайталайды. Циклдар массивтер мен есептеулерде өте маңызды.",
        formula: "for i in range(5):\n    print(i)",
        example: {
          title: "Мысал:",
          content: "1-ден 10-ға дейінгі сандардың қосындысын for циклімен есептеуге болады."
        }
      }
    ]
  },
  optics: {
    title: "Логика (Премиум)",
    level: "8-9 сынып",
    videoId: "gI-6Xk8H6hY",
    isPremium: true,
    sections: [
      {
        title: "Логикалық операциялар",
        content: "ЖӘНЕ (AND), НЕМЕСЕ (OR), ЕМЕС (NOT) — негізгі логикалық операциялар. Олар шарттарды құруда және схемаларды талдауда қолданылады.",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Logic"
      },
      {
        title: "Ақиқат кестесі",
        content: "Ақиқат кестесі — логикалық өрнектің барлық мүмкін мәндерін көрсететін кесте. ҰБТ-да жиі кездеседі.",
        formula: "A AND B → 1 тек A=1 және B=1 болса"
      },
      {
        title: "Логикалық өрнектер",
        content: "Күрделі өрнектер жақшалар мен операциялар ретімен есептеледі. NOT ең жоғары приоритетке ие, содан кейін AND, кейін OR.",
        formula: "NOT (A OR B) = (NOT A) AND (NOT B)",
        example: {
          title: "Мысал:",
          content: "Егер A=1, B=0 болса, A OR B = 1, ал A AND B = 0."
        }
      },
      {
        title: "Практикалық тапсырмалар",
        content: "Логикалық схемаларды талдау, өрнектерді жеңілдету және ақиқат кестесін толтыру — ҰБТ-ның маңызды бөлігі."
      }
    ]
  },
  thermodynamics: {
    title: "Сан жүйелері (Премиум)",
    level: "9-10 сынып",
    videoId: "1GDf61J8f7E",
    isPremium: true,
    sections: [
      {
        title: "Сан жүйелеріне кіріспе",
        content: "Сан жүйесі — сандарды жазу ережелерінің жиынтығы. Ең жиі қолданылатыны: ондық (10), екілік (2), сегіздік (8) және оналтылық (16).",
        formula: "1010₂ = 10₁₀",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Number+Systems"
      },
      {
        title: "Екілік жүйеге ауыстыру",
        content: "Ондық санды екілікке ауыстыру үшін оны 2-ге бөліп, қалдықтарды төменнен жоғарыға жазамыз.",
        formula: "13₁₀ = 1101₂",
        example: {
          title: "Мысал:",
          content: "13 ÷ 2 = 6 (қалдық 1), 6 ÷ 2 = 3 (0), 3 ÷ 2 = 1 (1), 1 ÷ 2 = 0 (1) → 1101₂"
        }
      },
      {
        title: "Ақпарат мөлшері",
        content: "1 бит — ақпараттың ең кіші бірлігі. 1 байт = 8 бит. Файлдар мен жад көлемі байт, КБ, МБ, ГБ арқылы өлшенеді.",
        formula: "1 байт = 8 бит\n1 КБ = 1024 байт"
      }
    ]
  },
  mechanics: {
    title: "Компьютерлік желілер (Премиум)",
    level: "9-10 сынып",
    videoId: "3QhU9JD94Ht",
    isPremium: true,
    sections: [
      {
        title: "Желілер негіздері",
        content: "Компьютерлік желі — дерек алмасу үшін қосылған құрылғылар тобы. LAN, WAN, Internet — негізгі желі түрлері.",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Networks"
      },
      {
        title: "IP және протоколдар",
        content: "IP-мекенжай құрылғыны желіде анықтайды. HTTP, HTTPS, TCP/IP — интернет жұмысының негізгі протоколдары.",
        formula: "IP: 192.168.1.1"
      },
      {
        title: "Клиент-сервер моделі",
        content: "Клиент сұраныс жібереді, сервер жауап қайтарады. Веб-сайттар осы модель бойынша жұмыс істейді.",
        formula: "Client → Request → Server → Response",
        example: {
          title: "Мысал:",
          content: "Браузер (клиент) сайтты ашқанда серверге HTTP сұраныс жібереді."
        }
      },
      {
        title: "Ақпараттық қауіпсіздік",
        content: "Құпия сөздер, шифрлау, антивирус және фишингтен қорғану — цифрлық қауіпсіздіктің негіздері."
      }
    ]
  },
  quantum: {
    title: "Деректер қоры (Премиум)",
    level: "11 сынып",
    videoId: "HXV3zeQKqGY",
    isPremium: true,
    sections: [
      {
        title: "Деректер қорына кіріспе",
        content: "Деректер қоры (ДҚ) — құрылымдалған ақпаратты сақтау және іздеу жүйесі. Кестелер, жолдар және бағандар арқылы ұйымдастырылады.",
        image: "https://via.placeholder.com/600x300/0F172A/67E8F9?text=Databases"
      },
      {
        title: "SQL негіздері",
        content: "SQL — деректер қорымен жұмыс істеу тілі. SELECT, INSERT, UPDATE, DELETE — негізгі командалар.",
        formula: "SELECT name FROM students WHERE grade = 11;"
      },
      {
        title: "Кілттер және байланыстар",
        content: "Primary key жолды бірегей анықтайды. Foreign key кестелерді байланыстырады. Бір-бірге, бір-көпке қатынастар жиі қолданылады.",
        formula: "PK / FK"
      },
      {
        title: "ҰБТ тапсырмалары",
        content: "Кестеден мәлімет таңдау, сұраныс құру және байланыстарды талдау — информатика ҰБТ-сының маңызды бөлігі.",
        example: {
          title: "Қолданылуы:",
          content: "Мектеп журналындағы оқушылар мен бағалар кестесін SQL арқылы байланыстыруға болады."
        }
      }
    ]
  }
};

function openTopic(topicId) {
  const content = COURSE_CONTENT[topicId];
  if (!content) {
    showToast('Курс әзірленуде...', '🚧');
    return;
  }

  // Check if this is a premium course that needs to be purchased
  if (content.isPremium) {
    const purchases = getPurchases();
    const premiumItem = Object.entries(PREMIUM_COURSES).find(([_, course]) => course.topicId === topicId);

    if (premiumItem && !purchases.includes(premiumItem[0])) {
      showToast('Бұл премиум курс! Дүкеннен сатып алыңыз 🔒', '⭐');
      setTimeout(() => setTab('shop'), 1500);
      return;
    }
  }

  document.getElementById("courseTitle").textContent = content.title;
  document.getElementById("courseLevel").textContent = content.level;

  let bodyHTML = '';
  content.sections.forEach(section => {
    bodyHTML += `<div class="theory-section">`;
    bodyHTML += `<h3>${section.title}</h3>`;
    bodyHTML += `<p>${section.content}</p>`;

    if (section.image) {
      bodyHTML += `<img src="${section.image}" class="theory-img" alt="${section.title}" />`;
    }

    if (section.formula) {
      bodyHTML += `<div class="formula-box">${section.formula}</div>`;
    }

    if (section.example) {
      bodyHTML += `
            <div class="example-box">
              <h4>${section.example.title}</h4>
              <p style="font-size: 13px; line-height: 1.6; color: var(--text-sec);">${section.example.content}</p>
            </div>
          `;
    }

    bodyHTML += `</div>`;
  });

  document.getElementById("courseBodyContent").innerHTML = bodyHTML;
  
  // Show video container
  const videoSection = document.querySelector(".video-section");
  if(videoSection) videoSection.style.display = "block";
  
  document.getElementById("videoPlayer").innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${content.videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;

  document.getElementById("courseModal").classList.add("active");

  // Lock background scroll + set accessibility state + start from top
  document.body.classList.add("modal-open");
  const _cm = document.getElementById("courseModal");
  _cm?.setAttribute("aria-hidden", "false");
  const _win = _cm?.querySelector(".course-content-window");
  if (_win) _win.scrollTop = 0;

  const coinReward = content.isPremium ? 20 : 15;
  addCoins(coinReward, content.isPremium ? "Премиум тақырып ашылды" : "Жаңа тақырып ашылды");
  showAchievement("Зерттеуші! 🔬", `"${content.title}" курсын ашып көрдіңіз`);
}

function closeCourseModal() {
  const modal = document.getElementById("courseModal");
  modal?.classList.remove("active");
  modal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  // Stop video playback and reset display
  const vp = document.getElementById("videoPlayer");
  if (vp) vp.innerHTML = "";
  
  setTimeout(() => {
    const videoSection = document.querySelector(".video-section");
    if(videoSection) videoSection.style.display = "block";
  }, 300);
}

document.getElementById("courseModal")?.addEventListener("click", (e) => {
  if (e.target.id === "courseModal") closeCourseModal();
});

// Close course modal with Escape (desktop UX)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const modal = document.getElementById("courseModal");
  if (modal?.classList.contains("active")) closeCourseModal();
});

// Achievement popup
function showAchievement(title, desc) {
  const popup = document.getElementById("achievementPopup");
  document.getElementById("achievementTitle").textContent = title;
  document.getElementById("achievementDesc").textContent = desc;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 4000);

  // Add to notifications too
  addNotification("achievement", title, desc, "Дәл қазір");
}

// ================== SHOP ==================
const SHOP_ITEMS = [
  { id: "premium-opt", title: "Премиум Логика курсы", icon: "🧠", price: 120, desc: "Ақиқат кестелері + практика", unlocks: "optics" },
  { id: "premium-thermo", title: "Премиум Сан жүйелері", icon: "🔢", price: 180, desc: "Екілік, сегіздік, оналтылық", unlocks: "thermodynamics" },
  { id: "premium-mech", title: "Премиум Желілер курсы", icon: "🌐", price: 100, desc: "IP, протоколдар, қауіпсіздік", unlocks: "mechanics" },
  { id: "premium-quantum", title: "Деректер қоры", icon: "🗄️", price: 250, desc: "SQL және кестелер", unlocks: "quantum" },
  { id: "vip-tutor", title: "VIP Тьютор қолдау", icon: "👨‍🏫", price: 300, desc: "Жеке оқытушымен 1-1 сабақтар", unlocks: null },
  { id: "exam-prep", title: "ҰБТ дайындық пакеті", icon: "📝", price: 200, desc: "500+ информатика тесттері", unlocks: null }
];

let pendingPurchase = null;

function getPurchases() {
  try { return JSON.parse(localStorage.getItem('physx_purchases') || "[]"); }
  catch { return []; }
}
function savePurchases(arr) {
  try { localStorage.setItem('physx_purchases', JSON.stringify(arr)); }
  catch { }
}
function isPurchased(itemId) {
  return getPurchases().includes(itemId);
}
function showPurchaseConfirm(itemId, price, title) {
  console.log('showPurchaseConfirm called:', { itemId, price, title });
  const coins = getCoins();
  console.log('Current coins:', coins);

  if (coins < price) {
    showToast("Жеткіліксіз бит! 😢", '❌');
    return;
  }
  if (isPurchased(itemId)) {
    showToast("Сіз бұны әлдеқашан сатып алдыңыз!", 'ℹ️');
    return;
  }

  pendingPurchase = { itemId, price, title };
  console.log('Pending purchase set:', pendingPurchase);

  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmText").textContent = `Бағасы: ${price} ⚡`;
  document.getElementById("confirmModal").classList.add("active");
  console.log('Confirm modal should be visible now');
}
function closeConfirm() {
  console.log('closeConfirm called');
  document.getElementById("confirmModal").classList.remove("active");
  pendingPurchase = null;
}
function confirmPurchase() {
  console.log('confirmPurchase called, pendingPurchase:', pendingPurchase);
  if (!pendingPurchase) return;

  const { itemId, price, title } = pendingPurchase;
  const coins = getCoins();

  console.log('Processing purchase:', { itemId, price, title, coins });

  setCoins(coins - price);
  const purchases = getPurchases();
  purchases.push(itemId);
  savePurchases(purchases);

  console.log('Purchase saved. New purchases:', purchases);

  addNotification("achievement", "Жаңа курс! 🎉", `"${title}" сатып алынды`, "Дәл қазір");
  renderShop();
  renderCourses(""); // Refresh courses to show new premium course
  updateHomeTopics(); // Refresh home page topics
  closeConfirm();
  showToast(`"${title}" сатып алынды!`, '🎉');
  showAchievement("Инвестор! 💰", `"${title}" сатып алдыңыз`);

  // Unlock topic on home page
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (item && item.unlocks) {
    unlockTopic(item.unlocks);
  }

  // Show notification that course is now in Courses section
  setTimeout(() => {
    showToast('Курс "Курстар" бөлімінде қол жетімді! 📚', '✨');
  }, 2000);

  // Switch to home tab and show notification about unlocked topic
  setTimeout(() => {
    setTab('home');
    showToast('Басты беттегі тақырып ашылды! 🎯', '🔓');
  }, 4000);
}

function unlockTopic(topicId) {
  // Remove locked class from corresponding card on home page
  const cards = document.querySelectorAll('.sub-card');
  cards.forEach(card => {
    const onclick = card.getAttribute('onclick');
    if (onclick && onclick.includes(topicId)) {
      card.classList.remove('locked');
      // Update onclick to open the topic instead of showing locked message
      card.setAttribute('onclick', `openTopic('${topicId}')`);

      // Visual feedback - animate the unlock
      card.style.transition = 'all 0.5s ease';
      card.style.transform = 'scale(1.1)';
      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 300);
    }
  });
}

function updateHomeTopics() {
  // Re-render all topic cards based on purchases
  const purchases = getPurchases();
  const topicsGrid = document.getElementById('topicsGrid');
  if (!topicsGrid) return;

  // Define all topics with their unlock requirements
  const topics = [
    { id: 'kinematics', emoji: '🔀', title: 'Алгоритмдер', unlocked: true },
    { id: 'electricity', emoji: '🐍', title: 'Python', unlocked: true },
    { id: 'optics', emoji: '🧠', title: 'Логика', unlockKey: 'premium-opt' },
    { id: 'thermodynamics', emoji: '🔢', title: 'Сан жүйелері', unlockKey: 'premium-thermo' },
    { id: 'mechanics', emoji: '🌐', title: 'Желілер', unlockKey: 'premium-mech' },
    { id: 'quantum', emoji: '🗄️', title: 'ДҚ', unlockKey: 'premium-quantum' }
  ];

  topicsGrid.innerHTML = topics.map(topic => {
    const isUnlocked = topic.unlocked || (topic.unlockKey && purchases.includes(topic.unlockKey));
    const isPremiumUnlocked = topic.unlockKey && isUnlocked && !topic.unlocked;
    const lockedClass = isUnlocked ? '' : 'locked';
    const premiumClass = isPremiumUnlocked ? 'premium-unlocked' : '';
    const onclick = isUnlocked
      ? `openTopic('${topic.id}')`
      : `showToast('${topic.title} курсын сатып алыңыз!', '🔒')`;

    // Add premium badge for unlocked premium topics
    const premiumBadge = isPremiumUnlocked
      ? '<div style="position: absolute; top: 8px; right: 8px; background: var(--purple); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 2;">⭐</div>'
      : '';

    return `
          <div class="sub-card ${lockedClass} ${premiumClass}" onclick="${onclick}" style="position: relative;">
            ${premiumBadge}
            <span class="topic-emoji">${topic.emoji}</span>
            <div class="txt-xs" style="position: relative; z-index: 1;">${topic.title}</div>
          </div>
        `;
  }).join('');

  // Animate newly unlocked cards
  setTimeout(() => {
    const unlockedCards = topicsGrid.querySelectorAll('.sub-card:not(.locked)');
    unlockedCards.forEach((card, index) => {
      if (index >= 2) { // Skip the first 2 (always unlocked)
        card.style.animation = 'bounce 0.6s ease-out';
      }
    });
  }, 100);
}

function renderShop() {
  const root = document.getElementById("shopItems");
  if (!root) return;
  const coins = getCoins();

  console.log('renderShop called, coins:', coins);

  root.innerHTML = SHOP_ITEMS.map(item => {
    const owned = isPurchased(item.id);
    const canAfford = coins >= item.price;
    const locked = !owned && !canAfford;

    console.log(`Item ${item.id}: owned=${owned}, canAfford=${canAfford}, locked=${locked}`);

    return `
          <div class="shop-item premium ${locked ? 'locked' : ''}" 
               data-item-id="${item.id}"
               data-price="${item.price}"
               data-title="${item.title}"
               ${!owned && canAfford ? `style="cursor: pointer;"` : ''}>
            <div class="shop-icon">${item.icon}</div>
            <div class="shop-content">
              <div class="h3" style="font-size: 14px; margin-bottom: 2px;">${item.title}</div>
              <div class="txt-sm">${item.desc}</div>
            </div>
            <div class="shop-price ${owned ? 'owned' : ''}">
              ${owned ? '✓ Сатып алынды' : `<span style="font-size: 18px;">⚡</span> ${item.price}`}
            </div>
          </div>
        `;
  }).join("");

  // Add click handlers after rendering
  const shopItems = document.querySelectorAll('.shop-item');
  console.log('Found shop items:', shopItems.length);

  shopItems.forEach(el => {
    const itemId = el.dataset.itemId;
    const owned = isPurchased(itemId);
    const canAfford = coins >= parseInt(el.dataset.price);

    console.log(`Adding handler for ${itemId}: owned=${owned}, canAfford=${canAfford}`);

    if (!owned && canAfford) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        console.log('Shop item clicked:', itemId);
        const price = parseInt(el.dataset.price);
        const title = el.dataset.title;
        showPurchaseConfirm(itemId, price, title);
      });
    } else if (!owned && !canAfford) {
      el.addEventListener('click', () => {
        showToast("Жеткіліксіз бит! 😢", '❌');
      });
    } else if (owned) {
      el.style.cursor = 'default';
      el.addEventListener('click', () => {
        showToast("Сіз бұны әлдеқашан сатып алдыңыз!", 'ℹ️');
      });
    }
  });

  console.log('Shop rendering complete');
}

// ================== TABS ==================
function setTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  const map = {
    home: 'nav-home',
    chat: 'nav-chat',
    courses: 'nav-courses',
    shop: 'nav-shop',
    profile: 'nav-profile'
  };
  if (map[tabName] && document.getElementById(map[tabName])) {
    document.getElementById(map[tabName]).classList.add('active');
  }

  // Update home topics when switching to home tab
  if (tabName === 'home') {
    updateHomeTopics();
  }

  try { localStorage.setItem('physx_active_tab', tabName); } catch (e) { }
  window.scrollTo(0, 0);
}
function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}
function showToast(msg, icon = '✓') {
  const btn = document.querySelector('.nav-fab');
  const original = btn.innerHTML;
  btn.style.background = 'var(--success)';
  btn.innerHTML = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = 'var(--text-main)';
  }, 1500);

  const t = document.getElementById('toast');
  const tIcon = document.getElementById('toastIcon');
  const tText = document.getElementById('toastText');
  if (t) {
    tIcon.textContent = icon;
    tText.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
  }
}
function startLesson() {
  openTopic('electricity');
}
function primaryAction() {
  showAchievement("Тапсырма қосылды! ✅", "Жаңа тапсырма тізімге қосылды");
  addCoins(5, "Белсенділік көрсеттіңіз");
}
setTimeout(() => {
  const fill = document.querySelector('.prog-fill');
  if (fill) fill.style.width = '62%';
}, 500);

// ================== CHAT ==================
const API_KEY = "AIzaSyD92YziqcLPpTaVWtdxF9Q2OOnDAMBnAKw";
const MODEL = "gemini-2.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const systemInstruction = {
  parts: [{
    text: "Сен физика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Формулаларды LaTeX форматында (мысалы $E=mc^2$ немесе $$...$$) жаз. Қазақша сөйле. Ешқашан оқушыға есепті шығарып берме, тек шығарылу жолын түсіндір"
  }]
};
let chatHistory = [];

// Initialize Chat UI with greeting
setTimeout(() => {
  const container = document.getElementById('chatContainer');
  if (container && container.children.length === 0) {
    const div = document.createElement('div');
    div.className = 'chat-bubble chat-ai';
    div.innerText = "Сәлем! Физикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін.";
    container.appendChild(div);
  }
}, 1000);

function formatText(text) {
  return String(text || "")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/\n/g, "<br>");
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const container = document.getElementById('chatContainer');
  const sendBtn = document.getElementById('sendBtn');
  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-bubble chat-user';
  userMsg.innerText = text;
  container.appendChild(userMsg);
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;
  container.scrollTop = container.scrollHeight;

  chatHistory.push({ role: "user", parts: [{ text }] });

  const loadingId = 'loading-' + Date.now();
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'chat-bubble chat-ai';
  loadingMsg.id = loadingId;
  loadingMsg.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  container.appendChild(loadingMsg);
  container.scrollTop = container.scrollHeight;

  try {
    const body = { systemInstruction, contents: chatHistory };
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }
    const aiText =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
      "Жауап бос қайтты. Қайта сұрап көр.";
    chatHistory.push({ role: "model", parts: [{ text: aiText }] });

    const bubble = document.getElementById(loadingId);
    bubble.innerHTML = formatText(aiText);

    addCoins(5, "AI-мен сөйлестіңіз");

    if (window.renderMathInElement) {
      renderMathInElement(bubble, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  } catch (err) {
    console.error(err);
    const bubble = document.getElementById(loadingId);
    bubble.innerHTML = `<span style="color:var(--danger); font-size:13px;">Қате: ${err.message}</span>`;
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
    container.scrollTop = container.scrollHeight;
  }
}

document.addEventListener("keydown", (e) => {
  const activeChat = document.getElementById("tab-chat")?.classList.contains("active");
  if (!activeChat) return;
  if (e.key === "Enter") {
    const input = document.getElementById("chatInput");
    if (document.activeElement === input) sendMessage();
  }
});

// ================== FLOATING CHAT ==================
let floatChatHistory = [];

function openFloatChat() {
  const modal = document.getElementById("floatChatModal");
  modal.classList.add("active");

  const container = document.getElementById('floatChatBody');
  if (container && container.children.length === 0) {
    const div = document.createElement('div');
    div.className = 'chat-bubble chat-ai';
    div.innerText = "Сәлем! Физикадан сұрағыңды жаз.";
    container.appendChild(div);
  }

  setTimeout(() => {
    document.getElementById("floatChatInput")?.focus();
  }, 300);
}
function closeFloatChat() {
  document.getElementById("floatChatModal").classList.remove("active");
}

async function sendFloatMessage() {
  const input = document.getElementById('floatChatInput');
  const container = document.getElementById('floatChatBody');
  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-bubble chat-user';
  userMsg.innerText = text;
  container.appendChild(userMsg);
  input.value = '';
  input.disabled = true;
  container.scrollTop = container.scrollHeight;

  floatChatHistory.push({ role: "user", parts: [{ text }] });

  const loadingId = 'float-loading-' + Date.now();
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'chat-bubble chat-ai';
  loadingMsg.id = loadingId;
  loadingMsg.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  container.appendChild(loadingMsg);
  container.scrollTop = container.scrollHeight;

  try {
    const body = { systemInstruction, contents: floatChatHistory };
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }
    const aiText =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
      "Жауап бос қайтты.";
    floatChatHistory.push({ role: "model", parts: [{ text: aiText }] });

    const bubble = document.getElementById(loadingId);
    bubble.innerHTML = formatText(aiText);

    addCoins(5, "Floating чатпен сөйлестіңіз");

    if (window.renderMathInElement) {
      renderMathInElement(bubble, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  } catch (err) {
    console.error(err);
    const bubble = document.getElementById(loadingId);
    bubble.innerHTML = `<span style="color:var(--danger); font-size:13px;">Қате: ${err.message}</span>`;
  } finally {
    input.disabled = false;
    input.focus();
    container.scrollTop = container.scrollHeight;
  }
}

document.getElementById("floatChatInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendFloatMessage();
});

document.getElementById("floatChatModal")?.addEventListener("click", (e) => {
  if (e.target.id === "floatChatModal") closeFloatChat();
});

// ================== COURSES EXPANSION ==================
const COURSES = [
  {
    topic: "Алгоритмизация",
    items: [
      { id: "mech-1", title: "Алгоритмдер негіздері", level: "8-сынып", url: "https://www.youtube.com/results?search_query=алгоритмдер+информатика+8+сынып" },
      { id: "mech-2", title: "Блок-схемалар", level: "8-сынып", url: "https://www.youtube.com/results?search_query=блок+схема+алгоритм+информатика" },
      { id: "mech-3", title: "Тармақталу және циклдар", level: "9-сынып", url: "https://www.youtube.com/results?search_query=алгоритм+цикл+тармақталу" },
      { id: "mech-4", title: "Алгоритм күрделілігі", level: "9-сынып", url: "https://www.youtube.com/results?search_query=алгоритм+күрделілігі+информатика" }
    ]
  },
  {
    topic: "Программалау",
    items: [
      { id: "el-1", title: "Python: айнымалылар", level: "8-сынып", url: "https://www.youtube.com/results?search_query=python+айнымалы+бастаушылар" },
      { id: "el-2", title: "Python: if/else", level: "8-сынып", url: "https://www.youtube.com/results?search_query=python+if+else" },
      { id: "el-3", title: "Python: циклдар", level: "10-сынып", url: "https://www.youtube.com/results?search_query=python+for+while" },
      { id: "el-4", title: "Python: массивтер", level: "11-сынып", url: "https://www.youtube.com/results?search_query=python+list" }
    ]
  },
  {
    topic: "Логика",
    items: [
      { id: "op-1", title: "Логикалық операциялар", level: "8-сынып", url: "https://www.youtube.com/results?search_query=логикалық+операциялар+информатика" },
      { id: "op-2", title: "Ақиқат кестесі", level: "8-сынып", url: "https://www.youtube.com/results?search_query=ақиқат+кестесі+информатика" }
    ]
  },
  {
    topic: "Ақпарат және кодтау",
    items: [
      { id: "mol-1", title: "Сан жүйелері", level: "10-сынып", url: "https://www.youtube.com/results?search_query=сан+жүйелері+информатика" },
      { id: "mol-2", title: "Ақпарат мөлшері", level: "10-сынып", url: "https://www.youtube.com/results?search_query=бит+байт+информатика" }
    ]
  },
  {
    topic: "Желілер және ДҚ",
    items: [
      { id: "quant-1", title: "Интернет және протоколдар", level: "11-сынып", url: "https://www.youtube.com/results?search_query=компьютерлік+желілер+информатика" },
      { id: "quant-2", title: "SQL негіздері", level: "11-сынып", url: "https://www.youtube.com/results?search_query=sql+негіздері" }
    ]
  }
];

// ================== TESTS DATA (REVISED) ==================
const TESTS = [
  { id: "test-kinematics", title: "Алгоритмдер", questions: 3, reward: 50, icon: "🔀" },
  { id: "test-dynamics", title: "Логика", questions: 3, reward: 60, icon: "🧠" },
  { id: "test-energy", title: "Сан жүйелері", questions: 3, reward: 50, icon: "🔢" },
  { id: "test-electro", title: "Python", questions: 3, reward: 70, icon: "🐍" },
  { id: "test-optics", title: "Желілер", questions: 2, reward: 80, icon: "🌐" },
  { id: "test-ent", title: "ҰБТ-ға дайындық", questions: 3, reward: 100, icon: "🎓" }
];

// Map questions specifically for these tests
const TEST_QUESTIONS = {
  "test-kinematics": [
    { q: "Алгоритмнің негізгі қасиеті қандай?", options: ["Анықтылық", "Кездейсоқтық", "Шексіздік"], correct: 0 },
    { q: "Тармақталған алгоритмде не қолданылады?", options: ["Цикл", "Шарт (if)", "Тек кіріс"], correct: 1 },
    { q: "Блок-схемадағы ромб нені білдіреді?", options: ["Бастау", "Шарт/таңдау", "Шығару"], correct: 1 }
  ],
  "test-dynamics": [
    { q: "1 AND 0 нәтижесі?", options: ["1", "0", "2"], correct: 1 },
    { q: "NOT 1 нәтижесі?", options: ["0", "1", "-1"], correct: 0 },
    { q: "1 OR 0 нәтижесі?", options: ["0", "1", "Undefined"], correct: 1 }
  ],
  "test-electro": [
    { q: "Python-да бүтін сан типі?", options: ["str", "int", "bool"], correct: 1 },
    { q: "range(3) қандай мәндер береді?", options: ["1,2,3", "0,1,2", "0,1,2,3"], correct: 1 },
    { q: "Шартты тексеру операторы?", options: ["for", "if", "print"], correct: 1 }
  ]
  // Fallback for others will be handled dynamically
};

function renderTests() {
  const root = document.getElementById("testsRoot");
  if (!root) return;

  root.innerHTML = TESTS.map(t => `
    <div class="sub-card is-test" onclick="runTest('${t.id}')" style="aspect-ratio: auto; padding: 20px 10px; height: auto;">
      <span class="topic-emoji" style="font-size: 28px;">${t.icon}</span>
      <div class="txt-xs" style="margin-top: 6px; font-weight: 700; font-size: 13px;">${t.title}</div>
      <div class="txt-sm" style="font-size: 10px; opacity: 0.6; margin-top: 2px;">${t.questions} сұрақ • +${t.reward}⚡</div>
    </div>
  `).join('');
}

function runTest(testId) {
  const testData = TESTS.find(t => t.id === testId);
  if (!testData) return;

  // 1. Prepare Modal
  const modal = document.getElementById("courseModal");
  const headerTitle = document.getElementById("courseTitle");
  const headerLevel = document.getElementById("courseLevel");
  const body = document.getElementById("courseBodyContent");
  const videoPlayer = document.getElementById("videoPlayer");

  // 2. Hide Video & Set Title
  const videoSection = document.querySelector(".video-section");
  if(videoSection) videoSection.style.display = "none";
  
  headerTitle.textContent = testData.title;
  headerLevel.textContent = "Бақылау жұмысы";
  
  // 3. Get Questions (Use specific or generate dummy)
  let questions = TEST_QUESTIONS[testId];
  if (!questions) {
    // Dummy fallback if questions aren't defined
    questions = [
      { q: "Информатика нені зерттейді?", options: ["Ақпарат пен алгоритмдерді", "Тарихты", "Географияны"], correct: 0 },
      { q: "Бұл сұрақ сынақ ретінде берілген.", options: ["Дұрыс", "Қате"], correct: 0 }
    ];
  }

  // 4. Render Quiz Interface
  let currentQIndex = 0;
  let score = 0;

  function renderQuestion() {
    if (currentQIndex >= questions.length) {
      // Finish
      triggerConfetti();
      addCoins(testData.reward, "Тест тапсырылды");
      body.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; animation: fadeIn 0.5s;">
          <div style="font-size: 60px; margin-bottom: 20px;">🏆</div>
          <div class="h2">Тамаша!</div>
          <p class="txt-sm" style="margin-bottom: 20px;">Сіз ${questions.length} сұрақтың ${score}-не дұрыс жауап бердіңіз.</p>
          <div class="coins-display" style="display:inline-flex; margin-bottom: 20px; background: var(--surface-highlight);">
             +${testData.reward} ⚡
          </div>
          <button class="cta-btn" onclick="closeCourseModal()">Жабу</button>
        </div>
      `;
      return;
    }

    const q = questions[currentQIndex];
    const progressPercent = ((currentQIndex) / questions.length) * 100;

    body.innerHTML = `
      <div class="quiz-container">
        <div style="margin-bottom: 20px;">
           <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span class="txt-xs">Сұрақ ${currentQIndex + 1}/${questions.length}</span>
              <span class="txt-xs">${Math.round(progressPercent)}%</span>
           </div>
           <div class="mini-track"><div class="mini-fill" style="width:${progressPercent}%"></div></div>
        </div>

        <div class="h3" style="font-size: 18px; margin-bottom: 24px;">${q.q}</div>

        <div id="options-container">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option" onclick="handleAnswer(${idx})" id="opt-${idx}">
              <span>${opt}</span>
              <div class="status-icon"></div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Make handleAnswer global to be accessible from HTML string
  window.handleAnswer = (selectedIndex) => {
    const q = questions[currentQIndex];
    const isCorrect = selectedIndex === q.correct;
    const btn = document.getElementById(`opt-${selectedIndex}`);
    
    // UI Feedback
    if (isCorrect) {
      score++;
      btn.classList.add('selected-correct');
      btn.innerHTML += `<span>✅</span>`;
      showToast("Дұрыс!", "✓");
    } else {
      btn.classList.add('selected-wrong');
      btn.innerHTML += `<span>❌</span>`;
      
      // Highlight correct one
      const correctBtn = document.getElementById(`opt-${q.correct}`);
      correctBtn.classList.add('selected-correct');
      
      showToast("Қате!", "⚠️");
      // Vibrate on mobile if supported
      if(navigator.vibrate) navigator.vibrate(200);
    }

    // Disable all buttons
    const allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.onclick = null);

    // Next question delay
    setTimeout(() => {
      currentQIndex++;
      renderQuestion();
    }, 1200);
  };

  // 5. Open Modal
  modal.classList.add("active");
  document.body.classList.add("modal-open");
  
  // Start
  renderQuestion();
}

function startTest(testId) {
  // Keeping this for compatibility if called elsewhere, but we mostly use runTest now
  runTest(testId);
}

// ================== DAILY REWARD & CONFETTI ==================
function checkDailyReward() {
  const lastLogin = localStorage.getItem('physx_last_login_date');
  const today = new Date().toDateString();

  if (lastLogin !== today) {
    // New day!
    setTimeout(() => {
      triggerConfetti();
      addCoins(20, "Күнделікті бонус");
      showAchievement("Күнделікті бонус! 🎁", "+20 джоуль берілді");
      localStorage.setItem('physx_last_login_date', today);
    }, 2000);
  }
}

function triggerConfetti() {
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#00f2a0', '#00E0FF', '#9D00FF', '#FFD700', '#FF0055'];

  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2,
      vx: Math.random() * 2 - 1
    });
  }

  let frame = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y > canvas.height) p.y = -20;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
    });
    frame++;
    if (frame < 200) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  loop();
}


// Premium courses - only shown when purchased
const PREMIUM_COURSES = {
  "premium-opt": {
    id: "premium-opt-course",
    title: "Логика (Премиум курс)",
    level: "8-9 сынып",
    topicId: "optics",
    icon: "🧠"
  },
  "premium-thermo": {
    id: "premium-thermo-course",
    title: "Сан жүйелері (Премиум курс)",
    level: "9-10 сынып",
    topicId: "thermodynamics",
    icon: "🔢"
  },
  "premium-mech": {
    id: "premium-mech-course",
    title: "Желілер (Премиум курс)",
    level: "9-10 сынып",
    topicId: "mechanics",
    icon: "🌐"
  },
  "premium-quantum": {
    id: "premium-quantum-course",
    title: "Деректер қоры (Премиум курс)",
    level: "11 сынып",
    topicId: "quantum",
    icon: "🗄️"
  }
};

function loadProgress() {
  try { return JSON.parse(localStorage.getItem('physx_course_progress') || "{}"); }
  catch { return {}; }
}
function saveProgress(obj) {
  try { localStorage.setItem('physx_course_progress', JSON.stringify(obj || {})); } catch (e) { }
}
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function incCourseProgress(courseId, delta = 10) {
  const p = loadProgress();
  const next = clamp((p[courseId] ?? 0) + delta, 0, 100);
  p[courseId] = next;
  saveProgress(p);
  renderCourses(document.getElementById("courseSearch")?.value || "");
  renderProfileCourses();
}
function openCourse(url, courseId) {
  incCourseProgress(courseId, 5);
  addCoins(10, "Курс көрдіңіз");
  window.open(url, "_blank");
}

function openPremiumCourse(topicId, courseId) {
  openTopic(topicId);
  incCourseProgress(courseId, 5);
  addCoins(15, "Премиум курс көрдіңіз");
}
// ================== GRADE FILTERING & PERSONAL PLAN ==================
function getUserGrade() {
  try {
    const user = JSON.parse(localStorage.getItem('physx_user') || "{}");
    return user.grade || "8";
  } catch { return "8"; }
}

function generatePersonalPlan() {
  const grade = getUserGrade();
  const progress = loadProgress();
  const topics = Object.keys(COURSE_CONTENT);

  // Find a topic with low progress
  let recommended = topics.find(t => (progress[t] || 0) < 30) || topics[0];
  const course = COURSE_CONTENT[recommended];

  const plan = {
    id: `personal-${Date.now()}`,
    title: `Жеке жоспар: ${course.title}`,
    topic: "AI Ұсынысы",
    level: `${grade}-сынып`,
    progress: 0,
    linkedTopic: recommended
  };

  let personalPlans = JSON.parse(localStorage.getItem('physx_personal_plans') || "[]");
  personalPlans.unshift(plan);
  localStorage.setItem('physx_personal_plans', JSON.stringify(personalPlans));

  renderProfileCourses();
  showToast("Жеке жоспар құрылды!", "🤖");
}

// ================== MINI QUIIZES ==================
const MINI_QUIZZES = {
  kinematics: [
    { q: "Алгоритм дегеніміз не?", options: ["Қадамдар тізбегі", "Тек код", "Файл"], correct: 0 },
    { q: "Цикл не істейді?", options: ["Бір рет орындайды", "Қайталайды", "Өшіреді"], correct: 1 }
  ],
  electricity: [
    { q: "print() не үшін?", options: ["Шығару", "Кіріс", "Цикл"], correct: 0 },
    { q: "True/False типі?", options: ["int", "bool", "str"], correct: 1 }
  ]
  // Add more as needed
};

function startMiniQuiz(topicId) {
  const questions = MINI_QUIZZES[topicId];
  if (!questions) {
    showToast("Бұл тақырыпқа тест дайын емес", "construction");
    return;
  }

  let correctCount = 0;
  let currentQ = 0;

  // Simple prompt-based quiz for MVP (or replace with modal later)
  // Since specific UI wasn't asked for mini-quiz, using a simple interaction loop for now
  // effectively blocking for user input. For a better UX, a modal would be ideal.
  // Let's implement a simple modal reuse or confirm-style flow.
  // Actually, let's use the existing float chat modal as a container or create a quick dynamic overlay.

  // For speed and reliability, I'll use a sequence of browser prompts/confirms or a quick custom overlay.
  // Given "Beautiful and clear", prompts are bad.
  // I'll render the quiz INTO the course modal body!

  const container = document.getElementById('courseBodyContent');
  container.innerHTML = `
        <div class="quiz-interface">
          <h3>Мини-тест: ${COURSE_CONTENT[topicId].title}</h3>
          <div id="mq-container"></div>
        </div>
      `;

  function renderQ(idx) {
    if (idx >= questions.length) {
      const earned = correctCount * 10;
      addCoins(earned, "Мини-тест");
      container.innerHTML = `
            <div style="text-align:center; padding: 40px;">
              <h3>Тест аяқталды!</h3>
              <p>Нәтиже: ${correctCount}/${questions.length}</p>
              <p style="color:var(--success)">+${earned} ⚡</p>
              <button class="cta-btn" onclick="openTopic('${topicId}')">Қайту</button>
            </div>
          `;
      return;
    }

    const q = questions[idx];
    const html = `
          <div class="card" style="margin-top:20px;">
            <div class="h3" style="margin-bottom:15px;">${idx + 1}. ${q.q}</div>
            <div style="display:grid; gap:10px;">
              ${q.options.map((opt, i) => `
                <button class="option-btn" onclick="checkMq(${idx}, ${i})">${opt}</button>
              `).join('')}
            </div>
          </div>
        `;
    document.getElementById('mq-container').innerHTML = html;
  }

  window.checkMq = (qIdx, optIdx) => {
    if (questions[qIdx].correct === optIdx) {
      correctCount++;
      showToast("Дұрыс!", "success");
    } else {
      showToast("Қате!", "error");
    }
    renderQ(qIdx + 1);
  };

  renderQ(0);
}

// Updated openTopic to include Quiz button
const _originalOpenTopic = openTopic;
openTopic = function (topicId) {
  _originalOpenTopic(topicId);
  // Inject quiz button into the modal header or top of body
  const btn = document.createElement('button');
  btn.className = 'cta-btn';
  btn.style.marginTop = '10px';
  btn.style.width = '100%';
  btn.innerHTML = '📝 Мини-тест тапсыру (+⚡)';
  btn.onclick = () => startMiniQuiz(topicId);

  const body = document.getElementById('courseBodyContent');
  body.insertBefore(btn, body.firstChild);
}

function renderCourses(filterText = "") {
  const root = document.getElementById("coursesRoot");
  if (!root) return;
  const q = (filterText || "").toLowerCase().trim();
  const progress = loadProgress();
  const purchases = getPurchases();
  const userGrade = getUserGrade(); // e.g., "8" or "9"

  root.innerHTML = "";

  // Helper to check grade match
  // If course level is "8-сынып", and user is "8" -> match
  // If course is "8-9 сынып", and user is "8" or "9" -> match.
  const isGradeMatch = (levelStr) => {
    return levelStr.includes(userGrade);
  };

  // Check if user has any premium courses
  const hasPremiumCourses = Object.keys(PREMIUM_COURSES).some(key => purchases.includes(key));

  // Render Premium Courses first if user has any
  if (hasPremiumCourses) {
    const premiumItems = [];
    Object.entries(PREMIUM_COURSES).forEach(([purchaseId, course]) => {
      if (purchases.includes(purchaseId)) {
        // Apply Grade Filter here too? Maybe not for purchased ones, but requested "сделай так чтобы при выборе опредленного класса то в курсах были те курсы за конкретный класс" implies list filtering.
        // Let's filter premium too if it doesn't match, or maybe keep purchased ones always visible? 
        // Better UX: Show purchased always. 
        const match = !q || (course.title + " " + course.level).toLowerCase().includes(q);
        if (match) {
          premiumItems.push({ ...course, purchaseId });
        }
      }
    });

    if (premiumItems.length > 0) {
      const wrap = document.createElement("div");
      wrap.className = "course-accordion";
      wrap.innerHTML = `
            <div class="acc-head" style="background: linear-gradient(135deg, rgba(157, 0, 255, 0.1) 0%, var(--surface) 100%); border-bottom: 1px solid rgba(157, 0, 255, 0.3);">
              <div class="left">
                <div class="h3" style="font-size:14px; color: var(--purple);">⭐ Премиум Курстар</div>
                <div class="txt-sm">${premiumItems.length} эксклюзивті курс</div>
              </div>
              <div class="right">
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </div>
            </div>
            <div class="acc-body"></div>
          `;
      const body = wrap.querySelector(".acc-body");

      premiumItems.forEach(item => {
        const val = progress[item.id] ?? 0;
        const node = document.createElement("div");
        node.className = "course-item";
        node.innerHTML = `
              <div class="course-row">
                <div style="min-width:0;">
                  <div class="course-title" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">${item.icon}</span>
                    ${item.title}
                  </div>
                  <div class="course-meta">${item.level} • Прогресс: <b style="color:var(--purple)">${val}%</b></div>
                </div>
                <div class="course-actions">
                  <button class="course-btn" style="background: rgba(157, 0, 255, 0.1); border-color: var(--purple); color: var(--purple);" onclick="incCourseProgress('${item.id}', 10); showToast('+10% прогресс', '✓')">+10%</button>
                  <button class="course-btn primary" style="background: var(--purple);" onclick="openPremiumCourse('${item.topicId}', '${item.id}')">Оқу</button>
                </div>
              </div>
              <div class="mini-track"><div class="mini-fill" style="background: var(--purple); width:${val}%"></div></div>
            `;
        body.appendChild(node);
      });

      const head = wrap.querySelector(".acc-head");
      head.addEventListener("click", () => wrap.classList.toggle("open"));
      wrap.classList.add("open"); // Open by default
      root.appendChild(wrap);
    }
  }

  // Render regular courses with FILTER applied
  let visibleGroups = 0;

  COURSES.forEach(group => {
    // First, filter items by grade match
    const gradeFilteredItems = group.items.filter(it => isGradeMatch(it.level));

    // Then filter by search query
    const items = gradeFilteredItems.filter(it =>
      !q || (it.title + " " + it.level + " " + group.topic).toLowerCase().includes(q)
    );

    if (items.length === 0) return;
    visibleGroups++;

    const wrap = document.createElement("div");
    wrap.className = "course-accordion";
    wrap.innerHTML = `
          <div class="acc-head">
            <div class="left">
              <div class="h3" style="font-size:14px;">${group.topic}</div>
              <div class="txt-sm">${items.length} курс (${userGrade}-сынып)</div>
            </div>
            <div class="right">
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </div>
          </div>
          <div class="acc-body"></div>
        `;
    const body = wrap.querySelector(".acc-body");
    items.forEach(item => {
      const val = progress[item.id] ?? 0;
      const node = document.createElement("div");
      node.className = "course-item";
      node.innerHTML = `
            <div class="course-row">
              <div style="min-width:0;">
                <div class="course-title">${item.title}</div>
                <div class="course-meta">${item.level} • Прогресс: <b style="color:var(--primary)">${val}%</b></div>
              </div>
              <div class="course-actions">
                <button class="course-btn" onclick="incCourseProgress('${item.id}', 10); showToast('+10% прогресс', '✓')">+10%</button>
                <button class="course-btn primary" onclick="openCourse('${item.url}', '${item.id}')">Көру</button>
              </div>
            </div>
            <div class="mini-track"><div class="mini-fill" style="width:${val}%"></div></div>
          `;
      body.appendChild(node);
    });
    const head = wrap.querySelector(".acc-head");
    head.addEventListener("click", () => wrap.classList.toggle("open"));
    if (!q && visibleGroups === 1) wrap.classList.add("open");
    root.appendChild(wrap);
  });

  if (visibleGroups === 0 && !hasPremiumCourses) {
    root.innerHTML = `<div style="text-align:center; padding: 40px; opacity:0.6;">Сіздің сыныбыңызға сәйкес курстар табылмады (${userGrade}-сынып).</div>`;
  }
}

function renderProfileCourses() {
  const node = document.getElementById("profileCourses");
  if (!node) return;
  const progress = loadProgress();
  const purchases = getPurchases();

  // Personal Plans
  const plans = JSON.parse(localStorage.getItem('physx_personal_plans') || "[]");

  let html = '';

  if (plans.length > 0) {
    html += `<div style="margin-bottom:20px;">
          <div class="h3" style="margin-bottom:10px;">Жеке жоспарлар</div>
          ${plans.map(p => `
             <div class="list-item" style="border-left: 3px solid var(--accent); cursor:pointer;" onclick="openTopic('${p.linkedTopic}')">
               <div>
                  <div class="h3" style="font-size:14px;">${p.title}</div>
                  <div class="txt-sm">${p.topic} • ${p.level}</div>
               </div>
               <div class="deadline">AI</div>
             </div>
          `).join('')}
        </div>`;
  } else {
    html += `
          <div style="text-align:center; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 20px;">
            <div class="txt-sm" style="margin-bottom:10px;">Жеке оқу жоспарыңыз жоқ</div>
            <button class="cta-btn" style="font-size:13px; padding: 8px 16px;" onclick="generatePersonalPlan()">Жоспар құру (AI)</button>
          </div>
        `;
  }

  // Standard Progress List
  // ... (Rest of existing renderProfileCourses logic) ...
  // Combine regular and premium courses
  let allCourses = COURSES.flatMap(g => g.items.map(it => ({ ...it, topic: g.topic, isPremium: false })));

  Object.entries(PREMIUM_COURSES).forEach(([purchaseId, course]) => {
    if (purchases.includes(purchaseId)) {
      allCourses.push({
        id: course.id,
        title: course.title,
        level: course.level,
        topic: "⭐ Премиум",
        isPremium: true,
        topicId: course.topicId
      });
    }
  });

  allCourses.sort((a, b) => (progress[b.id] ?? 0) - (progress[a.id] ?? 0));

  html += `<div class="h3" style="margin-bottom:10px;">Курстар прогресі</div>`;

  html += allCourses.slice(0, 6).map(it => {
    const val = progress[it.id] ?? 0;
    const colorClass = it.isPremium ? 'var(--purple)' : 'var(--primary)';
    return `
          <div class="list-item" style="cursor:pointer; ${it.isPremium ? 'border-color: rgba(157, 0, 255, 0.3);' : ''}" onclick="setTab('courses'); showToast('Курстар ашылды', '📚');">
            <div style="min-width:0;">
              <div class="h3" style="font-size:14px; margin-bottom:2px;">${it.title}</div>
              <div class="txt-sm">${it.topic} • ${it.level}</div>
              <div class="mini-track" style="margin-top:10px;"><div class="mini-fill" style="background: ${colorClass}; width:${val}%"></div></div>
            </div>
            <div class="deadline" style="color: ${colorClass}">${val}%</div>
          </div>
        `;
  }).join("");

  node.innerHTML = html;
}

// ================== USER PROFILE ==================
function loadUserProfile() {
  try {
    const user = JSON.parse(localStorage.getItem('physx_user') || "{}");
    const name = user.name || "Қонақ";
    const grade = user.grade || "8";
    const role = user.role === 'teacher' ? 'Мұғалім' : 'Оқушы';

    // Update greeting
    const greetingEl = document.querySelector('.greeting .h1');
    if (greetingEl) greetingEl.textContent = `Сәлем, ${name} 👋`;

    // Update profile tab
    const pName = document.getElementById('profileName');
    const pRole = document.getElementById('profileRole');
    const pAvatar = document.getElementById('profileAvatar');

    if (pName) pName.textContent = name;
    if (pRole) pRole.textContent = `${role} • ${grade}-сынып`;
    if (pAvatar) pAvatar.textContent = name.charAt(0).toUpperCase();

    // Update sidebar
    const sbName = document.getElementById('sidebarName');
    const sbRole = document.getElementById('sidebarRole');
    const sbAvatar = document.getElementById('sidebarAvatar');

    if (sbName) sbName.textContent = name;
    if (sbRole) sbRole.textContent = `${role} • ${grade}-сынып`;
    if (sbAvatar) sbAvatar.textContent = name.charAt(0).toUpperCase();

  } catch (e) {
    console.error("Error loading profile:", e);
  }
}

// ================== INIT ==================
(function initPhysX() {
  try {
    const saved = localStorage.getItem('physx_active_tab');
    if (saved && document.getElementById('tab-' + saved)) setTab(saved);
  } catch (e) { }

  loadUserProfile(); // Load profile data first
  checkDailyReward(); // Check for daily bonus
  updateCoinDisplay();
  renderCourses("");
  renderTests(); // Render tests section
  renderProfileCourses();
  renderNotifications();
  renderShop();
  updateHomeTopics(); // Update home page topics based on purchases

  const search = document.getElementById("courseSearch");
  if (search) {
    search.addEventListener("input", (e) => renderCourses(e.target.value));
  }

  // Add event listeners for confirm modal buttons
  const confirmCancelBtn = document.querySelector('.confirm-btn.cancel');
  const confirmConfirmBtn = document.querySelector('.confirm-btn.confirm');

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', closeConfirm);
    console.log('Cancel button listener added');
  }

  if (confirmConfirmBtn) {
    confirmConfirmBtn.addEventListener('click', () => {
      console.log('Confirm button clicked');
      confirmPurchase();
    });
    console.log('Confirm button listener added');
  }

  if (!localStorage.getItem('physx_welcomed')) {
    setTimeout(() => {
      addNotification("achievement", "Қош келдіңіз! 🎉", "physX платформасына бастапқы 50 джоуль берілді", "Жаңа");
      showAchievement("Қош келдіңіз! 🎊", "physX платформасына қош келдіңіз!");
      localStorage.setItem('physx_welcomed', 'true');
    }, 1000);
  }

  // Unlock purchased topics
  getPurchases().forEach(purchaseId => {
    const item = SHOP_ITEMS.find(i => i.id === purchaseId);
    if (item && item.unlocks) {
      unlockTopic(item.unlocks);
    }
  });

  console.log('physX initialized');
})();