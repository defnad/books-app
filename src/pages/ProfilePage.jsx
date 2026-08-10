import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Импортируем контекст
import { books as initialBooks } from '../data/mockData';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser(); // Берём данные и функцию обновления из контекста
  
  const [cookies, , removeCookie] = useCookies(['userId', 'sessionId', 'isAuth', 'userEmail', 'userName']);
  const userId = cookies.userId;
  const sessionId = cookies.sessionId;

  const [loading, setLoading] = useState(true);

  const givenBooks = initialBooks.filter(b => b.is_taken);
  const borrowedBooks = initialBooks.filter(b => b.is_borrowed);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://sol-api.sherstde.ru/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'SessionID': sessionId
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            console.warn('⚠️ Сессия истекла. Удаляем куки и редиректим.');
            removeCookie('sessionId', { path: '/' });
            removeCookie('userId', { path: '/' });
            removeCookie('isAuth', { path: '/' });
            removeCookie('userEmail', { path: '/' });
            removeCookie('userName', { path: '/' });
            navigate('/login'); 
            return; 
          }
          throw new Error(`HTTP ошибка: ${response.status}`);
        }

        const data = await response.json();
        // 💡 Синхронизируем данные с бэкенда с нашим контекстом
        if (data.name || data.email) {
          updateUser({ name: data.name, email: data.email });
        }
      } catch (err) {
        console.error('❌ Ошибка при загрузке профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, sessionId, navigate, removeCookie, updateUser]);

  if (!userId) return null; 
  if (loading) return <p style={{ padding: '20px' }}>Загрузка вашего профиля...</p>;

  // ✅ Данные теперь берутся из контекста (а не из жестко зашитого объекта)
  const displayName = user.name;
  const displayEmail = user.email;
  const displayAvatar = user.avatar;

  return (
    <div className="profile-container">
      <div className="book-card profile-card">
        <div className="profile-user">
          <div className="user-avatar profile-avatar">
            <img src={displayAvatar} alt="Аватар" />
          </div>
          <div>
            <h2 className="book-title profile-name">{displayName}</h2>
            <p className="book-author">{displayEmail}</p>
          </div>
        </div>
        <Link to="/settings" className="add-book-btn profile-edit-btn">Редактировать</Link>
      </div>

      <div className="profile-stats">
        <div className="book-card stat-card">
          <div className="logo-icon stat-icon purple"><BookOpen size={20} /></div>
          <div><div className="page-title stat-number">{initialBooks.length}</div><div className="book-author">Всего книг</div></div>
        </div>
        <div className="book-card stat-card">
          <div className="logo-icon stat-icon green"><ArrowUpRight size={20} /></div>
          <div><div className="page-title stat-number">{givenBooks.length}</div><div className="book-author">Отдано друзьям</div></div>
        </div>
        <div className="book-card stat-card">
          <div className="logo-icon stat-icon blue"><ArrowDownLeft size={20} /></div>
          <div><div className="page-title stat-number">{borrowedBooks.length}</div><div className="book-author">Взято почитать</div></div>
        </div>
      </div>

      <div className="book-card exchanges-card">
        <h3 className="exchanges-title">Текущие обмены</h3>
        {givenBooks.length > 0 ? (
          <div className="exchanges-list">
            {givenBooks.map((book) => (
              <div key={book.id} className="exchange-item">
                <div><span className="exchange-book-title">{book.title}</span><span className="book-author">{book.author}</span></div>
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