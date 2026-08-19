import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { BookOpen, UserRound, Settings, LogOut, BookText } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['isAuth', 'userId', 'sessionId']);

  // Функция выхода из системы
  const handleLogout = (e) => {
    e.preventDefault();

    // Удаляем все куки авторизации
    removeCookie('isAuth', { path: '/' });
    removeCookie('userId', { path: '/' });
    removeCookie('sessionId', { path: '/' });

    // Перенаправляем на страницу входа
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Библиотека', icon: BookText },
    { path: '/profile', label: 'Профиль', icon: UserRound },
    { path: '/settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <BookOpen size={22} color="#ffffff" />
        </div>
        <div>
          <div className="logo-text">Bookly</div>
          <div className="logo-sub">моя библиотека</div>
        </div>
      </div>

      <nav className="menu-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="logout-section">
        <button 
          onClick={handleLogout} 
          className="logout-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}