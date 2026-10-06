# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"c:\Users\almah\Downloads\physX-main\home.js")
text = p.read_text(encoding="utf-8")

# Replace COURSE_CONTENT block
start = text.index("const COURSE_CONTENT = {")
end = text.index("};\n\nfunction openTopic")
new_course = r'''const COURSE_CONTENT = {
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
}'''

text = text[:start] + new_course + text[end:]

# Replace SHOP_ITEMS
start = text.index("const SHOP_ITEMS = [")
end = text.index("];\n\nlet pendingPurchase")
new_shop = '''const SHOP_ITEMS = [
  { id: "premium-opt", title: "Премиум Логика курсы", icon: "🧠", price: 120, desc: "Ақиқат кестелері + практика", unlocks: "optics" },
  { id: "premium-thermo", title: "Премиум Сан жүйелері", icon: "🔢", price: 180, desc: "Екілік, сегіздік, оналтылық", unlocks: "thermodynamics" },
  { id: "premium-mech", title: "Премиум Желілер курсы", icon: "🌐", price: 100, desc: "IP, протоколдар, қауіпсіздік", unlocks: "mechanics" },
  { id: "premium-quantum", title: "Деректер қоры", icon: "🗄️", price: 250, desc: "SQL және кестелер", unlocks: "quantum" },
  { id: "vip-tutor", title: "VIP Тьютор қолдау", icon: "👨‍🏫", price: 300, desc: "Жеке оқытушымен 1-1 сабақтар", unlocks: null },
  { id: "exam-prep", title: "ҰБТ дайындық пакеті", icon: "📝", price: 200, desc: "500+ информатика тесттері", unlocks: null }
]'''
text = text[:start] + new_shop + text[end:]

# Replace topics array in updateHomeTopics
old_topics = '''  const topics = [
    { id: 'kinematics', emoji: '🏃', title: 'Кинематика', unlocked: true },
    { id: 'electricity', emoji: '⚡', title: 'Электр', unlocked: true },
    { id: 'optics', emoji: '🔬', title: 'Оптика', unlockKey: 'premium-opt' },
    { id: 'thermodynamics', emoji: '🌡️', title: 'Термодинамика', unlockKey: 'premium-thermo' },
    { id: 'mechanics', emoji: '⚙️', title: 'Механика', unlockKey: 'premium-mech' },
    { id: 'quantum', emoji: '⚛️', title: 'Квант', unlockKey: 'premium-quantum' }
  ];'''
new_topics = '''  const topics = [
    { id: 'kinematics', emoji: '🔀', title: 'Алгоритмдер', unlocked: true },
    { id: 'electricity', emoji: '🐍', title: 'Python', unlocked: true },
    { id: 'optics', emoji: '🧠', title: 'Логика', unlockKey: 'premium-opt' },
    { id: 'thermodynamics', emoji: '🔢', title: 'Сан жүйелері', unlockKey: 'premium-thermo' },
    { id: 'mechanics', emoji: '🌐', title: 'Желілер', unlockKey: 'premium-mech' },
    { id: 'quantum', emoji: '🗄️', title: 'ДҚ', unlockKey: 'premium-quantum' }
  ];'''
if old_topics not in text:
    raise SystemExit("topics block not found")
text = text.replace(old_topics, new_topics)

# Replace COURSES
start = text.index("const COURSES = [")
end = text.index("];\n\n// ================== TESTS DATA")
new_courses = '''const COURSES = [
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
      { id: "el-2", title: "Python: if/else", level: "8-сынып", url: "https://www.youtube.com/results?search_query=python+if+else+қазақша" },
      { id: "el-3", title: "Python: циклдар", level: "10-сынып", url: "https://www.youtube.com/results?search_query=python+for+while+цикл" },
      { id: "el-4", title: "Python: массивтер", level: "11-сынып", url: "https://www.youtube.com/results?search_query=python+list+массив" }
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
      { id: "quant-2", title: "SQL негіздері", level: "11-сынып", url: "https://www.youtube.com/results?search_query=sql+негіздері+информатика" }
    ]
  }
]'''
text = text[:start] + new_courses + text[end:]

