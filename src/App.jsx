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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['isAuth', 'userId']);
  const userId = cookies.userId;

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // --- Загрузка книг из localStorage для текущего пользователя ---
  const loadBooksForUser = (userId) => {
    if (!userId) return []; // Если не авторизован, возвращаем пустой массив
    const storageKey = `books_${userId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    // Для НОВЫХ пользователей: создаём пустую полку навсегда
    localStorage.setItem(storageKey, JSON.stringify([]));
    return [];
  };

  const [books, setBooks] = useState(() => loadBooksForUser(userId));

  // --- Сохранение книг в localStorage ---
  const saveBooksForUser = (userId, booksToSave) => {
    if (!userId) return;
    const storageKey = `books_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(booksToSave));
  };

  // При изменении userId (вход/выход) перезагружаем книги
  useEffect(() => {
    setBooks(loadBooksForUser(userId));
  }, [userId]);

  // При каждом изменении books сохраняем в localStorage
  useEffect(() => {
    if (userId) {
      saveBooksForUser(userId, books);
    }
  }, [books, userId]);

  // --- Обработчики ---
  const handleAddBook = (newBook) => {
    const bookWithId = { ...newBook, id: Date.now() };
    setBooks([...books, bookWithId]);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  const handleUpdateBook = (id, updates) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id ? { ...book, ...updates } : book
      )
    );
  };

  // ===== ЗАЩИТА МАРШРУТОВ =====
  useEffect(() => {
    const publicPaths = ['/login', '/register'];

    if (publicPaths.includes(location.pathname)) {
      setIsAuthChecked(true);
      return;
    }

    const isAuth = cookies.isAuth === 'true' || !!cookies.userId;

    if (!isAuth) {
      navigate('/login');
    } else {
      setIsAuthChecked(true);
    }
  }, [cookies.isAuth, cookies.userId, location.pathname, navigate]);

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
              <Route 
                path="/" 
                element={
                  <CatalogPage 
                    books={books} 
                    onDeleteBook={handleDeleteBook} 
                    onUpdateBook={handleUpdateBook} 
                    searchQuery={searchQuery} 
                  />
                } 
              />
              <Route path="/book/:id" element={<BookPage books={books} />} />
              <Route path="/profile" element={<ProfilePage books={books} />} />
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