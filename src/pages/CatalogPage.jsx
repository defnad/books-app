import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function CatalogPage({ books, onDeleteBook, searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('my');
  const query = searchQuery.toLowerCase().trim();

  console.log('CatalogPage получил books:', books);

  const filteredBooks = books.filter((book) => {
    if (activeTab === 'given') {
      if (!book.is_taken) return false;
    }
    if (activeTab === 'taken') {
      if (!book.is_borrowed) return false;
    }
    if (query === '') return true;
    const title = book.title ? book.title.toLowerCase() : '';
    const author = book.author ? book.author.toLowerCase() : '';
    return title.includes(query) || author.includes(query);
  });

  return (
    <>
      <div className="subheader">
        <div className="tabs">
          {['my', 'given', 'taken'].map((tab) => {
            const tabLabels = { my: 'Мои книги', given: 'Отдано', taken: 'Взято' };
            return (
              <button
                key={tab}
                className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            );
          })}
        </div>
        <Link to="/addbook">
          <button className="add-book-btn">+ Добавить книгу</button>
        </Link>
      </div>

      <div className="books-grid">
        {filteredBooks.map((book) => {
          const bookCover = book.cover ? book.cover : book.image;
          let statusText = 'У меня';
          let statusBg = '#e6f4ea';
          let statusColor = '#137333';

          if (book.is_taken) {
            statusText = 'Отдана';
            statusBg = '#fce8e6';
            statusColor = '#c5221f';
          } else if (book.is_borrowed) {
            statusText = 'Взята';
            statusBg = '#e0f2fe';
            statusColor = '#0369a1';
          }

          return (
            <div key={book.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="book-card">
                  <div className="book-cover-wrapper">
                    <img src={bookCover} alt={book.title} className="book-cover" />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <div className="book-footer">
                      <span className="status-badge" style={{ backgroundColor: statusBg, color: statusColor }}>
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <button
                className="more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Нажата кнопка удаления для книги с id:', book.id);
                  if (onDeleteBook) {
                    onDeleteBook(book.id);
                  } else {
                    console.error('onDeleteBook не передан!');
                  }
                }}
                style={{ position: 'relative', top: '-40px', left: 'calc(100% - 40px)', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ⋮
              </button>
            </div>
          );
        })}

        {activeTab === 'my' && (
          <Link to="/addbook">
            <div className="book-card add-card-placeholder" style={{ cursor: 'pointer' }}>
              <div className="add-placeholder-content">
                <span className="plus-icon">+</span>
                <p>Добавить книгу</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}