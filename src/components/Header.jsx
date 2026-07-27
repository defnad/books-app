import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { books } from '../data/mockData';

export function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="page-title">Библиотека</h1>
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
        <button className="bell-btn" aria-label="Уведомления"><Bell /></button>
        <div className="user-avatar">
          <img src="https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" alt="Avatar" />
        </div>
      </div>
    </header>
  );
}