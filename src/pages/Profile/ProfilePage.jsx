import { Link } from 'react-router-dom';
import { BookOpen, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';


export function ProfilePage({ books }) {
  const { user } = useUser();

  // Статистика рассчитывается динамически на основе текущего состояния книг
  const givenBooks = books.filter(b => b.is_taken);
  const borrowedBooks = books.filter(b => b.is_borrowed);
  const totalBooks = books.length;

  return (
    <div className="profile-container">
      <div className="book-card profile-card">
        <div className="profile-user">
          <div className="user-avatar profile-avatar">
            <img src={user.avatar} alt="Аватар" />
          </div>
          <div>
            <h2 className="book-title profile-name">{user.name}</h2>
            <p className="book-author">{user.email}</p>
          </div>
        </div>
        <Link to="/settings" className="add-book-btn profile-edit-btn">Редактировать</Link>
      </div>

      {/* Статистика - теперь она живая и обновляется при любых изменениях! */}
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
                <span className="exchange-badge">На руках у другого читателя</span>
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