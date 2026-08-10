import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { BookPage } from './pages/BookPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AddBookPage } from "./pages/AddBookPage";
import { books as initialBooks } from './data/mockData';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['isAuth', 'userId']);

  // Стейт для отслеживания, проверили ли мы уже авторизацию
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const handleAddBook = (newBook) => {
    const bookWithId = { ...newBook, id: Date.now() };
    setBooks([...books, bookWithId]);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  // ===== ЗАЩИТА МАРШРУТОВ =====
  useEffect(() => {
    const publicPaths = ['/login', '/register'];

    // Если пользователь уже на странице логина/регистрации, пропускаем проверку
    if (publicPaths.includes(location.pathname)) {
      setIsAuthChecked(true);
      return;
    }

    // Смотрим на куки (isAuth или userId считаются авторизацией)
    const isAuth = cookies.isAuth === 'true' || !!cookies.userId;

    if (!isAuth) {
      // Если не авторизован - кидаем на логин
      navigate('/login');
    } else {
      // Если авторизован - разрешаем загрузку приложения
      setIsAuthChecked(true);
    }
  }, [cookies.isAuth, cookies.userId, location.pathname, navigate]);

  // ПОКА НЕ ПРОВЕРИЛИ АВТОРИЗАЦИЮ - НЕ РЕНДЕРИМ ПРИЛОЖЕНИЕ
  if (!isAuthChecked && !['/login', '/register'].includes(location.pathname)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontSize: '20px', 
        color: '#555' 
      }}>
        Проверка авторизации...
      </div>
    );
  }

  // ===== МАРШРУТИЗАЦИЯ =====
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Routes>
              <Route path="/" element={<CatalogPage books={books} onDeleteBook={handleDeleteBook} searchQuery={searchQuery} />} />
              <Route path="/book/:id" element={<BookPage books={books} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/addbook" element={<AddBookPage onAddBook={handleAddBook} />} />
            </Routes>
          </main>
        </div>
      } />
    </Routes>
  );
}

export default App;