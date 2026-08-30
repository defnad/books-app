import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AddBookPage.css';

export function AddBookPage({ onAddBook }) {
  const navigate = useNavigate();

  // Состояния для всех полей в том же порядке
  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [pages, setPages] = useState('');
  const [description, setDescription] = useState('');

  // Валидация: обязательно только название книги
  const isFormValid = title.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newBook = {
      cover: cover.trim(),
      title: title.trim(),
      author: author.trim(),
      year: year.trim(),
      genre: genre.trim(),
      language: language.trim(),
      pages: pages.trim(),
      description: description.trim(),
    };

    onAddBook(newBook);

    // Сброс всех состояний
    setCover('');
    setTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setLanguage('');
    setPages('');
    setDescription('');

    navigate('/');
  };

  return (
    <div className="addbook-pageContainer">
      <button type="button" className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Назад</span>
      </button>

      <div className="pageContainer">
        <h2>Добавление книги</h2>

        <form className="bookForm" onSubmit={handleSubmit}>

          {/* 1. Название книги (Обязательное) */}
          <div className="formGroup">
            <label htmlFor="title">Название вашей книги *</label>
            <input
              type="text"
              id="title"
              placeholder="Например: Мастер и Маргарита"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="inputField"
              autoFocus
              required
            />
          </div>

          {/* 2. Автор */}
          <div className="formGroup">
            <label htmlFor="author">Автор</label>
            <input
              type="text"
              id="author"
              placeholder="Например: Михаил Булгаков"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="inputField"
            />
          </div>

          {/* 3. Ссылка на обложку (URL) */}
          <div className="formGroup">
            <label htmlFor="cover">Ссылка на обложку (URL)</label>
            <input
              type="url"
              id="cover"
              placeholder="https://example.com/cover.jpg"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="inputField"
            />
          </div>

          {/* 4. Год издания и 5. Жанр (в один ряд) */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="formGroup" style={{ flex: 1 }}>
              <label htmlFor="year">Год издания</label>
              <input
                type="number"
                id="year"
                placeholder="1933"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="inputField"
              />
            </div>

            <div className="formGroup" style={{ flex: 1 }}>
              <label htmlFor="genre">Жанр</label>
              <input
                type="text"
                id="genre"
                placeholder="Например: Роман"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="inputField"
              />
            </div>
          </div>

          {/* 6. Язык и 7. Количество страниц (в один ряд) */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="formGroup" style={{ flex: 1 }}>
              <label htmlFor="language">Язык</label>
              <input
                type="text"
                id="language"
                placeholder="Русский"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="inputField"
              />
            </div>

            <div className="formGroup" style={{ flex: 1 }}>
              <label htmlFor="pages">Количество страниц</label>
              <input
                type="number"
                id="pages"
                placeholder="350"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="inputField"
              />
            </div>
          </div>

          {/* 8. Описание */}
          <div className="formGroup">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              rows="4"
              placeholder="Краткое описание книги..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="inputField"
            />
          </div>

          <button
            type="submit"
            className="submitBtn"
            disabled={!isFormValid}
          >
            Добавить книгу
          </button>
        </form>
      </div>
    </div>
  );
}