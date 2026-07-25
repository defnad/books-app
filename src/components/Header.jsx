import React from 'react';
import { Search, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="header">
      <h1 className="page-title">Библиотека</h1>
      <div className="header-right">
        <div className="search-wrapper">
          <span className="search-icon">
            <Search size={16} />
          </span>
          <input type="text" placeholder="Поиск книг по названию, автору..." className="search-input" />
        </div>
        <button className="bell-btn" aria-label="Уведомления"><Bell /></button>
        <div className="user-avatar">
          <img src="https://static.vecteezy.com/system/resources/previews/036/280/654/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg" alt="Avatar" />
        </div>
      </div>
    </header>
  );
}