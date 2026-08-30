import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useUser } from '../../context/UserContext';
import './LoginPage.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(['sessionId', 'userId', 'isAuth', 'userEmail', 'userName']);
  const { updateUser } = useUser();

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
        if (!response.ok) {
          throw new Error(data.message || `Ошибка сервера: ${response.status}`);
        }
      } else {
        const textError = await response.text();
        throw new Error(`Сервер вернул HTML с ошибкой ${response.status}.`);
      }

      removeCookie('sessionId', { path: '/' });
      removeCookie('userId', { path: '/' });
      removeCookie('isAuth', { path: '/' });
      removeCookie('userEmail', { path: '/' });
      removeCookie('userName', { path: '/' });

      if (data.session_id) {
        setCookie('sessionId', data.session_id, { path: '/', maxAge: 86400 });
        setCookie('userId', data.user_id, { path: '/', maxAge: 86400 });
        setCookie('isAuth', 'true', { path: '/', maxAge: 86400 });
        setCookie('userEmail', formData.email, { path: '/', maxAge: 86400 });

        const userName = data.user_name || cookies.userName || formData.email.split('@')[0];
        setCookie('userName', userName, { path: '/', maxAge: 86400 });
        updateUser({ name: userName, email: formData.email });
      }

      
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

export default Login;