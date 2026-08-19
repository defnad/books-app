import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useUser } from '../../context/UserContext';

export function SettingsPage() {
  const { user, updateUser } = useUser();
  const [cookies] = useCookies(['userId', 'sessionId']);
  const userId = cookies.userId;
  const sessionId = cookies.sessionId;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newData = { name, email };

    // 1. Сначала обновляем интерфейс (контекст и localStorage) мгновенно
    updateUser(newData);

    try {
      const response = await fetch(`https://sol-api.sherstde.ru/user/${userId}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          'SessionID': sessionId
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        // Если бэкенд упал или такого метода нет - просто выводим предупреждение
        console.warn('⚠️ Данные обновлены локально, но бэкенд их не принял:', response.status);
        alert('Настройки сохранены локально. Дождитесь эндпоинт для обновления профиля!');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Данные успешно обновлены на бэкенде:', data);
      alert('Настройки успешно сохранены и синхронизированы с бэкендом!');

    } catch (err) {
      console.error('❌ Ошибка сети при сохранении настроек:', err);
      alert('Ошибка при отправке на бэкенд, но настройки сохранены локально.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="book-card settings-card">
        <h2 className="settings-title">Профиль и безопасность</h2>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <label className="form-group">
            <span className="form-label">Имя и фамилия</span>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </label>

          <label className="form-group">
            <span className="form-label">Email</span>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </label>

          <label className="form-group">
            <span className="form-label">Новый пароль</span>
            <input type="password" className="form-input" placeholder="Оставьте пустым, если не хотите менять" />
          </label>

          <button type="submit" className="add-book-btn save-btn" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
}