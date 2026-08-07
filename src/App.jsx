import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
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

  const handleAddBook = (newBook) => {
    const bookWithId = { ...newBook, id: Date.now() };
    setBooks([...books, bookWithId]);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  return (
    <Routes>
      {/* 1. СТРАНИЦЫ ВНЕ МЕНЮ (вход и регистрация) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. ОСНОВНОЕ ПРИЛОЖЕНИЕ С БОКОВЫМ МЕНЮ */}
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