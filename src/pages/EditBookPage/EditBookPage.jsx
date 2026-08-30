import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './EditBookPage.css';

export function EditBookPage({ books = [], onUpdateBook }) {
  // 1. Получаем ID книги из URL-адреса страницы 
  const { id } = useParams();

  // 2. Функция для перехода на другие страницы 
  const navigate = useNavigate();

  // 3. Ищем нужную книгу в массиве книг по её ID.
  // Приводим оба ID к строке, чтобы сравнить "5" и 5 без ошибок типа данных.
  const currentBook = books.find((b) => String(b.id) === String(id));

  // 4. Переменные состояния (стейты) для каждого поля формы
  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [pages, setPages] = useState('');
  const [description, setDescription] = useState('');

  // 5. Когда страница загрузилась (или изменилась текущая книга),
  // заполняем поля формы текущими данными этой книги
  useEffect(() => {
    if (currentBook) {
      setCover(currentBook.cover || currentBook.image || '');
      setTitle(currentBook.title || '');
      setAuthor(currentBook.author || '');
      setYear(currentBook.year || '');
      setGenre(currentBook.genre || '');
      setLanguage(currentBook.language || '');
      setPages(currentBook.pages || '');
      setDescription(currentBook.description || '');
    }
  }, [currentBook]);

  // 6. Если книга с таким ID не найдена, показываем сообщение об ошибке
  if (!currentBook) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Книга не найдена</h2>
        <button onClick={() => navigate('/')}>Вернуться в каталог</button>
      </div>
    );
  }

  // 7. Функция отправки формы редактирования
  const handleSubmit = (e) => {
    // Отменяем стандартное поведение браузера (чтобы страница не перезагружалась)
    e.preventDefault();

    // Собираем объект с обновленными данными из стейтов
    const updatedData = {
      cover,
      title,
      author,
      year,
      genre,
      language,
      pages,
      description,
    };

    // Вызываем функцию родительского компонента для обновления книги в общем списке
    onUpdateBook(currentBook.id, updatedData);

    // Переходим обратно на страницу просмотра этой книги
    navigate(`/book/${currentBook.id}`);
  };

  return (
    <div className="editbook-pageContainer">
      {/* Кнопка возврата на предыдущую страницу */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="editbook-card">
        <h2>Редактировать книгу</h2>

        <form className="editbook-form" onSubmit={handleSubmit}>

          {/* 1. Название книги */}
          <div className="formGroup">
            <label>Название книги *</label>
            <input
              type="text"
              className="inputField"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
            />
          </div>

          {/* 2. Автор */}
          <div className="formGroup">
            <label>Автор *</label>
            <input
              type="text"
              className="inputField"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Имя автора"
            />
          </div>

          {/* 3. Ссылка на обложку */}
          <div className="formGroup">
            <label>Ссылка на обложку (URL)</label>
            <input
              type="url"
              className="inputField"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {/* 4. Год издания и 5. Жанр  */}
          <div className="formRow">
            <div className="formGroup">
              <label>Год издания</label>
              <input
                type="number"
                className="inputField"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="1933"
              />
            </div>

            <div className="formGroup">
              <label>Жанр</label>
              <input
                type="text"
                className="inputField"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Например, Роман"
              />
            </div>
          </div>

          {/* 6. Язык и 7. Страницы  */}
          <div className="formRow">
            <div className="formGroup">
              <label>Язык</label>
              <input
                type="text"
                className="inputField"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Русский"
              />
            </div>

            <div className="formGroup">
              <label>Количество страниц</label>
              <input
                type="number"
                className="inputField"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="350"
              />
            </div>
          </div>

          {/* 8. Описание */}
          <div className="formGroup">
            <label>Описание</label>
            <textarea
              rows="4"
              className="inputField"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание книги..."
            />
          </div>

          {/* Кнопка отправки формы */}
          <button type="submit" className="submitBtn">
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
}