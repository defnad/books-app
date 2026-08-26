import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { BookOpen, UserRound, Settings, LogOut, BookText } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['isAuth', 'userId', 'sessionId']);

  const handleLogout = () => {
    removeCookie('isAuth', { path: '/' });
    removeCookie('userId', { path: '/' });
    removeCookie('sessionId', { path: '/' });
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
          
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || !location.pathname.startsWith('/p') && !location.pathname.startsWith('/s'));

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
        <button type="button" onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}