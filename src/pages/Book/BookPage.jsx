import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Edit3 } from 'lucide-react';
import './BookPage.css';

export function BookPage({ books = [], onUpdateBook }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const foundBook = books.find((b) => Number(b.id) === Number(id));

  const initialBook = foundBook || {
    id: id,
    title: 'Название не указано',
    author: 'Автор не указан',
    year: '—',
    genre: '—',
    language: '—',
    pages: '—',
    is_taken: false,
    borrowedTo: null,
  };

  const [currentBook, setCurrentBook] = useState(initialBook);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const bookCover = currentBook.cover || currentBook.image || 'https://via.placeholder.com/260x360?text=Обложка';
  const isGivenAway = Boolean(currentBook.is_taken || currentBook.borrowedTo);

  let statusText = 'У меня';
  let statusBg = '#e6f4ea';
  let statusColor = '#137333';

  if (isGivenAway) {
    statusText = `Отдана (${currentBook.borrowedTo || 'другу'})`;
    statusBg = '#fce8e6';
    statusColor = '#c5221f';
  } else if (currentBook.is_borrowed) {
    statusText = 'Взята';
    statusBg = '#e0f2fe';
    statusColor = '#0369a1';
  }

  const releaseYear = currentBook.release_year || currentBook.year || currentBook.releaseYear || '—';

  const handleGiveBook = (e) => {
    e.preventDefault();
    if (!borrowerName.trim() || !returnDate) return;

    const updatedData = {
      ...currentBook,
      is_taken: true,
      borrowedTo: borrowerName.trim(),
      returnDate: returnDate,
    };

    setCurrentBook(updatedData);

    if (onUpdateBook) {
      onUpdateBook(currentBook.id, updatedData);
    }

    setShowBorrowForm(false);
    setBorrowerName('');
    setReturnDate('');
  };

  const handleReturnBook = () => {
    const updatedData = {
      ...currentBook,
      is_taken: false,
      borrowedTo: null,
      returnDate: null,
    };

    setCurrentBook(updatedData);

    if (onUpdateBook) {
      onUpdateBook(currentBook.id, updatedData);
    }
  };

  return (
    <div className="book-details-wrapper">
      <button type="button" className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Назад в библиотеку</span>
      </button>

      <div className="book-details-card">
        <div className="book-top-content">
          {/* Обложка */}
          <div className="book-cover-container">
            <img src={bookCover} alt={currentBook.title} className="book-card-cover" />
          </div>

          {/* Информация о книге */}
          <div className="book-info-column">
            <div className="book-header-row">
              <h1 className="book-main-title">{currentBook.title}</h1>
              <span className="book-status-badge" style={{ backgroundColor: statusBg, color: statusColor }}>
                {statusText}
              </span>
            </div>

            <p className="book-author-name">{currentBook.author || 'Автор не указан'}</p>

            <div className="book-actions-row">
              {!isGivenAway ? (
                <button
                  type="button"
                  className={showBorrowForm ? 'btn-cancel-action' : 'btn-give-book'}
                  onClick={() => setShowBorrowForm(!showBorrowForm)}
                >
                  {showBorrowForm ? 'Отмена' : 'Отдать книгу'}
                </button>
              ) : (
                <button type="button" className="btn-return-book" onClick={handleReturnBook}>
                  Вернуть себе
                </button>
              )}

              {!isGivenAway && (
                <button type="button" className="btn-edit-book">
                  <Edit3 size={15} />
                  <span>Редактировать</span>
                </button>
              )}
            </div>

            {/* Таблица динамических характеристик */}
            <div className="book-specs-table">
              <div className="spec-row">
                <span className="spec-label">Год издания</span>
                <span className="spec-value">{releaseYear}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Жанр</span>
                <span className="spec-value">{currentBook.genre || '—'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Язык</span>
                <span className="spec-value">{currentBook.language || '—'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Страниц</span>
                <span className="spec-value">{currentBook.pages || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Форма передачи */}
        {showBorrowForm && !isGivenAway && (
          <div className="borrow-card-panel">
            <h3>Передача книги</h3>
            <form onSubmit={handleGiveBook}>
              <div className="form-field">
                <label><User size={13} /> Кому отдаём?</label>
                <input
                  type="text"
                  placeholder="Имя друга"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label><Calendar size={13} /> До какого числа?</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-save-borrow">
                Сохранить
              </button>
            </form>
          </div>
        )}

        <hr className="book-card-divider" />

        <div className="book-description-section">
          <h3>Описание</h3>
          <p>{currentBook.description || 'Описание пока не добавлено.'}</p>
        </div>
      </div>
    </div>
  );
}