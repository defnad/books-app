import React from 'react';
import { Link } from 'react-router';
import { books } from '../data/mockData';

export function CatalogPage({ searchQuery = '' }) {
  // Фильтруем список книг по переданному тексту поиска
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = book.title ? book.title.toLowerCase().includes(query) : false;
    const authorMatch = book.author ? book.author.toLowerCase().includes(query) : false;

    return titleMatch || authorMatch;
  });

  return (
    <>
      <div className="subheader">
        <div className="tabs">
          <button className="tab-btn active">Мои книги</button>
          <button className="tab-btn">Отдал</button>
          <button className="tab-btn">Взял</button>
        </div>
        <button className="add-book-btn">+ Добавить книгу</button>
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <Link to={`/book/${book.id}`} key={book.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="book-card">
              <div className="book-cover-wrapper">
                <img src={book.cover || book.image} alt={book.title} className="book-cover" />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-footer">
                  <span className="status-badge" style={{ backgroundColor: book.is_taken ? '#fce8e6' : '', color: book.is_taken ? '#c5221f' : '' }}>
                    {book.status || (book.is_taken ? "Взята" : "У меня")}
                  </span>
                  <button className="more-btn">⋮</button>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="book-card add-card-placeholder">
          <div className="add-placeholder-content">
            <span className="plus-icon">+</span>
            <p>Добавить книгу</p>
          </div>
        </div>
      </div>
    </>
  );
}