import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookPickerModal } from './BookPickerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export function CatalogPage({ books = [], onDeleteBook, onUpdateBook, searchQuery = '' }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('my');

  // Состояния для модалок
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const query = searchQuery.toLowerCase().trim();

  // Фильтрация
  const filteredBooks = books.filter((book) => {
    if (activeTab === 'given' && !book.is_taken) return false;
    if (activeTab === 'taken' && !book.is_borrowed) return false;
    if (query === '') return true;

    const title = book.title ? book.title.toLowerCase() : '';
    const author = book.author ? book.author.toLowerCase() : '';
    return title.includes(query) || author.includes(query);
  });

  const myBooksForPicker = books.filter((b) => !b.is_taken && !b.is_borrowed);

  // Обработчики
  const openPicker = (mode) => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  const handleSelectBook = (bookId) => {
    if (pickerMode === 'given') onUpdateBook(bookId, { is_taken: true, is_borrowed: false });
    if (pickerMode === 'taken') onUpdateBook(bookId, { is_taken: false, is_borrowed: true });
    setIsPickerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    const bookId = bookToDelete.id;

    if (activeTab === 'my' && onDeleteBook) onDeleteBook(bookId);
    if (activeTab === 'given') onUpdateBook(bookId, { is_taken: false });
    if (activeTab === 'taken') onUpdateBook(bookId, { is_borrowed: false });

    setIsDeleteConfirmOpen(false);
    setBookToDelete(null);
  };

  return (
    <>
      {/* Навигация и верхняя кнопка */}
      <div className="subheader">
        <div className="tabs">
          {['my', 'given', 'taken'].map((tab) => {
            const tabLabels = { my: 'Мои книги', given: 'Отдано', taken: 'Взято' };
            return (
              <button
                key={tab}
                className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            );
          })}
        </div>

        {/* Кнопка вверху шапки */}
        {activeTab === 'my' ? (
          <Link to="/addbook" className="add-book-btn" style={{ textDecoration: 'none' }}>
            + Добавить книгу
          </Link>
        ) : (
          <button className="add-book-btn" onClick={() => openPicker(activeTab)}>
            + Выбрать книгу
          </button>
        )}
      </div>

      {/* Сетка книг */}
      <div className="books-grid">
        {filteredBooks.map((book) => {
          const bookCover = book.cover || book.image;
          let statusText = 'У меня';
          let statusBg = '#e6f4ea';
          let statusColor = '#137333';

          if (book.is_taken) {
            statusText = 'Отдана';
            statusBg = '#fce8e6';
            statusColor = '#c5221f';
          } else if (book.is_borrowed) {
            statusText = 'Взята';
            statusBg = '#e0f2fe';
            statusColor = '#0369a1';
          }

          return (
            <Link 
              to={`/book/${book.id}`} 
              key={book.id} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="book-card">
                <div className="book-cover-wrapper">
                  <img src={bookCover} alt={book.title} className="book-cover" />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>

                  <div className="book-footer">
                    <span className="status-badge" style={{ backgroundColor: statusBg, color: statusColor }}>
                      {statusText}
                    </span>

                    <button
                      className="more-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBookToDelete(book);
                        setIsDeleteConfirmOpen(true);
                      }}
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Плитка добавления в конце сетки тоже остается */}
        <div className="book-card add-card-placeholder">
          {activeTab === 'my' ? (
            <Link to="/addbook" className="add-card-link">
              <div className="add-placeholder-content">
                <span className="plus-icon">+</span>
                <p>Добавить книгу</p>
              </div>
            </Link>
          ) : (
            <div className="add-card-link" onClick={() => openPicker(activeTab)}>
              <div className="add-placeholder-content">
                <span className="plus-icon">+</span>
                <p>Выбрать книгу</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      {isPickerOpen && (
        <BookPickerModal
          books={myBooksForPicker}
          onSelect={handleSelectBook}
          onClose={() => setIsPickerOpen(false)}
        />
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirmModal
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </>
  );
}