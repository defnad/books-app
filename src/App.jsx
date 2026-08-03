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

function App() {
  const [books, setBooks] = useState(initialBooks);

  const handleAddBook = (newBook) => {
    const bookWithId = { ...newBook, id: Date.now() };
    console.log('Добавляем книгу:', bookWithId);
    setBooks([...books, bookWithId]);
  };

  const handleDeleteBook = (id) => {
    console.log('Запрошено удаление книги с id:', id);
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setBooks(prevBooks => {
        const newBooks = prevBooks.filter(book => book.id !== id);
        console.log('После удаления осталось книг:', newBooks.length);
        return newBooks;
      });
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<CatalogPage books={books} onDeleteBook={handleDeleteBook} />} />
          <Route path="/book/:id" element={<BookPage books={books} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/addbook" element={<AddBookPage onAddBook={handleAddBook} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;