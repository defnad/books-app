import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Plus } from 'lucide-react';
import { BookPickerModal } from './BookPickerModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import './CatalogPage.css';

export function CatalogPage({ books = [], onDeleteBook, onUpdateBook, searchQuery = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('my');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Модальные окна
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Закрываем меню 3 точек при клике в любую область страницы
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Переключение вкладки при переходе со страницы книги и очистка state в истории
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const query = searchQuery.toLowerCase().trim();

  // Фильтрация списка по активной вкладке и поисковому запросу
  const filteredBooks = books.filter((book) => {
    if (activeTab === 'given' && !book.is_taken) return false;
    if (activeTab === 'taken' && !book.is_borrowed) return false;
    if (query === '') return true;

    const title = book.title ? book.title.toLowerCase() : '';
    const author = book.author ? book.author.toLowerCase() : '';
    return title.includes(query) || author.includes(query);
  });

  // Книги, доступные для передачи/выбора в модалке
  const myBooksForPicker = books.filter((b) => !b.is_taken && !b.is_borrowed);

  const openPicker = (mode) => {
    setPickerMode(mode);
    setIsPickerOpen(true);
  };

  const handleSelectBook = (bookId, extraData = {}) => {
    if (pickerMode === 'given') {
      onUpdateBook(bookId, { is_taken: true, is_borrowed: false, ...extraData });
    }
    if (pickerMode === 'taken') {
      onUpdateBook(bookId, { is_taken: false, is_borrowed: true, ...extraData });
    }
    setIsPickerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    const bookId = bookToDelete.id;

    // Временно подменяем confirm, чтобы заглушить стандартный браузерный алерт
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    if (activeTab === 'my' && onDeleteBook) onDeleteBook(bookId);
    if (activeTab === 'given') onUpdateBook(bookId, { is_taken: false });
    if (activeTab === 'taken') onUpdateBook(bookId, { is_borrowed: false });

    window.confirm = originalConfirm;

    setIsDeleteConfirmOpen(false);
    setBookToDelete(null);
  };

  // stopPropagation предотвращает переход по ссылке-карточке при клике на кнопки/меню
  const toggleMenu = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(activeMenuId === bookId ? null : bookId);
  };

  const handleEditClick = (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(null);
    navigate(`/edit/${bookId}`);
  };

  const handleDeleteClick = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId(null);
    setBookToDelete(book);
    setIsDeleteConfirmOpen(true);
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

        {activeTab === 'my' ? (
          <Link to="/addbook" className="add-book-btn">
            <Plus size={16} /> Добавить книгу
          </Link>
        ) : (
          <button className="add-book-btn" onClick={() => openPicker(activeTab)}>
            <Plus size={16} /> Выбрать книгу
          </button>
        )}
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => {
          const bookCover = book.cover || book.image;

          let statusText = 'У меня';
          let statusClass = 'status-badge my-status';

          if (book.is_taken) {
            statusText = 'Отдана';
            statusClass = 'status-badge given-status';
          } else if (book.is_borrowed) {
            statusText = 'Взята';
            statusClass = 'status-badge taken-status';
          }

          return (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card-link">
              <div className="book-card">
                <div className="book-cover-wrapper">
                  <img src={bookCover} alt={book.title} className="book-cover" />
                </div>
                
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>

                  <div className="book-footer">
                    <span className={statusClass}>{statusText}</span>

                    <div className="more-menu-container">
                      <button className="more-btn" onClick={(e) => toggleMenu(e, book.id)}>
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === book.id && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={(e) => handleEditClick(e, book.id)}>
                            <Edit size={16} /> Редактировать
                          </button>
                          <button className="dropdown-item delete-item" onClick={(e) => handleDeleteClick(e, book)}>
                            <Trash2 size={16} /> Удалить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        <div className="book-card add-card-placeholder">
          {activeTab === 'my' ? (
            <Link to="/addbook" className="add-card-link">
              <div className="add-placeholder-content">
                <span className="plus-icon"><Plus size={24} /></span>
                <p>Добавить книгу</p>
              </div>
            </Link>
          ) : (
            <div className="add-card-link" onClick={() => openPicker(activeTab)}>
              <div className="add-placeholder-content">
                <span className="plus-icon"><Plus size={24} /></span>
                <p>Выбрать книгу</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPickerOpen && (
        <BookPickerModal
          books={myBooksForPicker}
          mode={pickerMode}
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