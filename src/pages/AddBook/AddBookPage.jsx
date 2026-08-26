import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AddBookPage.css';

export function AddBookPage({ onAddBook }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [cover, setCover] = useState('');

  const isFormValid = title.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      year: year.trim(),
      cover: cover.trim(),
    };

    onAddBook(newBook);
    setTitle('');
    setAuthor('');
    setYear('');
    setCover('');
    navigate('/');
  };

  return (
    <div className="addbook-pageContainer">
      <button type="button" className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Назад в библиотеку</span>
      </button>

      <div className="pageContainer">
        <h2>Добавление книги</h2>

        <form className="bookForm" onSubmit={handleSubmit}>
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

          <div className="formGroup">
            <label htmlFor="year">Год выпуска</label>
            <input
              type="text"
              id="year"
              placeholder="1933"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="inputField"
            />
          </div>

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