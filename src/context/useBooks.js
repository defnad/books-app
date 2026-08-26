import { useState, useEffect } from 'react';

export function useBooks(userId) {
  // Загрузка из localStorage
  const loadBooksForUser = (id) => {
    if (!id) return [];
    const storageKey = `books_${id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    localStorage.setItem(storageKey, JSON.stringify([]));
    return [];
  };

  const [books, setBooks] = useState(() => loadBooksForUser(userId));

  // Сохранение при смене пользователя
  useEffect(() => {
    setBooks(loadBooksForUser(userId));
  }, [userId]);

  // Сохранение при изменении списка книг
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`books_${userId}`, JSON.stringify(books));
    }
  }, [books, userId]);

  // Обработчики
  const handleAddBook = (newBook) => {
    const bookWithId = { ...newBook, id: Date.now() };
    setBooks((prev) => [...prev, bookWithId]);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
  };

  const handleUpdateBook = (id, updates) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book))
    );
  };

  return {
    books,
    handleAddBook,
    handleDeleteBook,
    handleUpdateBook,
  };
}