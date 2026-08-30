import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Edit3, Clock, AlertTriangle } from 'lucide-react';
import './BookPage.css';

export function BookPage({ books = [], onUpdateBook, onDeleteBook }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const foundBook = books.find((b) => String(b.id) === String(id));

  const initialBook = foundBook || {
    id: id,
    title: 'Название не указано',
    author: 'Автор не указан',
    year: '—',
    genre: '—',
    language: '—',
    pages: '—',
    is_taken: false,
    is_borrowed: false,
    borrowedFrom: null,
    borrowedTo: null,
    returnDate: null,
  };

  const [currentBook, setCurrentBook] = useState(initialBook);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    if (foundBook) {
      setCurrentBook(foundBook);
    }
  }, [foundBook]);

  // Минимальная дата для календаря (сегодняшнее число YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const bookCover = currentBook.cover || currentBook.image || 'https://via.placeholder.com/260x360?text=Обложка';
  const isGivenAway = Boolean(currentBook.is_taken || currentBook.borrowedTo);

  let statusText = 'У меня';
  let statusBg = '#e6f4ea';
  let statusColor = '#137333';

  if (isGivenAway) {
    statusText = `Отдана (${currentBook.borrowedTo || '-' })`;
    statusBg = '#fce8e6';
    statusColor = '#c5221f';
  } else if (currentBook.is_borrowed) {
    statusText = 'Взята';
    statusBg = '#e0f2fe';
    statusColor = '#0369a1';
  }

  const releaseYear = currentBook.release_year || currentBook.year || currentBook.releaseYear || '—';

  // Определение состояния срока (Просрочено / Скоро / Норма)
  let dateBadgeClass = 'return-date-badge norm';
  let dateBadgeText = '';

  if (currentBook.returnDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(currentBook.returnDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      dateBadgeClass = 'return-date-badge expired';
      dateBadgeText = `Просрочено на ${Math.abs(diffDays)} дн.`;
    } else if (diffDays <= 3) {
      dateBadgeClass = 'return-date-badge warning';
      dateBadgeText = diffDays === 0 ? 'Вернуть сегодня!' : `Осталось ${diffDays} дн.`;
    } else {
      dateBadgeClass = 'return-date-badge norm';
      dateBadgeText = `Вернуть до: ${targetDate.toLocaleDateString('ru-RU')}`;
    }
  }

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

  // Возврат чужой книги хозяину (удаление из локального списка)
  const handleReturnToOwner = () => {
    if (onDeleteBook) {
      onDeleteBook(currentBook.id);
    } else if (onUpdateBook) {
      onUpdateBook(currentBook.id, { ...currentBook, is_borrowed: false });
    }
    navigate('/');
  };

  return (
    <div className="book-details-wrapper">
      <button type="button" className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        <span>Назад</span>
      </button>

      <div className="book-details-card">
        <div className="book-top-content">
          {/* Обложка */}
          <div className="book-cover-container">
            <img src={bookCover} alt={currentBook.title} className="book-card-cover" />
          </div>

          {/* Информация о книге */}
          <div className="book-info-column">
            <div className="book-header-section">
              <div className="book-header-row">
                <div className="book-title-group">
                  <h1 className="book-main-title">{currentBook.title}</h1>
                  <span className="book-status-badge" style={{ backgroundColor: statusBg, color: statusColor }}>
                    {statusText}
                  </span>
                </div>

                {(isGivenAway || currentBook.is_borrowed) && currentBook.returnDate && (
                  <div className={dateBadgeClass}>
                    {dateBadgeClass.includes('expired') || dateBadgeClass.includes('warning') ? (
                      <AlertTriangle size={15} />
                    ) : (
                      <Clock size={15} />
                    )}
                    <span><strong>{dateBadgeText}</strong></span>
                  </div>
                )}
              </div>

              <p className="book-author-name">{currentBook.author || 'Автор не указан'}</p>

              <div className="book-actions-row">
                {currentBook.is_borrowed ? (
                  /* Если книга чужая и взята нами */
                  <button type="button" className="btn-return-book" onClick={handleReturnToOwner}>
                    Вернуть хозяину
                  </button>
                ) : !isGivenAway ? (
                  /* Если книга наша и находится у нас */
                  <>
                    <button
                      type="button"
                      className={showBorrowForm ? 'btn-cancel-action' : 'btn-give-book'}
                      onClick={() => setShowBorrowForm(!showBorrowForm)}
                    >
                      {showBorrowForm ? 'Отмена' : 'Отдать книгу'}
                    </button>

                    <button 
                      type="button" 
                      className="btn-edit-book"
                      onClick={() => navigate(`/edit/${currentBook.id}`)}
                    >
                      <Edit3 size={15} />
                      <span>Редактировать</span>
                    </button>
                  </>
                ) : (
                  /* Если книга наша, но мы её отдали */
                  <button type="button" className="btn-return-book" onClick={handleReturnBook}>
                    Вернуть себе
                  </button>
                )}
              </div>
            </div>

            <div className="book-body-content">
              <div className="book-specs-table">
                {currentBook.is_borrowed && (
                  <div className="spec-row">
                    <span className="spec-label">Взята у</span>
                    <span className="spec-value">{currentBook.borrowedFrom || 'Друга'}</span>
                  </div>
                )}
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

              {showBorrowForm && !isGivenAway && !currentBook.is_borrowed && (
                <div className="borrow-card-panel">
                  <h3>Передача книги</h3>
                  <form onSubmit={handleGiveBook}>
                    <div className="form-field">
                      <label><User size={13} /> Кому отдать?</label>
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
                        min={todayStr}
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
            </div>
          </div>
        </div>

        <hr className="book-card-divider" />

        <div className="book-description-section">
          <h3>Описание</h3>
          <p>{currentBook.description || 'Описание пока не добавлено.'}</p>
        </div>
      </div>
    </div>
  );
}