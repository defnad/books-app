import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { books } from '../data/mockData';

export function BookPage() {
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));

  if (!book) return <h2>Книга не найдена!</h2>;

  return (
    <div className="main-content" style={{ textAlign: 'center' }}>
      <Link to="/" className="menu-link" style={{ display: 'block', textAlign: 'left' }}>← Назад в библиотеку</Link>
      
      
      <div style={{ marginTop: '20px' }}>
        <img 
          src={book.image} 
          alt={book.title} 
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'block',
            margin: '0 auto'
          }} 
        />
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ margin: '8px 0' }}>{book.title}</h3>
          <h3 style={{ margin: '8px 0', fontWeight: 'normal' }}>Автор: {book.author}</h3>
          <h3 style={{ margin: '8px 0', fontWeight: 'normal', color: '#555' }}>Год выпуска: {book.release_year}</h3>
        </div>
      </div>
    </div>
  );
}
