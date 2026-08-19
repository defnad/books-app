export const books = [
  {
    id: 1,
    title: "1984",
    author: "Джордж Оруэлл",
    release_year: 1949,
    is_taken: true,
    takenTo: "Денис",
    returnDate: "2026-08-15", // Просрочено на пару дней
    genre: "Антиутопия",
    language: "Русский",
    pages: 320,
    description: "Своевременная и глубокая антиутопия о тоталитарном обществе, контроле над мышлением и ценности человеческой свободы.",
    image: "https://avatars.mds.yandex.net/get-mpic/4322217/2a000001955ef6c67e532078f44710ab9f46/orig"
  },
  {
    id: 2,
    title: "Властелин колец",
    author: "Дж. Р. Р. Толкин",
    release_year: 1954,
    is_taken: false,
    is_borrowed: false,
    genre: "Фэнтези",
    language: "Русский",
    pages: 1184,
    description: "Эпический роман-эпопея о борьбе добра и зла в Средиземье, дружбе, верности и великом путешествии Кольца Всевластья.",
    image: "https://content.img-gorod.ru/pim/products/images/5e/62/018fa15e-5a31-7f77-af39-d56a07e35e62.jpg"
  },
  {
    id: 3,
    title: "Маленький принц",
    author: "Антуан де Сент-Экзюпери",
    release_year: 1943,
    is_taken: true,
    takenTo: "Аня",
    returnDate: "2026-08-25", // Осталось несколько дней
    genre: "Философская сказка",
    language: "Русский",
    pages: 120,
    description: "Трогательное и философское произведение с авторскими рисунками о дружбе, любви, ответственности и верности.",
    image: "https://content.img-gorod.ru/pim/products/images/56/df/018ee907-10d9-7252-b881-7425f1af56df.jpg"
  },
  {
    id: 4,
    title: "451 градус по Фаренгейту",
    author: "Рэй Брэдбери",
    release_year: 1953,
    is_borrowed: true,
    takenTo: "Максим", // У кого взял
    returnDate: "2026-08-19", // Вернуть сегодня
    genre: "Научная фантастика",
    language: "Русский",
    pages: 256,
    description: "Роман про общество, в котором книги находятся под запретом, а «пожарные» сжигают любые найденные печатные издания.",
    image: "https://content.img-gorod.ru/pim/products/images/54/89/018f5ee3-5629-7ce8-b5c1-88044a5c5489.jpg"
  },
  {
    id: 5,
    title: "Гарри Поттер и философский камень",
    author: "Джоан Роулинг",
    release_year: 1997,
    is_taken: false,
    is_borrowed: false,
    genre: "Фэнтези",
    language: "Русский",
    pages: 432,
    description: "История сироты Гарри Поттера, который в день своего одиннадцатилетия узнаёт, что он самый настоящие волшебник.",
    image: "https://content.img-gorod.ru/pim/products/images/5f/5e/018f5ca8-4768-7707-8931-8d10c0665f5e.jpg"
  },
  {
    id: 6,
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    release_year: 1866,
    is_taken: false,
    is_borrowed: false,
    genre: "Классическая проза",
    language: "Русский",
    pages: 608,
    description: "История о бывшем студенте Родионе Раскольникове, совершившем убийство и прошедшем через духовный кризис и раскаяние.",
    image: "https://content.img-gorod.ru/pim/products/images/cc/b2/018f5cde-05ff-7ae4-a522-01318deeccb2.jpg"
  }
];