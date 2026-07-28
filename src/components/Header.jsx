import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, BellOff } from 'lucide-react';
import { books } from '../data/mockData';

export function Header() {
  const [query, setQuery] = useState('');
  const [isBellOn, setIsBellOn] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleBell = () => {
    setIsBellOn(prev => !prev);
  };

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'Профиль';
    if (location.pathname === '/settings') return 'Настройки';
    return 'Библиотека';
  };

  return (
    <header className="header">
      <h1 className="page-title">{getPageTitle()}</h1>
      <div className="header-right">
        <div className="search-wrapper">
          <span className="search-icon">
            <Search size={16} />
          </span>
          <input
            type="text" 
            placeholder="Поиск книг по названию, автору..." 
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const book = books.find(b => 
                  b.title.toLowerCase().includes(query.toLowerCase()) || 
                  b.author.toLowerCase().includes(query.toLowerCase())
                );
                if (book) {
                  navigate(`/book/${book.id}`);
                  setQuery('');
                }
              }
            }}
          />
        </div>

        <button 
          className="bell-btn"
          onClick={toggleBell}
          aria-label="Уведомления"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'transform 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(-20deg) scale(1.2)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {isBellOn ? <Bell size={20} /> : <BellOff size={20} />}
        </button>

        <div className="user-avatar">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" 
            alt="Avatar" 
          />
        </div>
      </div>
    </header>
  );
}