import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, ArrowDownLeft, Camera, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './ProfilePage.css';

export function ProfilePage({ books = [], onUpdateBook }) {
  const { user, setUser } = useUser();
  const fileInputRef = useRef(null);

  // Форматирование даты регистрации пользователя (в родительном падеже)
  const getRegistrationDateText = () => {
    let dateStr = user?.created_at || user?.registeredAt || localStorage.getItem('registrationDate');

    if (!dateStr) {
      dateStr = new Date().toISOString();
      localStorage.setItem('registrationDate', dateStr);
    }

    const date = new Date(dateStr);
    const monthsGenitive = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const monthName = monthsGenitive[date.getMonth()];
    const year = date.getFullYear();

    return `На Bookly с ${monthName} ${year} г.`;
  };

  // Фильтрация книг по категориям обмена
  const givenBooks = books.filter((b) => b.is_taken);
  const borrowedBooks = books.filter((b) => b.is_borrowed);
  const allExchanges = [...givenBooks, ...borrowedBooks];
  const totalBooks = books.length;

  // Загрузка нового аватара
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (setUser) {
        setUser((prev) => ({ ...prev, avatar: imageUrl }));
      }
    }
  };

  // Расчет оставшихся дней до возврата
  const getDeadlineInfo = (returnDateStr) => {
    if (!returnDateStr) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(returnDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Просрочено на ${Math.abs(diffDays)} дн.`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Вернуть сегодня!', isOverdue: true };
    } else {
      return { text: `Осталось ${diffDays} дн.`, isOverdue: false };
    }
  };

  // Сброс статуса обмена книги
  const handleReturnBook = (book) => {
    if (!onUpdateBook) return;
    if (book.is_taken) {
      onUpdateBook(book.id, { is_taken: false, borrowedTo: null, returnDate: null });
    } else if (book.is_borrowed) {
      onUpdateBook(book.id, { is_borrowed: false, borrowedFrom: null, returnDate: null });
    }
  };

  return (
    <div className="profile-container">
      {/* Карточка пользователя */}
      <div className="book-card profile-card">
        <div className="profile-user">
          <div className="user-avatar profile-avatar" onClick={handleAvatarClick} title="Сменить аватарку">
            <img src={user?.avatar || '/placeholder-avatar.png'} alt="Аватар" />
            <div className="avatar-overlay">
              <Camera size={18} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h2 className="book-title profile-name">{user?.name || 'Пользователь'}</h2>
            <p className="book-author">{user?.email || 'user@example.com'}</p>
            <p className="profile-registered-date">{getRegistrationDateText()}</p>
          </div>
        </div>
        <Link to="/settings" className="add-book-btn profile-edit-btn">Редактировать</Link>
      </div>

      {/* Метрики и статистика */}
      <div className="profile-stats">
        <div className="book-card stat-card">
          <div className="logo-icon stat-icon purple">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="page-title stat-number">{totalBooks}</div>
            <div className="book-author">Всего книг</div>
          </div>
        </div>

        <div className="book-card stat-card">
          <div className="logo-icon stat-icon green">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <div className="page-title stat-number">{givenBooks.length}</div>
            <div className="book-author">Отдано друзьям</div>
          </div>
        </div>

        <div className="book-card stat-card">
          <div className="logo-icon stat-icon blue">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <div className="page-title stat-number">{borrowedBooks.length}</div>
            <div className="book-author">Взято почитать</div>
          </div>
        </div>
      </div>

      {/* Секция активных обменов */}
      <div className="book-card exchanges-card">
        <h3 className="exchanges-title">Текущие обмены ({allExchanges.length})</h3>
        {allExchanges.length > 0 ? (
          <div className="exchanges-list">
            {allExchanges.map((book) => {
              const deadline = getDeadlineInfo(book.returnDate);
              
              return (
                <div key={book.id} className="exchange-item">
                  <div className="exchange-item-main">
                    <span className="exchange-book-title">{book.title}</span>
                    <span className="book-author">{book.author}</span>
                    
                    <div className="exchange-person-info">
                      {book.is_taken && (
                        <span className="person-tag given">
                          Отдана: <strong>{book.borrowedTo || 'Другу'}</strong>
                        </span>
                      )}
                      {book.is_borrowed && (
                        <span className="person-tag borrowed">
                          Взята у: <strong>{book.borrowedFrom || 'Друга'}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="exchange-item-right">
                    {deadline && (
                      <span className={`deadline-badge ${deadline.isOverdue ? 'overdue' : ''}`}>
                        {deadline.text}
                      </span>
                    )}

                    <button 
                      className="return-action-btn"
                      onClick={() => handleReturnBook(book)}
                      title="Отметить как возвращенную"
                    >
                      <CheckCircle2 size={16} />
                      <span>{book.is_taken ? 'Вернули' : 'Вернуть'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="book-author">Все книги сейчас дома на полке. Активных обменов нет.</p>
        )}
      </div>
    </div>
  );
}