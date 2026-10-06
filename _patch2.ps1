$ErrorActionPreference = 'Stop'
$path = 'c:\Users\almah\Downloads\physX-main\home.js'
$text = [IO.File]::ReadAllText($path)

function Replace-Block([string]$text, [string]$startMark, [string]$endMark, [string]$newBlock) {
  $s = $text.IndexOf($startMark)
  if ($s -lt 0) { throw "Start not found: $startMark" }
  $e = $text.IndexOf($endMark, $s)
  if ($e -lt 0) { throw "End not found: $endMark" }
  return $text.Substring(0, $s) + $newBlock + $text.Substring($e)
}

$shop = @'
const SHOP_ITEMS = [
  { id: "premium-opt", title: "Премиум Логика курсы", icon: "🧠", price: 120, desc: "Ақиқат кестелері + практика", unlocks: "optics" },
  { id: "premium-thermo", title: "Премиум Сан жүйелері", icon: "🔢", price: 180, desc: "Екілік, сегіздік, оналтылық", unlocks: "thermodynamics" },
  { id: "premium-mech", title: "Премиум Желілер курсы", icon: "🌐", price: 100, desc: "IP, протоколдар, қауіпсіздік", unlocks: "mechanics" },
  { id: "premium-quantum", title: "Деректер қоры", icon: "🗄️", price: 250, desc: "SQL және кестелер", unlocks: "quantum" },
  { id: "vip-tutor", title: "VIP Тьютор қолдау", icon: "👨‍🏫", price: 300, desc: "Жеке оқытушымен 1-1 сабақтар", unlocks: null },
  { id: "exam-prep", title: "ҰБТ дайындық пакеті", icon: "📝", price: 200, desc: "500+ информатика тесттері", unlocks: null }
]
'@
$text = Replace-Block $text 'const SHOP_ITEMS = [' ";`r`n`r`nlet pendingPurchase" $shop
# try unix newlines if failed pattern
if ($text -notmatch 'Премиум Логика') {
  $text = [IO.File]::ReadAllText($path)
  $text = Replace-Block $text 'const SHOP_ITEMS = [' ";`n`nlet pendingPurchase" $shop
}

$oldTopics = @'
  const topics = [
    { id: 'kinematics', emoji: '🏃', title: 'Кинематика', unlocked: true },
    { id: 'electricity', emoji: '⚡', title: 'Электр', unlocked: true },
    { id: 'optics', emoji: '🔬', title: 'Оптика', unlockKey: 'premium-opt' },
    { id: 'thermodynamics', emoji: '🌡️', title: 'Термодинамика', unlockKey: 'premium-thermo' },
    { id: 'mechanics', emoji: '⚙️', title: 'Механика', unlockKey: 'premium-mech' },
    { id: 'quantum', emoji: '⚛️', title: 'Квант', unlockKey: 'premium-quantum' }
  ];
'@

$newTopics = @'
  const topics = [
    { id: 'kinematics', emoji: '🔀', title: 'Алгоритмдер', unlocked: true },
    { id: 'electricity', emoji: '🐍', title: 'Python', unlocked: true },
    { id: 'optics', emoji: '🧠', title: 'Логика', unlockKey: 'premium-opt' },
    { id: 'thermodynamics', emoji: '🔢', title: 'Сан жүйелері', unlockKey: 'premium-thermo' },
    { id: 'mechanics', emoji: '🌐', title: 'Желілер', unlockKey: 'premium-mech' },
    { id: 'quantum', emoji: '🗄️', title: 'ДҚ', unlockKey: 'premium-quantum' }
  ];
'@

if ($text.Contains($oldTopics)) {
  $text = $text.Replace($oldTopics, $newTopics)
} else {
  Write-Output 'topics block exact match failed, trying line-based'
}

$courses = @'
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
]
'@

$text = Replace-Block $text 'const COURSES = [' ";`n`n// ================== TESTS DATA" $courses

$tests = @'
const TESTS = [
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
};

'@

$text = Replace-Block $text 'const TESTS = [' "function renderTests()" $tests

$premium = @'
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
}
'@
$text = Replace-Block $text 'const PREMIUM_COURSES = {' ";`n`nfunction loadProgress" $premium

$mini = @'
const MINI_QUIZZES = {
  kinematics: [
    { q: "Алгоритм дегеніміз не?", options: ["Қадамдар тізбегі", "Тек код", "Файл"], correct: 0 },
    { q: "Цикл не істейді?", options: ["Бір рет орындайды", "Қайталайды", "Өшіреді"], correct: 1 }
  ],
  electricity: [
    { q: "print() не үшін?", options: ["Шығару", "Кіріс", "Цикл"], correct: 0 },
    { q: "True/False типі?", options: ["int", "bool", "str"], correct: 1 }
  ]
}
'@
$text = Replace-Block $text 'const MINI_QUIZZES = {' ";`n`nfunction startMiniQuiz" $mini

# Simple replacements
$text = $text.Replace('джоуль', 'бит')
$text = $text.Replace('Джоуль', 'Бит')
$text = $text.Replace([char]0x26A1, [char]0x25C6) # ⚡ to ◆ - may not work for emoji
$text = $text.Replace('⚡', '◆')
$text = $text.Replace("Сәлем! Физикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін.", "Сәлем! Информатикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін.")
$text = $text.Replace("Сәлем! Физикадан сұрағыңды жаз.", "Сәлем! Информатикадан сұрағыңды жаз.")
$text = $text.Replace('physX платформасына', 'InfoX платформасына')
$text = $text.Replace("console.log('physX initialized');", "console.log('InfoX initialized');")
$text = $text.Replace('(function initPhysX()', '(function initInfoX()')
$text = $text.Replace('Зерттеуші! 🔬', 'Зерттеуші! 💡')
$text = $text.Replace("['#00f2a0', '#00E0FF', '#9D00FF', '#FFD700', '#FF0055']", "['#2563EB', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B']")
$text = $text.Replace("btn.style.background = 'var(--text-main)';", "btn.style.background = 'var(--primary)';")
$text = $text.Replace('var(--purple)', 'var(--primary)')
$text = $text.Replace('rgba(157, 0, 255, 0.1)', 'rgba(37, 99, 235, 0.08)')
$text = $text.Replace('rgba(157, 0, 255, 0.3)', 'rgba(37, 99, 235, 0.25)')
$text = $text.Replace('{ q: "Физика ғылымы нені зерттейді?", options: ["Табиғатты", "Қоғамды", "Тарихты"], correct: 0 },', '{ q: "Информатика нені зерттейді?", options: ["Ақпарат пен алгоритмдерді", "Тарихты", "Географияны"], correct: 0 },')
$text = $text.Replace('Сен физика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Формулаларды LaTeX форматында (мысалы $E=mc^2$ немесе $$...$$) жаз. Қазақша сөйле. Ешқашан оқушыға есепті шығарып берме, тек шығарылу жолын түсіндір', 'Сен информатика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Код үлгілерін анық көрсет. Қазақша сөйле. Ешқашан оқушыға есепті толық шығарып берме, тек шешу жолын түсіндір')

[IO.File]::WriteAllText($path, $text)
Write-Output 'OK'
Write-Output ("has logic shop: " + ($text -match 'Премиум Логика'))
Write-Output ("has algorithms topic: " + ($text -match "title: 'Алгоритмдер'"))
Write-Output ("has python courses: " + ($text -match 'Программалау'))
Write-Output ("physics left: " + ([regex]::Matches($text, 'физика|Физика|Кинематика|Ньютон|джоуль')).Count)
