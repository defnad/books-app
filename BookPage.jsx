import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';

export function BookPage() {
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));

  if (!book) return <h2>Книга не найдена!</h2>;

  return (
    <div className="main-content">
      <Link to="/" className="menu-link">← Назад в библиотеку</Link>
      
      <div className="book-card" style={{ marginTop: '20px' }}>
        <h1>{book.title}</h1>
        <p>Автор: {book.author}</p>
      </div>
    </div>
  );
}
