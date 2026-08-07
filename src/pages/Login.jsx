import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(['sessionId', 'userId', 'isAuth']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://sol-api.sherstde.ru/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textError = await response.text();
        throw new Error(`Сервер вернул HTML. Ошибка ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Неверный логин или пароль');
      }

      // ✅ Сохраняем СЕССИЮ, ID и флаг авторизации в куки
      if (data.session_id) {
        setCookie('sessionId', data.session_id, { path: '/', maxAge: 86400 });
        setCookie('userId', data.user_id, { path: '/', maxAge: 86400 });
        setCookie('isAuth', 'true', { path: '/', maxAge: 86400 });

        console.log('✅ Куки успешно сохранены!');
        console.log('🔑 session_id:', data.session_id);
        console.log('👤 user_id:', data.user_id);
      } else {
        console.warn('⚠️ Бэкенд не вернул session_id.');
      }

      alert('Добро пожаловать!');
      navigate('/'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        <div className="input-group">
          <label htmlFor="email">Электронная почта</label>
          <input type="email" id="email" name="email" placeholder="example@mail.com" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" name="password" placeholder="Введите пароль" required value={formData.password} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        <p className="login-link">Нет аккаунта? <Link to="/register">Зарегестрироваться</Link></p>
      </form>
    </div>
  );
};

// ✅ Вот эта строка обязательна, чтобы App.jsx мог найти ваш компонент!
export default Login; 