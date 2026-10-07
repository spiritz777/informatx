/**
 * InFormatX (IFX) — Centralized Quiz & User Data Management Module
 * Provides unified data structures, question banks, and persistent storage
 * for quizzes, user statistics, progress, streak, and attempts history.
 */

(function (global) {
  'use strict';

  // ═════════════════════════════════════════════════════════════════
  // 1. QUIZZES CATALOG
  // ═════════════════════════════════════════════════════════════════
  const QUIZZES_CATALOG = [
    {
      id: "test-ent",
      title: "ҰБТ сынама тесті",
      subtitle: "Информатика пәні бойынша кешенді тест",
      topic: "Жалпы ҰБТ",
      questionsCount: 10,
      reward: 100,
      icon: "🎓",
      level: "11-сынып",
      duration: "15 мин"
    },
    {
      id: "test-kinematics",
      title: "Алгоритмдер",
      subtitle: "Алгоритм қасиеттері, блок-схемалар және құрылымдар",
      topic: "Алгоритмдер",
      questionsCount: 6,
      reward: 50,
      icon: "🔀",
      level: "8-9 сынып",
      duration: "8 мин"
    },
    {
      id: "test-electro",
      title: "Python бағдарламалау",
      subtitle: "Синтаксис, типтер, шарттар, циклдар және тізімдер",
      topic: "Python бағдарламалау",
      questionsCount: 6,
      reward: 70,
      icon: "🐍",
      level: "8-10 сынып",
      duration: "8 мин"
    },
    {
      id: "test-dynamics",
      title: "Логика алгебрасы",
      subtitle: "Логикалық амалдар, ақиқат кестесі және заңдар",
      topic: "Логика алгебрасы",
      questionsCount: 6,
      reward: 60,
      icon: "🧠",
      level: "8-9 сынып",
      duration: "8 мин"
    },
    {
      id: "test-energy",
      title: "Сандар жүйесі",
      subtitle: "Екілік, сегіздік, ондық және оналтылық жүйелер",
      topic: "Сандар жүйесі",
      questionsCount: 6,
      reward: 50,
      icon: "🔢",
      level: "9-10 сынып",
      duration: "8 мин"
    },
    {
      id: "test-optics",
      title: "Компьютерлік желілер",
      subtitle: "IP-мекенжайлар, TCP/IP, DNS, LAN және қауіпсіздік",
      topic: "Компьютерлік желілер",
      questionsCount: 6,
      reward: 80,
      icon: "🌐",
      level: "10-11 сынып",
      duration: "8 мин"
    },
    {
      id: "test-databases",
      title: "Дерекқорлар және SQL",
      subtitle: "Реляциялық ДҚ, кілттер, SELECT, INSERT, UPDATE",
      topic: "Дерекқорлар",
      questionsCount: 6,
      reward: 75,
      icon: "🗄️",
      level: "11-сынып",
      duration: "8 мин"
    }
  ];

  // ═════════════════════════════════════════════════════════════════
  // 2. COMPREHENSIVE QUESTIONS BANK
  // ═════════════════════════════════════════════════════════════════
  const QUIZ_QUESTIONS = {
    // ҰБТ кешенді сынама тесті (10 сұрақ)
    "test-ent": [
      {
        q: "2 санының 8-ші дәрежесі (2⁸) қандай санға тең?",
        options: ["128", "256", "512", "64", "1024"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "2⁸ = 256. Компьютерлік өлшем бірліктерінде жиі қолданылады."
      },
      {
        q: "16 санының екілік жүйедегі жазылуы қандай?",
        options: ["1000", "10000", "1010", "1100", "11000"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "16 = 2⁴, сондықтан екілік жүйеде 1 және төрт нөл: 10000₂."
      },
      {
        q: "1 Гигабайт (ГБ) неше Мегабайтқа (МБ) тең?",
        options: ["100 МБ", "512 МБ", "1000 МБ", "1024 МБ", "2048 МБ"],
        correct: 3,
        topic: "Ақпараттың өлшемі",
        explanation: "1 ГБ = 1024 МБ (2¹⁰ МБ)."
      },
      {
        q: "Python тілінде 5 ** 2 өрнегінің нәтижесі қандай?",
        options: ["10", "52", "25", "7", "3"],
        correct: 2,
        topic: "Python бағдарламалау",
        explanation: "** операторы Python-да дәрежеге шығаруды білдіреді: 5² = 25."
      },
      {
        q: "Логикалық OR (дизъюнкция) операциясында: 1 OR 0 = ?",
        options: ["0", "1", "10", "01", "Анықталмаған"],
        correct: 1,
        topic: "Логика алгебрасы",
        explanation: "OR амалында тым құрығанда бір аргумент 1 болса, нәтиже 1 болады."
      },
      {
        q: "IPv4 стандарты бойынша IP-мекенжай ұзындығы неше биттен тұрады?",
        options: ["8 бит", "16 бит", "32 бит", "64 бит", "128 бит"],
        correct: 2,
        topic: "Компьютерлік желілер",
        explanation: "IPv4 мекенжайы 4 байттан, яғни 32 биттен тұрады."
      },
      {
        q: "16-лық санау жүйесіндегі A₁₆ саны 10-дық жүйеде неге тең?",
        options: ["8", "10", "16", "11", "12"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "16-лық жүйеде: A=10, B=11, C=12, D=13, E=14, F=15."
      },
      {
        q: "Дерекқорда (SQL) кестеден деректерді таңдап оқу үшін қай команда қолданылады?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE", "CREATE"],
        correct: 2,
        topic: "Дерекқорлар",
        explanation: "SELECT командасы кестеден мәліметтерді таңдап сұрауға арналған."
      },
      {
        q: "Алгоритмнің құрылымына байланысты неше негізгі түрі бар?",
        options: ["1", "2", "3 (сызықтық, тармақталған, циклдік)", "4", "5"],
        correct: 2,
        topic: "Алгоритмдер",
        explanation: "Алгоритмнің негізгі 3 базалық құрылымы: сызықтық, тармақталған және циклдік."
      },
      {
        q: "Python тілінде тізімнің (list) ең соңғы элементіне қай индекспен жүгінеді?",
        options: ["list[0]", "list[last]", "list[-1]", "list[end]", "list.last()"],
        correct: 2,
        topic: "Python бағдарламалау",
        explanation: "Python-да теріс индекстеу бар: [-1] соңғы элементті білдіреді."
      }
    ],

    // Алгоритмдер (6 сұрақ)
    "test-kinematics": [
      {
        q: "Алгоритмнің әрбір қадамы орындаушыға түсінікті әрі нақты бір мәнді болуы қандай қасиет?",
        options: ["Анықтылық (детерминирленгендік)", "Дискреттілік", "Жалпылық", "Нәтижелілік"],
        correct: 0,
        topic: "Алгоритмдер",
        explanation: "Анықтылық қасиеті алгоритм командаларының екіұдай мағынасыз, нақты орындалуын талап етеді."
      },
      {
        q: "Тармақталған алгоритмде белгілі бір шартқа байланысты әрекетті таңдау үшін не қолданылады?",
        options: ["Цикл", "Шарт операторы (if / else)", "Тек енгізу командасы", "Массив"],
        correct: 1,
        topic: "Алгоритмдер",
        explanation: "Тармақталу логикалық шартты тексеру арқылы (if/else) жүзеге асады."
      },
      {
        q: "Блок-схемадағы ромб фигурасы қандай әрекетті білдіреді?",
        options: ["Бастау немесе соңы", "Шартты тексеру / таңдау", "Мәліметтерді енгізу/шығару", "Арифметикалық әрекет"],
        correct: 1,
        topic: "Алгоритмдер",
        explanation: "Ромб — шартты тексеру және тармақталу блогы."
      },
      {
        q: "Алгоритмнің шектеулі қадамдар санынан кейін міндетті түрде нәтижемен аяқталуы қандай қасиет?",
        options: ["Шексіздік", "Нәтижелілік (соңғылық)", "Дискреттілік", "Түсініктілік"],
        correct: 1,
        topic: "Алгоритмдер",
        explanation: "Нәтижелілік қасиеті алгоритмнің шектеулі қадамнан кейін нәтиже беруін білдіреді."
      },
      {
        q: "Блок-схемада мәліметтерді енгізу және нәтижені шығару қай фигурамен белгіленеді?",
        options: ["Тіктөртбұрыш", "Параллелограмм", "Эллипс", "Ромб"],
        correct: 1,
        topic: "Алгоритмдер",
        explanation: "Параллелограмм — енгізу/шығару (input/output) блогы."
      },
      {
        q: "Белгілі бір шарт орындалғанша белгілі бір әрекеттер тобы бірнеше рет қайталанатын алгоритм түрі:",
        options: ["Сызықтық", "Циклдік", "Тармақталған", "Модульдік"],
        correct: 1,
        topic: "Алгоритмдер",
        explanation: "Қайталанатын әрекеттер тізбегі циклдік алгоритм деп аталады."
      }
    ],

    // Логика алгебрасы (6 сұрақ)
    "test-dynamics": [
      {
        q: "Логикалық конъюнкция (AND) амалы: 1 AND 0 өрнегінің нәтижесі қандай?",
        options: ["0", "1", "2", "Анықталмаған"],
        correct: 0,
        topic: "Логика алгебрасы",
        explanation: "Конъюнкция (ЖӘНЕ) екі пікір де ақиқат (1) болғанда ғана 1 береді."
      },
      {
        q: "Логикалық терістеу (NOT) амалы: NOT 1 өрнегі неге тең?",
        options: ["0", "1", "-1", "True"],
        correct: 0,
        topic: "Логика алгебрасы",
        explanation: "Терістеу (ЕМЕС) мәнді қарама-қарсысына ауыстырады: NOT 1 = 0."
      },
      {
        q: "Логикалық дизъюнкция (OR) амалы: 1 OR 0 өрнегінің нәтижесі:",
        options: ["0", "1", "10", "Қате"],
        correct: 1,
        topic: "Логика алгебрасы",
        explanation: "Дизъюнкцияда кем дегенде бір 1 болса, нәтиже 1 болады."
      },
      {
        q: "Логикалық өрнектерде орындалу басымдығы (приоритеті) ең жоғары амал:",
        options: ["OR (дизъюнкция)", "AND (конъюнкция)", "NOT (терістеу)", "Импликация"],
        correct: 2,
        topic: "Логика алгебрасы",
        explanation: "Жақша болмаған жағдайда алдымен NOT, содан кейін AND, ең соңында OR орындалады."
      },
      {
        q: "Де Морган заңына сәйкес NOT (A AND B) өрнегінің баламасы қандай?",
        options: ["(NOT A) OR (NOT B)", "(NOT A) AND (NOT B)", "A OR B", "NOT A AND B"],
        correct: 0,
        topic: "Логика алгебрасы",
        explanation: "Де Морган заңы: NOT (A AND B) = (NOT A) OR (NOT B)."
      },
      {
        q: "Ақиқат кестесінде 3 логикалық айнымалы үшін барлығы неше комбинация (жол) болады?",
        options: ["3", "6", "8 (2³)", "9"],
        correct: 2,
        topic: "Логика алгебрасы",
        explanation: "n айнымалы үшін мүмкін комбинациялар саны 2ⁿ тең: 2³ = 8."
      }
    ],

    // Сандар жүйесі (6 сұрақ)
    "test-energy": [
      {
        q: "Ондық жүйедегі 13 санының екілік жүйедегі жазылуы қандай?",
        options: ["1011₂", "1101₂", "1110₂", "1001₂"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "13 = 8 + 4 + 1 = 1101₂."
      },
      {
        q: "Екілік 1010₂ санының ондық жүйедегі мәні қаншаға тең?",
        options: ["8", "10", "12", "14"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "1010₂ = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 2 = 10."
      },
      {
        q: "Сегіздік (8-дік) санау жүйесінде қандай цифрлар қолданылады?",
        options: ["0-ден 8-ге дейін", "0-ден 7-ге дейін", "1-ден 8-ге дейін", "Тек 0 және 1"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "Сегіздік жүйеде 8 түрлі цифр бар: 0, 1, 2, 3, 4, 5, 6, 7."
      },
      {
        q: "Оналтылық (16-лық) санау жүйесінде 15 санын қай әріп білдіреді?",
        options: ["E", "F", "A", "D"],
        correct: 1,
        topic: "Сандар жүйесі",
        explanation: "16-лық жүйеде: 10=A, 11=B, 12=C, 13=D, 14=E, 15=F."
      },
      {
        q: "1 Байт ақпарат неше битке тең?",
        options: ["4 бит", "8 бит", "16 бит", "1024 бит"],
        correct: 1,
        topic: "Ақпараттың өлшемі",
        explanation: "1 Байт = 8 бит. Бұл компьютерлік ақпараттың стандартты өлшемі."
      },
      {
        q: "1 Килобайт (КБ) неше байттан тұрады?",
        options: ["1000 байт", "1024 байт", "512 байт", "2048 байт"],
        correct: 1,
        topic: "Ақпараттың өлшемі",
        explanation: "1 КБ = 1024 байт (2¹⁰ байт)."
      }
    ],

    // Python бағдарламалау (6 сұрақ)
    "test-electro": [
      {
        q: "Python тілінде бүтін сандық мәндерді сипаттайтын деректер типі:",
        options: ["str", "int", "float", "bool"],
        correct: 1,
        topic: "Python бағдарламалау",
        explanation: "int (integer) — бүтін сандар типі (мысалы, 5, -12, 100)."
      },
      {
        q: "range(3) функциясы ретімен қандай мәндер тізбегін береді?",
        options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"],
        correct: 1,
        topic: "Python бағдарламалау",
        explanation: "range(n) 0-ден бастап n-1 ге дейінгі сандарды қайтарады: 0, 1, 2."
      },
      {
        q: "Python тілінде шартты тексеру үшін қолданылатын операторлар:",
        options: ["for / while", "if / elif / else", "def / return", "import / from"],
        correct: 1,
        topic: "Python бағдарламалау",
        explanation: "Шартты құрылымдар if, elif және else кілтсөздерімен жазылады."
      },
      {
        q: "Экранға мәлімет шығару үшін қай стандартты функция қолданылады?",
        options: ["input()", "print()", "write()", "output()"],
        correct: 1,
        topic: "Python бағдарламалау",
        explanation: "print() функциясы нәтижені консольге шығарады."
      },
      {
        q: "len('InfoX') функциясы қайтаратын нәтиже қандай?",
        options: ["4", "5", "6", "InfoX"],
        correct: 1,
        topic: "Python бағдарламалау",
        explanation: "'InfoX' жолы 5 таңбадан тұрады, сондықтан len('InfoX') == 5."
      },
      {
        q: "Python-да тізімнің соңына жаңа элемент қосу үшін қай әдіс қолданылады?",
        options: ["add()", "push()", "append()", "insert()"],
        correct: 2,
        topic: "Python бағдарламалау",
        explanation: "list.append(x) әдісі жаңа элементті тізімнің соңына қосады."
      }
    ],

    // Компьютерлік желілер (6 сұрақ)
    "test-optics": [
      {
        q: "Ғаламтордың (Internet) жұмысын қамтамасыз ететін негізгі желілік хаттамалар стегі:",
        options: ["OSI", "TCP/IP", "HTTP", "FTP"],
        correct: 1,
        topic: "Компьютерлік желілер",
        explanation: "TCP/IP — қазіргі интернеттің іргетасы болып табылатын негізгі протоколдар жиынтығы."
      },
      {
        q: "Желідегі әрбір құрылғыны бірегей түрде анықтайтын логикалық мекенжай қалай аталады?",
        options: ["URL", "IP-мекенжай", "DNS", "MAC-код"],
        correct: 1,
        topic: "Компьютерлік желілер",
        explanation: "IP-мекенжай (IP address) желідегі құрылғылардың логикалық адресі."
      },
      {
        q: "Веб-парақшаларды шифрланған қауіпсіз байланыс арқылы тасымалдайтын протокол:",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        correct: 1,
        topic: "Компьютерлік желілер",
        explanation: "HTTPS (HyperText Transfer Protocol Secure) деректерді SSL/TLS арқылы қорғайды."
      },
      {
        q: "Шектеулі аймақтағы (мысалы, мектеп немесе үй) құрылғыларды біріктіретін жергілікті желі қалай аталады?",
        options: ["WAN", "MAN", "LAN", "PAN"],
        correct: 2,
        topic: "Компьютерлік желілер",
        explanation: "LAN (Local Area Network) — жергілікті компьютерлік желі."
      },
      {
        q: "Домендік атауларды (мысалы, yandex.kz) тиісті IP-мекенжайға түрлендіретін желілік қызмет:",
        options: ["DHCP", "DNS", "NAT", "FTP"],
        correct: 1,
        topic: "Компьютерлік желілер",
        explanation: "DNS (Domain Name System) атауларды сандық IP-ге аударады."
      },
      {
        q: "Желілік картаға зауытта берілетін өзгермейтін физикалық мекенжай қалай аталады?",
        options: ["IP-мекенжай", "MAC-мекенжай", "Порт нөмірі", "Шлюз"],
        correct: 1,
        topic: "Компьютерлік желілер",
        explanation: "MAC (Media Access Control) — құрылғының аппараттық тұрақты мекенжайы."
      }
    ],

    // Дерекқорлар және SQL (6 сұрақ)
    "test-databases": [
      {
        q: "Реляциялық дерекқорларда ақпаратты сақтаудың негізгі құрылымы не?",
        options: ["Файл", "Кесте (Table)", "Тізім (List)", "Граф"],
        correct: 1,
        topic: "Дерекқорлар",
        explanation: "Реляциялық ДҚ мәліметтерді өзара байланысқан кестелерде (жолдар мен бағандар) сақтайды."
      },
      {
        q: "SQL тілінде кестеге жаңа жазба (жол) қосу үшін қай команда қолданылады?",
        options: ["ADD RECORD", "INSERT INTO", "UPDATE", "CREATE ROW"],
        correct: 1,
        topic: "Дерекқорлар",
        explanation: "INSERT INTO table_name VALUES (...) жаңа жазба енгізеді."
      },
      {
        q: "Кестедегі әрбір жазбаны бірегей түрде анықтайтын баған немесе өріс қалай аталады?",
        options: ["Foreign Key", "Primary Key (Бастапқы кілт)", "Index", "Default"],
        correct: 1,
        topic: "Дерекқорлар",
        explanation: "Primary Key (негізгі кілт) қайталанбайтын бірегей мәнді сақтайды."
      },
      {
        q: "Кестедегі бұрыннан бар мәліметті өзгерту үшін қолданылатын SQL командасы:",
        options: ["MODIFY", "CHANGE", "UPDATE", "REPLACE"],
        correct: 2,
        topic: "Дерекқорлар",
        explanation: "UPDATE кестедегі бар деректерді жаңартуға арналған."
      },
      {
        q: "Екі кестенің арасында байланыс орнату үшін қолданылатын кілт қалай аталады?",
        options: ["Primary Key", "Foreign Key (Сыртқы кілт)", "Candidate Key", "Super Key"],
        correct: 1,
        topic: "Дерекқорлар",
        explanation: "Foreign Key басқа кестенің Primary Key өрісіне сілтеме жасап, байланыстырады."
      },
      {
        q: "SQL сұранысында деректерді белгілі бір шарт бойынша сүзгіден өткізу қай кілтсөзбен жасалады?",
        options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
        correct: 2,
        topic: "Дерекқорлар",
        explanation: "WHERE сөзі сұраныс нәтижесіне шарт қою үшін қолданылады (мысалы, WHERE age > 18)."
      }
    ]
  };

  // ═════════════════════════════════════════════════════════════════
  // 3. MINI QUIZZES FOR ALL COURSE TOPICS (Used in course modals)
  // ═════════════════════════════════════════════════════════════════
  const MINI_QUIZZES = {
    kinematics: [
      {
        q: "Алгоритм дегеніміз не?",
        options: ["Нәтижеге бағытталған нақты қадамдар тізбегі", "Тек компьютерге жазылған код", "Мәтіндік файл"],
        correct: 0,
        topic: "Алгоритмдер"
      },
      {
        q: "Циклдік алгоритмнің негізгі мақсаты не?",
        options: ["Бағдарламаны тоқтату", "Бірнеше әрекетті шарт бойынша қайталау", "Файлды өшіру"],
        correct: 1,
        topic: "Алгоритмдер"
      },
      {
        q: "Блок-схемада алгоритмнің басы мен соңы қандай фигурамен бейнеленеді?",
        options: ["Эллипс (сопақша)", "Ромб", "Тіктөртбұрыш"],
        correct: 0,
        topic: "Алгоритмдер"
      }
    ],
    electricity: [
      {
        q: "Python-да экранға мәлімет шығару үшін қай функция қолданылады?",
        options: ["print()", "input()", "show()"],
        correct: 0,
        topic: "Python бағдарламалау"
      },
      {
        q: "Python тілінде True немесе False мәндерін қабылдайтын деректер типі:",
        options: ["int", "bool", "str"],
        correct: 1,
        topic: "Python бағдарламалау"
      },
      {
        q: "range(5) қандай сандар тізбегін береді?",
        options: ["0-ден 4-ке дейін", "1-ден 5-ке дейін", "0-ден 5-ке дейін"],
        correct: 0,
        topic: "Python бағдарламалау"
      }
    ],
    optics: [
      {
        q: "Логикалық NOT амалы 0 мәнін қандай мәнге айналдырады?",
        options: ["1", "0", "-1"],
        correct: 0,
        topic: "Логика алгебрасы"
      },
      {
        q: "1 AND 1 өрнегінің нәтижесі қандай?",
        options: ["0", "1", "2"],
        correct: 1,
        topic: "Логика алгебрасы"
      },
      {
        q: "Логикалық амалдардың орындалу кезегінде ең бірінші қайсысы орындалады?",
        options: ["OR", "AND", "NOT"],
        correct: 2,
        topic: "Логика алгебрасы"
      }
    ],
    thermodynamics: [
      {
        q: "Ондық 10 санының екілік жүйедегі мәні қандай?",
        options: ["1010₂", "1001₂", "1100₂"],
        correct: 0,
        topic: "Сандар жүйесі"
      },
      {
        q: "1 Байт неше битке тең?",
        options: ["4 бит", "8 бит", "16 бит"],
        correct: 1,
        topic: "Ақпараттың өлшемі"
      },
      {
        q: "16-лық санау жүйесінде 10 саны қалай белгіленеді?",
        options: ["A", "B", "F"],
        correct: 0,
        topic: "Сандар жүйесі"
      }
    ],
    mechanics: [
      {
        q: "IPv4 мекенжайы қанша биттен тұрады?",
        options: ["16 бит", "32 бит", "64 бит"],
        correct: 1,
        topic: "Компьютерлік желілер"
      },
      {
        q: "Веб-беттерді қауіпсіз тасымалдайтын протокол қалай аталады?",
        options: ["HTTP", "HTTPS", "FTP"],
        correct: 1,
        topic: "Компьютерлік желілер"
      },
      {
        q: "Жергілікті желінің халықаралық қысқартылған атауы:",
        options: ["LAN", "WAN", "MAN"],
        correct: 0,
        topic: "Компьютерлік желілер"
      }
    ],
    quantum: [
      {
        q: "Реляциялық дерекқорларда деректер не түрінде сақталады?",
        options: ["Кестелерде", "Тек мәтіндік файлдарда", "Массивте"],
        correct: 0,
        topic: "Дерекқорлар"
      },
      {
        q: "Кестеден ақпарат таңдау үшін қолданылатын SQL командасы:",
        options: ["SELECT", "INSERT", "DELETE"],
        correct: 0,
        topic: "Дерекқорлар"
      },
      {
        q: "Кестедегі жазбаны қайталанбайтын етіп анықтайтын кілт:",
        options: ["Primary Key", "Foreign Key", "Index Key"],
        correct: 0,
        topic: "Дерекқорлар"
      }
    ]
  };

  // ═════════════════════════════════════════════════════════════════
  // 4. QUIZ STORE — UNIFIED STORAGE & STATE MANAGER
  // ═════════════════════════════════════════════════════════════════
  const STORAGE_KEYS = {
    USER: 'physx_user',
    COINS: 'physx_coins',
    STATS: 'physx_stats',
    ATTEMPTS: 'physx_quiz_attempts',
    NOTIFS: 'physx_notifs',
    PURCHASES: 'physx_purchases',
    COURSE_PROGRESS: 'physx_course_progress',
    ACTIVE_TAB: 'physx_active_tab',
    LAST_LOGIN: 'physx_last_login_date',
    PERSONAL_PLANS: 'physx_personal_plans'
  };

  const QuizStore = {
    // ── User Profile ──────────────────────────────
    getUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error("Error reading user profile:", e);
      }
      return {
        name: "Азамат",
        role: "student",
        grade: "11",
        email: "student@infox.kz",
        goal: "ҰБТ 120+ балл"
      };
    },

    saveUser(userData) {
      try {
        const current = this.getUser();
        const merged = { ...current, ...userData };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error("Error saving user:", e);
        return userData;
      }
    },

    // ── Coins / Bits ──────────────────────────────
    getCoins() {
      try {
        const val = localStorage.getItem(STORAGE_KEYS.COINS);
        return val !== null ? parseInt(val, 10) : 50;
      } catch (e) {
        return 50;
      }
    },

    setCoins(val) {
      try {
        localStorage.setItem(STORAGE_KEYS.COINS, String(val));
      } catch (e) { }
    },

    addCoins(amount, reason = "") {
      const current = this.getCoins();
      const updated = Math.max(0, current + amount);
      this.setCoins(updated);

      if (reason) {
        this.addNotification("coin", `+${amount} ◆`, reason);
      }
      return updated;
    },

    // ── Notifications ─────────────────────────────
    getNotifications() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFS) || "[]");
      } catch (e) {
        return [];
      }
    },

    addNotification(type, title, text) {
      try {
        const notifs = this.getNotifications();
        notifs.unshift({
          id: Date.now(),
          type,
          title,
          text,
          time: "Жаңа ғана"
        });
        if (notifs.length > 20) notifs.pop();
        localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
      } catch (e) { }
    },

    // ── Attempts History ──────────────────────────
    getAttempts() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            // Sort by timestamp descending
            return list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }
        }
      } catch (e) {
        console.error("Error reading quiz attempts:", e);
      }
      return [];
    },

    getRecentAttempts(limit = 5) {
      return this.getAttempts().slice(0, limit);
    },

    // ── Streak Calculation ────────────────────────
    calculateStreak() {
      try {
        const attempts = this.getAttempts();
        const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
        const todayStr = new Date().toISOString().slice(0, 10);

        // Collect all unique activity dates in YYYY-MM-DD
        const activityDates = new Set();
        if (lastLogin) {
          try {
            const d = new Date(lastLogin);
            if (!isNaN(d.getTime())) activityDates.add(d.toISOString().slice(0, 10));
          } catch (_) { }
        }

        attempts.forEach(att => {
          if (att.dateISO) {
            activityDates.add(att.dateISO.slice(0, 10));
          } else if (att.timestamp) {
            activityDates.add(new Date(att.timestamp).toISOString().slice(0, 10));
          }
        });

        if (activityDates.size === 0) return 0;

        // Check consecutive days starting today or yesterday
        let streak = 0;
        let checkDate = new Date();
        let checkStr = checkDate.toISOString().slice(0, 10);

        // If no activity today, check if active yesterday
        if (!activityDates.has(checkStr)) {
          checkDate.setDate(checkDate.getDate() - 1);
          checkStr = checkDate.toISOString().slice(0, 10);
          if (!activityDates.has(checkStr)) {
            return 0; // Streak broken
          }
        }

        while (activityDates.has(checkStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
          checkStr = checkDate.toISOString().slice(0, 10);
        }

        return streak;
      } catch (e) {
        return 1;
      }
    },

    // ── Comprehensive Dynamic Statistics ──────────
    getStats() {
      const attempts = this.getAttempts();
      const user = this.getUser();
      const coins = this.getCoins();

      // Aggregate counts from real attempts
      let totalQuestions = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      let totalXp = 0;
      const topicStats = {};

      // Initialize all topics
      const topicsList = [
        "Алгоритмдер",
        "Python бағдарламалау",
        "Логика алгебрасы",
        "Сандар жүйесі",
        "Компьютерлік желілер",
        "Дерекқорлар"
      ];
      topicsList.forEach(t => {
        topicStats[t] = { total: 0, correct: 0, wrong: 0, mastery: 0 };
      });

      attempts.forEach(att => {
        const qCount = att.totalQuestions || 0;
        const cCount = att.correctCount || 0;
        const wCount = att.wrongCount !== undefined ? att.wrongCount : Math.max(0, qCount - cCount);

        totalQuestions += qCount;
        correctAnswers += cCount;
        wrongAnswers += wCount;
        totalXp += (att.score || 0);

        // Topic aggregation
        if (att.topicStats && typeof att.topicStats === 'object') {
          Object.keys(att.topicStats).forEach(top => {
            if (!topicStats[top]) topicStats[top] = { total: 0, correct: 0, wrong: 0, mastery: 0 };
            const item = att.topicStats[top];
            topicStats[top].total += (item.total || 0);
            topicStats[top].wrong += (item.wrong || 0);
            topicStats[top].correct += Math.max(0, (item.total || 0) - (item.wrong || 0));
          });
        } else if (att.topic && topicStats[att.topic]) {
          topicStats[att.topic].total += qCount;
          topicStats[att.topic].correct += cCount;
          topicStats[att.topic].wrong += wCount;
        }
      });

      // Calculate accuracy
      const accuracy = totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

      // Calculate topic masteries
      Object.keys(topicStats).forEach(t => {
        const stat = topicStats[t];
        stat.mastery = stat.total > 0
          ? Math.round((stat.correct / stat.total) * 100)
          : 0;
      });

      // Overall Progress: combination of completed quizzes out of catalog + course progress
      const completedQuizIds = new Set(attempts.map(a => a.quizId));
      const totalCatalogQuizzes = QUIZZES_CATALOG.length;
      const quizProgressFactor = Math.min(100, Math.round((completedQuizIds.size / totalCatalogQuizzes) * 100));

      let courseProgressObj = {};
      try {
        courseProgressObj = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS) || "{}");
      } catch (_) { }

      const courseValues = Object.values(courseProgressObj);
      const avgCourseProgress = courseValues.length > 0
        ? Math.round(courseValues.reduce((a, b) => a + b, 0) / courseValues.length)
        : 0;

      const overallProgress = Math.min(100, Math.round((quizProgressFactor * 0.7) + (avgCourseProgress * 0.3)));

      const streakDays = this.calculateStreak();

      // Estimated hours spent (10 min per completed quiz + study time)
      const hoursSpent = Math.max(0.5, Number(((attempts.length * 12 + 30) / 60).toFixed(1)));

      return {
        quizzesCompleted: attempts.length,
        uniqueQuizzesPassed: completedQuizIds.size,
        totalCatalogQuizzes,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        accuracy,
        xp: totalXp,
        coins,
        streakDays,
        overallProgress,
        hoursSpent,
        topicStats,
        user
      };
    },

    // ── Record Quiz Attempt ───────────────────────
    recordAttempt({
      quizId,
      quizTitle,
      topic = "Жалпы",
      score = 0,
      maxScore = 0,
      correctCount = 0,
      totalQuestions = 0,
      wrongCount = null,
      answers = [],
      topicStats = null
    }) {
      const calculatedWrong = wrongCount !== null
        ? wrongCount
        : Math.max(0, totalQuestions - correctCount);

      const percentage = totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

      const now = new Date();
      const formattedDate = now.toLocaleDateString("kk-KZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) + " " + now.toLocaleTimeString("kk-KZ", {
        hour: "2-digit",
        minute: "2-digit"
      });

      const attempt = {
        id: "att-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
        quizId: quizId || "test-ent",
        quizTitle: quizTitle || "Тест",
        topic: topic || "Информатика",
        score: score || (correctCount * 100),
        maxScore: maxScore || (totalQuestions * 100),
        correctCount,
        wrongCount: calculatedWrong,
        totalQuestions,
        percentage,
        formattedDate,
        dateISO: now.toISOString(),
        timestamp: Date.now(),
        answers: answers || [],
        topicStats: topicStats || null
      };

      try {
        const attempts = this.getAttempts();
        attempts.unshift(attempt);
        // Keep max 50 recent attempts
        if (attempts.length > 50) attempts.pop();
        localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));

        // Mark login/activity date for streak
        localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, now.toISOString());

        // Award reward coins if configured
        const quizObj = this.getQuizById(quizId);
        const rewardCoins = quizObj ? quizObj.reward : Math.min(100, correctCount * 10);
        this.addCoins(rewardCoins, `${quizTitle} нәтижесі`);

        this.addNotification(
          "achievement",
          `Тест аяқталды: ${quizTitle}`,
          `Нәтиже: ${correctCount}/${totalQuestions} (${percentage}%) • +${rewardCoins} бит`
        );
      } catch (e) {
        console.error("Error saving attempt:", e);
      }

      return attempt;
    },

    // ── Catalog Helpers ───────────────────────────
    getAllQuizzes() {
      const attempts = this.getAttempts();
      const stats = this.getStats();

      return QUIZZES_CATALOG.map(q => {
        // Find best attempt for this quiz
        const quizAttempts = attempts.filter(a => a.quizId === q.id);
        const bestAttempt = quizAttempts.sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0] || null;

        return {
          ...q,
          isCompleted: quizAttempts.length > 0,
          attemptsCount: quizAttempts.length,
          bestScore: bestAttempt ? bestAttempt.score : 0,
          bestPercentage: bestAttempt ? bestAttempt.percentage : 0,
          questions: QUIZ_QUESTIONS[q.id] || []
        };
      });
    },

    getQuizById(id) {
      if (!id) return null;
      return QUIZZES_CATALOG.find(q => q.id === id) || null;
    },

    getQuestionsForQuiz(quizId) {
      if (!quizId) return QUIZ_QUESTIONS["test-ent"] || [];
      return QUIZ_QUESTIONS[quizId] || QUIZ_QUESTIONS["test-ent"] || [];
    },

    getMiniQuizForTopic(topicId) {
      return MINI_QUIZZES[topicId] || null;
    }
  };

  // Expose to window
  global.QUIZZES_CATALOG = QUIZZES_CATALOG;
  global.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  global.MINI_QUIZZES = MINI_QUIZZES;
  global.QuizStore = QuizStore;

})(typeof window !== 'undefined' ? window : this);
