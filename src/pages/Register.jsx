import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log("📤 Отправляемые данные на сервер:", formData); // Отладка

    try {
      const response = await fetch('https://sol-api.sherstde.ru/register', {
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
        throw new Error(data.message || 'Ошибка регистрации на сервере');
      }

      alert('Регистрация успешна!');
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        <div className="input-group">
          <label htmlFor="email">Электронная почта</label>
          <input type="email" id="email" name="email" placeholder="example@mail.com" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="name">Имя (name)</label>
          {/* name="name" в инпуте */}
          <input type="text" id="name" name="name" placeholder="Ваше имя" required value={formData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" name="password" placeholder="Минимум 6 символов" required value={formData.password} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
        
        <p className="login-link">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </form>
    </div>
  );
};

export default Register;
