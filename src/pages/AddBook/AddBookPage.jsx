import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <>
      <style>{`
        .addbook-pageContainer {
          max-width: 560px;
          margin: 3rem auto;
          padding: 2rem 2.5rem 2.5rem;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(106, 13, 173, 0.15);
          border: 1px solid #e9d5ff;
          transition: box-shadow 0.2s ease;
        }
        .addbook-pageContainer:hover {
          box-shadow: 0 12px 40px rgba(106, 13, 173, 0.2);
        }
        .addbook-pageContainer h2 {
          margin: 0 0 1.8rem 0;
          font-size: 28px;
          font-weight: 700;
          color: #4c1d95;
          text-align: center;
          letter-spacing: -0.3px;
          border-bottom: 4px solid #8b5cf6;
          padding-bottom: 0.6rem;
          display: inline-block;
          width: auto;
          margin-left: auto;
          margin-right: auto;
        }
        .addbook-bookForm {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .addbook-formGroup {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .addbook-formGroup label {
          font-weight: 600;
          font-size: 0.95rem;
          color: #3b2b5c;
          letter-spacing: 0.3px;
        }
        .addbook-inputField {
          padding: 0.7rem 1rem;
          border: 2px solid #e5d9f2;
          border-radius: 12px;
          font-size: 1rem;
          background: #faf8ff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          color: #1e1b2e;
          font-family: inherit;
        }
        .addbook-inputField::placeholder {
          color: #a78bbf;
          font-weight: 300;
        }
        .addbook-inputField:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15);
        }
        .addbook-submitBtn {
          margin-top: 0.6rem;
          padding: 0.8rem 1.8rem;
          background: linear-gradient(145deg, #7c3aed, #6d28d9);
          color: #fff;
          border: none;
          border-radius: 40px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
          align-self: center;
          min-width: 200px;
        }
        .addbook-submitBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.45);
          background: linear-gradient(145deg, #8b5cf6, #6d28d9);
        }
        .addbook-submitBtn:active:not(:disabled) {
          transform: scale(0.97);
        }
        .addbook-submitBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>

      <div className="addbook-pageContainer">
        <h2>Добавить книгу</h2>
        <form className="addbook-bookForm" onSubmit={handleSubmit}>
          <div className="addbook-formGroup">
            <label htmlFor="title">Название вашей книги</label>
            <input
              type="text"
              id="title"
              placeholder="Например: Мастер и Маргарита"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="addbook-inputField"
              autoFocus
              required
            />
          </div>
          <div className="addbook-formGroup">
            <label htmlFor="author">Автор</label>
            <input
              type="text"
              id="author"
              placeholder="Например: Михаил Булгаков"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="addbook-inputField"
            />
          </div>
          <div className="addbook-formGroup">
            <label htmlFor="year">Год выпуска</label>
            <input
              type="text"
              id="year"
              placeholder="1933"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="addbook-inputField"
            />
          </div>
          <div className="addbook-formGroup">
            <label htmlFor="cover">Ссылка на обложку (URL)</label>
            <input
              type="url"
              id="cover"
              placeholder="https://example.com/cover.jpg"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="addbook-inputField"
            />
          </div>
          <button
            type="submit"
            className="addbook-submitBtn"
            disabled={!isFormValid}
          >
            Добавить книгу
          </button>
        </form>
      </div>
    </>
  );
}