import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './App.css';

import { useBooks } from './context/useBooks';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

import { CatalogPage } from './pages/Catalog/CatalogPage';
import { BookPage } from './pages/Book/BookPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { AddBookPage } from './pages/AddBook/AddBookPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import { EditBookPage } from './pages/EditBookPage/EditBookPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cookies] = useCookies(['userId']);

  const { books, handleAddBook, handleDeleteBook, handleUpdateBook } = useBooks(cookies.userId);

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Защищенные маршруты приложения */}
      <Route element={<ProtectedRoute searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}>
        <Route path="/" element={<CatalogPage books={books} onDeleteBook={handleDeleteBook} onUpdateBook={handleUpdateBook} searchQuery={searchQuery}/>} />
        <Route path="/book/:id" element={<BookPage books={books} onUpdateBook={handleUpdateBook} />} />
        
        {/* Передали books для экспорта файлов */}
        <Route path="/settings" element={<SettingsPage books={books} />} />
        
        <Route path="/addbook" element={<AddBookPage onAddBook={handleAddBook} />} />
        <Route path="/edit/:id" element={<EditBookPage books={books} onUpdateBook={handleUpdateBook} />} />
        <Route path="/profile" element={<ProfilePage books={books} onUpdateBook={handleUpdateBook} />} />
      </Route>
    </Routes>
  );
}

export default App;