import React from 'react';

export function SettingsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Настройки сохранены!');
  };

  return (
    <div className="settings-container">
      <div className="book-card settings-card">
        <h2 className="settings-title">Профиль и безопасность</h2>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <label className="form-group">
            <span className="form-label">Имя и фамилия</span>
            <input type="text" className="form-input" defaultValue="Иван Иванов" />
          </label>

          <label className="form-group">
            <span className="form-label">Email</span>
            <input type="email" className="form-input" defaultValue="ivanov@mail.ru" />
          </label>

          <label className="form-group">
            <span className="form-label">Новый пароль</span>
            <input type="password" className="form-input" placeholder="Оставьте пустым, если не хотите менять" />
          </label>

          <button type="submit" className="add-book-btn save-btn">
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  );
}