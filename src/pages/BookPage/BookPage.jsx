import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { books } from '../../data/mockData';
import './BookPage.css';

export function BookPage({ onUpdateBook }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === Number(id));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personName, setPersonName] = useState(book?.takenTo || '');
  const [returnDate, setReturnDate] = useState(book?.returnDate || '');

  if (!book) {
    return (
      <div className="book-page-wrapper">
        <h2>Книга не найдена!</h2>
        <button onClick={() => navigate(-1)} className="back-link-btn">
          <ArrowLeft size={16} /> Назад
        </button>
      </div>
    );
  }

  // Настройка статуса
  let statusText = 'У меня';
  let statusClass = 'status-badge in-stock';

  if (book.is_taken) {
    statusText = 'Отдана';
    statusClass = 'status-badge given';
  } else if (book.is_borrowed) {
    statusText = 'Взята';
    statusClass = 'status-badge borrowed';
  }

  // Расчет срока
  let deadlineText = null;
  let isExpired = false;

  if ((book.is_taken || book.is_borrowed) && book.returnDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(book.returnDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      deadlineText = `Просрочено на ${Math.abs(diffDays)} дн.`;
      isExpired = true;
    } else if (diffDays === 0) {
      deadlineText = 'Вернуть сегодня';
    } else {
      deadlineText = `Осталось ${diffDays} дн.`;
    }
  }

  const handlePrimaryClick = () => {
    if (book.is_taken) {
      if (onUpdateBook) {
        onUpdateBook(book.id, {
          is_taken: false,
          takenTo: null,
          returnDate: null
        });
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    if (onUpdateBook) {
      onUpdateBook(book.id, {
        is_taken: true,
        takenTo: personName || 'Знакомый',
        returnDate: returnDate || null
      });
    }
    setIsModalOpen(false);
  };

  const bookCover = book.image || book.cover;

  return (
    <div className="book-page-wrapper">
      <button onClick={() => navigate(-1)} className="back-link-btn">
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="book-card-container">
        {/* Верхняя часть карточки */}
        <div className="book-main-section">
          <div className="book-cover-box">
            <img src={bookCover} alt={book.title} className="book-cover-img" />
          </div>

          <div className="book-details-box">
            <div className="book-title-header">
              <h1 className="book-title">{book.title}</h1>
              <span className={statusClass}>{statusText}</span>
            </div>

            <p className="book-author">{book.author}</p>

            <div className="book-specs-grid">
              {book.is_taken && (
                <div className="spec-row">
                  <span className="spec-name">Кому отдана</span>
                  <span className="spec-val highlight-person">
                    {book.takenTo || '—'}
                    {deadlineText && (
                      <span className={`deadline-inline ${isExpired ? 'expired' : ''}`}>
                        <AlertCircle size={14} />
                        {deadlineText}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {book.is_borrowed && (
                <div className="spec-row">
                  <span className="spec-name">У кого взята</span>
                  <span className="spec-val highlight-person">
                    {book.takenTo || '—'}
                    {deadlineText && (
                      <span className={`deadline-inline ${isExpired ? 'expired' : ''}`}>
                        <AlertCircle size={14} />
                        {deadlineText}
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="spec-row">
                <span className="spec-name">Год издания</span>
                <span className="spec-val">{book.release_year || book.year || '2020'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Жанр</span>
                <span className="spec-val">{book.genre || 'Философская сказка'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Язык</span>
                <span className="spec-val">{book.language || 'Русский'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Страниц</span>
                <span className="spec-val">{book.pages || '120'}</span>
              </div>
            </div>

            <div className="book-buttons-group">
              <button className="purple-btn" onClick={handlePrimaryClick}>
                {book.is_taken ? 'Вернуть книгу' : 'Отдать книгу'}
              </button>
              <button className="white-btn">Редактировать</button>
            </div>
          </div>
        </div>

        {/* Нижняя часть: Описание */}
        <div className="book-description-block">
          <h2>Описание</h2>
          <p>
            {book.description ||
              'Трогательное, доброе и философское произведение с авторскими рисунками. Знаменитая сказка появляется в жизни, наверное, каждого ребёнка и проходит с ним сквозь все самые значимые этапы.'}
          </p>
        </div>
      </div>

      {/* Модалка */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Отдать книгу</h3>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} className="modal-body-form">
              <div className="input-field-group">
                <label>Кому отдаете?</label>
                <input
                  type="text"
                  placeholder="Например: Денис"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  required
                />
              </div>

              <div className="input-field-group">
                <label>Дата возврата (опционально)</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>

              <div className="modal-foot">
                <button type="button" className="white-btn" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit" className="purple-btn">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}