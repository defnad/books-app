import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function CatalogPage({ books, onDeleteBook, onUpdateBook, searchQuery = '' }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('my');
  

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

  const filteredBooks = books.filter((book) => {
    if (activeTab === 'given') {
      if (!book.is_taken) return false;
    }
    if (activeTab === 'taken') {
      if (!book.is_borrowed) return false;
    }
    if (query === '') return true;
    const title = book.title ? book.title.toLowerCase() : '';
    const author = book.author ? book.author.toLowerCase() : '';
    return title.includes(query) || author.includes(query);
  });

  const myBooksForPicker = books.filter(b => !b.is_taken && !b.is_borrowed);

  const openPicker = (mode) => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  const closePicker = () => {
    setIsPickerOpen(false);
    setPickerMode(null);
  };

  const handleSelectBook = (bookId) => {
    if (pickerMode === 'given') {
      onUpdateBook(bookId, { is_taken: true, is_borrowed: false });
    } else if (pickerMode === 'taken') {
      onUpdateBook(bookId, { is_taken: false, is_borrowed: true });
    }
    closePicker();
  };

  // Открытие модалки подтверждения
  const openDeleteConfirm = (book) => {
    setBookToDelete(book);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setBookToDelete(null);
  };


  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    const bookId = bookToDelete.id;

    if (activeTab === 'my') {
      // В "Моих" удаляем навсегда
      if (onDeleteBook) onDeleteBook(bookId);
    } else if (activeTab === 'given') {
      // В "Отдано" снимаем is_taken
      onUpdateBook(bookId, { is_taken: false });
    } else if (activeTab === 'taken') {
      // В "Взято" снимаем is_borrowed
      onUpdateBook(bookId, { is_borrowed: false });
    }
    closeDeleteConfirm();
  };

  return (
    <>
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
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => {
          const bookCover = book.cover ? book.cover : book.image;
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
            <div key={book.id} style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                    </div>
                  </div>
                </div>
              </Link>

              <button
                className="more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirm(book);
                }}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                ⋮
              </button>
            </div>
          );
        })}

        {/* Плюсик в сетке */}
        <div className="book-card add-card-placeholder" style={{ cursor: 'pointer', position: 'relative' }}>
          {activeTab === 'my' ? (
            <Link to="/addbook" style={{ textDecoration: 'none', color: 'inherit', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="add-placeholder-content">
                <span className="plus-icon">+</span>
                <p>Добавить книгу</p>
              </div>
            </Link>
          ) : (
            <div 
              onClick={() => openPicker(activeTab)} 
              style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            >
              <div className="add-placeholder-content">
                <span className="plus-icon">+</span>
                <p>Выбрать книгу</p>
              </div>
            </div>
          )}
        </div>
      </div>


      {isPickerOpen && (
        <div className="picker-modal-overlay" onClick={closePicker}>
          <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="picker-modal-header">
              <h3>Выберите книгу</h3>
              <button className="picker-modal-close" onClick={closePicker}>×</button>
            </div>
            <div className="picker-modal-list">
              {myBooksForPicker.length > 0 ? (
                myBooksForPicker.map(book => (
                  <div key={book.id} className="picker-modal-item" onClick={() => handleSelectBook(book.id)}>
                    <span className="picker-modal-item-title">{book.title}</span>
                    <span className="picker-modal-item-author">{book.author}</span>
                  </div>
                ))
              ) : (
                <div className="picker-modal-item disabled">У вас нет книг для выбора</div>
              )}
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="delete-confirm-overlay" onClick={closeDeleteConfirm}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <h3>Подтверждение</h3>
              <button className="delete-confirm-close" onClick={closeDeleteConfirm}>×</button>
            </div>
            <div className="delete-confirm-body">
              <p className="delete-confirm-message">Вы точно хотите удалить книгу?</p>
              <div className="delete-confirm-actions">
                <button className="delete-confirm-btn cancel" onClick={closeDeleteConfirm}>Нет</button>
                <button className="delete-confirm-btn confirm" onClick={handleConfirmDelete}>Да</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}