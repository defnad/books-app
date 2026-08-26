import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, BellOff } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './Header.css';

export function Header({ searchQuery, setSearchQuery }) {
  const [isBellOn, setIsBellOn] = useState(true);
  const location = useLocation();
  const { user } = useUser(); // Берем аватар пользователя из контекста

  const toggleBell = () => {
    setIsBellOn(prev => !prev);
  };

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'Профиль';
    if (location.pathname === '/settings') return 'Настройки';
    if (location.pathname === '/add-book') return 'Добавление книги';
    return 'Библиотека';
  };

  const isCatalogPage = location.pathname === '/';

  return (
    <header className="header">
      <h1 className="page-title">{getPageTitle()}</h1>
      <div className="header-right">
        {/* Поиск показывыем только на странице библиотеки */}
        {isCatalogPage && (
          <div className="search-wrapper">
            <span className="search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Поиск книг по названию, автору..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <button 
          className="bell-btn"
          onClick={toggleBell}
          aria-label="Уведомления"
        >
          {isBellOn ? <Bell size={20} /> : <BellOff size={20} />}
        </button>

        <div className="user-avatar">
          <img 
            src={user?.avatar || "https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"} 
            alt="Avatar" 
          />
        </div>
      </div>
    </header>
  );
}