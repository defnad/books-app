import React, { useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useUser } from '../../context/UserContext';
import { Download, Bell, User as UserIcon, Camera, Database, Trash2 } from 'lucide-react';
import './SettingsPage.css';

export function SettingsPage({ books = [] }) {
  const { user, updateUser } = useUser();
  const [cookies] = useCookies(['userId', 'sessionId']);
  const userId = cookies.userId;
  const sessionId = cookies.sessionId;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const [emailNotify, setEmailNotify] = useState(true);
  const [remindReturn, setRemindReturn] = useState(true);

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      updateUser({ avatar: imageUrl });
    }
  };

  const handleExportJSON = () => {
    if (books.length === 0) {
      alert('У вас пока нет книг для экспорта!');
      return;
    }

    const jsonString = JSON.stringify(books, null, 2);
    const dataUrl = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'my_library.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportCSV = () => {
    if (books.length === 0) {
      alert('У вас пока нет книг для экспорта!');
      return;
    }

    let csvText = 'ID;Название;Автор;Статус\n';

    books.forEach((book) => {
      let status = 'На полке';
      if (book.is_taken) status = 'Отдана другу';
      if (book.is_borrowed) status = 'Взята почитать';

      csvText += `"${book.id}";"${book.title}";"${book.author}";"${status}"\n`;
    });

    const csvUrl = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvText);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = 'my_library.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedUser = { name, email, avatar };
    updateUser(updatedUser);

    try {
      // ✅ ЗДЕСЬ БЫЛА ЗАМЕНА
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'SessionID': sessionId
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert('Настройки успешно сохранены!');
      } else {
        alert('Сохранено локально (бэкенд недоступен)');
      }
    } catch (error) {
      alert('Ошибка сети, сохранили локально');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    const isSure = window.confirm('Вы уверены? Это сбросит кэш и выйдет из аккаунта.');
    if (isSure) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-grid">
        
        <div className="settings-column">
          <div className="book-card settings-card">
            <div className="card-section-header">
              <Camera size={18} />
              <h2 className="settings-title">Фото профиля</h2>
            </div>

            <div className="avatar-upload-block">
              <div className="avatar-preview-wrapper" onClick={handleAvatarClick}>
                <img 
                  src={avatar || user?.avatar || 'https://via.placeholder.com/100'} 
                  alt="Avatar" 
                  className="avatar-img"
                />
                <div className="avatar-overlay">
                  <Camera size={20} color="#fff" />
                </div>
              </div>
              <div className="avatar-info">
                <button type="button" className="export-btn secondary" onClick={handleAvatarClick}>
                  Загрузить новое фото
                </button>
                <div className="setting-desc" style={{ marginTop: '6px' }}>JPG, PNG до 5 МБ</div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <div className="book-card settings-card">
            <div className="card-section-header">
              <UserIcon size={18} />
              <h2 className="settings-title">Профиль и безопасность</h2>
            </div>
            
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
                <input 
                  type="password" 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Оставьте пустым, если не хотите менять" 
                />
              </label>

              <button type="submit" className="add-book-btn save-btn" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </form>
          </div>
        </div>

        <div className="settings-column">
          <div className="book-card settings-card">
            <div className="card-section-header">
              <Bell size={18} />
              <h2 className="settings-title">Уведомления</h2>
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">Напоминания о возврате</div>
                <div className="setting-desc">Уведомлять за 3 дня до дедлайна возврата книги</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={remindReturn} 
                  onChange={(e) => setRemindReturn(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">Email-уведомления</div>
                <div className="setting-desc">Получать сводку об обменах на почту</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailNotify} 
                  onChange={(e) => setEmailNotify(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="book-card settings-card">
            <div className="card-section-header">
              <Download size={18} />
              <h2 className="settings-title">Экспорт данных</h2>
            </div>
            <p className="setting-desc" style={{ marginBottom: '14px' }}>
              Вы можете выгрузить всю свою коллекцию книг в файл для резервного копирования.
            </p>

            <div className="export-buttons-group">
              <button type="button" className="export-btn" onClick={handleExportJSON}>
                <Download size={16} /> Скачать JSON
              </button>
              <button type="button" className="export-btn secondary" onClick={handleExportCSV}>
                <Download size={16} /> Скачать CSV (Excel)
              </button>
            </div>
          </div>

          <div className="book-card settings-card">
            <div className="card-section-header">
              <Database size={18} />
              <h2 className="settings-title">Данные и кэш</h2>
            </div>
            <p className="setting-desc" style={{ marginBottom: '14px' }}>
              Очистка локального кэша приложения в браузере.
            </p>

            <button type="button" className="export-btn secondary danger-btn" onClick={handleClearCache}>
              <Trash2 size={16} /> Очистить кэш приложения
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}