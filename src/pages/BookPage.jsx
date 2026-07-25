import React from 'react';
import { useParams, Link } from 'react-router';
import { books } from '../data/mockData';

export function BookPage() {
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));

  if (!book) return <h2>Книга не найдена!</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>← Назад в библиотеку</Link>
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
        <img src={book.cover || book.image} alt={book.title} style={{ width: '200px', borderRadius: '12px' }} />
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{book.title}</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>{book.author}</p>
          <p style={{ marginTop: '15px' }}><strong>Год издания:</strong> {book.release_year || 'Не указан'}</p>
          <p><strong>Статус:</strong> {book.status || (book.is_taken ? 'Взята' : 'У меня')}</p>
        </div>
      </div>
    </div>
  );
}