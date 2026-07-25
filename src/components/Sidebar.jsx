import React from 'react';
import { Link } from 'react-router';
import { BookOpen, UserRound, Settings, LogOut, BookText } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <BookOpen size={22} color="#ffffff" />
        </div>
        <div className="logo-text-wrapper">
          <div className="logo-text">Bookly</div>
          <div className="logo-sub">моя библиотека</div>
        </div>
      </div>

      <nav className="menu-links">
        <Link to="/" className="menu-link active">
          <BookText size={18} /> Библиотека
        </Link>
        <Link to="/profile" className="menu-link">
          <UserRound size={18} /> Профиль
        </Link>
        <Link to="/settings" className="menu-link">
          <Settings size={18} /> Настройки
        </Link>
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