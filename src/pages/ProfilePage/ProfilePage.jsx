import './ProfilePage.css';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { books } from '../../data/mockData';

const USER = {
  name: 'Иван Иванов',
  email: 'ivanov@mail.ru',
  avatar: 'https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg',
};

export function ProfilePage() {
  const givenBooks = books.filter(b => b.is_taken);
  const borrowedBooks = books.filter(b => b.is_borrowed);

  return (
    <div className="profile-container">
      {/* Карточка пользователя */}
      <div className="book-card profile-card">
        <div className="profile-user">
          <div className="user-avatar profile-avatar">
            <img src={USER.avatar} alt="Аватар" />
          </div>
          <div>
            <h2 className="book-title profile-name">{USER.name}</h2>
            <p className="book-author">{USER.email}</p>
          </div>
        </div>

        <Link to="/settings" className="add-book-btn profile-edit-btn">
          Редактировать
        </Link>
      </div>

      {/* Статистика */}
      <div className="profile-stats">
        <div className="book-card stat-card">
          <div className="logo-icon stat-icon purple">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="page-title stat-number">{books.length}</div>
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

      {/* Список обменов */}
      <div className="book-card exchanges-card">
        <h3 className="exchanges-title">Текущие обмены</h3>

        {givenBooks.length > 0 ? (
          <div className="exchanges-list">
            {givenBooks.map((book) => (
              <div key={book.id} className="exchange-item">
                <div>
                  <span className="exchange-book-title">{book.title}</span>
                  <span className="book-author">{book.author}</span>
                </div>
                <span className="exchange-badge">
                  На руках у другого читателя
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="book-author">Все ваши книги сейчас дома на полке.</p>
        )}
      </div>
    </div>
  );
}