# Replace TESTS and TEST_QUESTIONS
start = text.index("const TESTS = [")
end = text.index("};\n\nfunction renderTests")
# Need to include TEST_QUESTIONS closing
# Actually end at function renderTests - but TEST_QUESTIONS ends with };
# Find properly
end = text.index("function renderTests()")
new_tests = '''const TESTS = [
  { id: "test-kinematics", title: "Алгоритмдер", questions: 3, reward: 50, icon: "🔀" },
  { id: "test-dynamics", title: "Логика", questions: 3, reward: 60, icon: "🧠" },
  { id: "test-energy", title: "Сан жүйелері", questions: 3, reward: 50, icon: "🔢" },
  { id: "test-electro", title: "Python", questions: 3, reward: 70, icon: "🐍" },
  { id: "test-optics", title: "Желілер", questions: 2, reward: 80, icon: "🌐" },
  { id: "test-ent", title: "ҰБТ-ға дайындық", questions: 3, reward: 100, icon: "🎓" }
];

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

'''
text = text[:start] + new_tests + text[end:]

# Replace PREMIUM_COURSES
start = text.index("const PREMIUM_COURSES = {")
end = text.index("};\n\nfunction loadProgress")
new_premium = '''const PREMIUM_COURSES = {
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
}'''
text = text[:start] + new_premium + text[end:]

# Replace MINI_QUIZZES
start = text.index("const MINI_QUIZZES = {")
end = text.index("};\n\nfunction startMiniQuiz")
new_mini = '''const MINI_QUIZZES = {
  kinematics: [
    { q: "Алгоритм дегеніміз не?", options: ["Қадамдар тізбегі", "Тек код", "Файл"], correct: 0 },
    { q: "Цикл не істейді?", options: ["Бір рет орындайды", "Қайталайды", "Өшіреді"], correct: 1 }
  ],
  electricity: [
    { q: "print() не үшін?", options: ["Шығару", "Кіріс", "Цикл"], correct: 0 },
    { q: "True/False типі?", options: ["int", "bool", "str"], correct: 1 }
  ]
}'''
text = text[:start] + new_mini + text[end:]

# Fallback physics question
text = text.replace(
    '{ q: "Физика ғылымы нені зерттейді?", options: ["Табиғатты", "Қоғамды", "Тарихты"], correct: 0 },',
    '{ q: "Информатика нені зерттейді?", options: ["Ақпарат пен алгоритмдерді", "Тарихты", "Географияны"], correct: 0 },'
)

# Simple replacements
simple = [
    ("джоуль", "бит"),
    ("Джоуль", "Бит"),
    ("⚡", "◆"),
    ("physX платформасына", "InfoX платформасына"),
    ("physX платформасына қош келдіңіз!", "InfoX платформасына қош келдіңіз!"),
    ("console.log('physX initialized');", "console.log('InfoX initialized');"),
    ("(function initPhysX()", "(function initInfoX()"),
    ("Сен физика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Формулаларды LaTeX форматында (мысалы $E=mc^2$ немесе $$...$$) жаз. Қазақша сөйле. Ешқашан оқушыға есепті шығарып берме, тек шығарылу жолын түсіндір",
     "Сен информатика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Код үлгілерін анық көрсет. Қазақша сөйле. Ешқашан оқушыға есепті толық шығарып берме, тек шешу жолын түсіндір"),
    ("Сәлем! Физикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін.",
     "Сәлем! Информатикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін."),
    ("Сәлем! Физикадан сұрағыңды жаз.",
     "Сәлем! Информатикадан сұрағыңды жаз."),
    ("showAchievement(\"Зерттеуші! 🔬\"", "showAchievement(\"Зерттеуші! 💡\""),
    ("const colors = ['#00f2a0', '#00E0FF', '#9D00FF', '#FFD700', '#FF0055'];",
     "const colors = ['#2563EB', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B'];"),
    ("btn.style.background = 'var(--text-main)';", "btn.style.background = 'var(--primary)';"),
    ("var(--purple)", "var(--primary)"),
    ("rgba(157, 0, 255, 0.1)", "rgba(37, 99, 235, 0.08)"),
    ("rgba(157, 0, 255, 0.3)", "rgba(37, 99, 235, 0.25)"),
]

for a, b in simple:
    text = text.replace(a, b)

p.write_text(text, encoding="utf-8")
print("home.js patched successfully, length:", len(text))
