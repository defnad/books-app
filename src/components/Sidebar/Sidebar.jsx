import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, UserRound, Settings, LogOut, BookText } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

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
        <Link to="/logout" className="logout-link">
          <LogOut size={18} />
          <span>Выйти</span>
        </Link>
      </div>
    </aside>
  );
}