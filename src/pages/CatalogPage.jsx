import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/mockData';

export function CatalogPage({ searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('my');
  const query = searchQuery.toLowerCase().trim();

  // Фильтрация книг по вкладке и названию/автору
  const filteredBooks = books.filter((book) => {
    if (activeTab === 'given') {
      if (!book.is_taken) {
        return false;
      }
    }
    if (activeTab === 'taken') {
      if (!book.is_borrowed) {
        return false;
      }
    }
    if (query === '') {
      return true;
    }
    const title = book.title ? book.title.toLowerCase() : '';
    const author = book.author ? book.author.toLowerCase() : '';
    if (title.includes(query)) {
      return true;
    }
    if (author.includes(query)) {
      return true;
    }
    return false;
  });

  return (
    <>
      {/* Навигация по вкладкам и кнопка добавления */}
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

        {/* Кнопка с заглушкой из её кода */}
        <Link to="/addbook">
        <button className="add-book-btn">
          + Добавить книгe
        </button>
        </Link>
      </div>

      {/* Сетка карточек книг */}
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
            <Link
              to={`/book/${book.id}`}
              key={book.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="book-card">
                <div className="book-cover-wrapper">
                  <img src={bookCover} alt={book.title} className="book-cover" />
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>

                  <div className="book-footer">
                    {/* Статус книги с остановкой всплытия события */}
                    <span
                      className="status-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        showDevelopmentMessage(e);
                      }}
                      style={{
                        backgroundColor: statusBg,
                        color: statusColor,
                        cursor: 'pointer',
                      }}
                    >
                      {statusText}
                    </span>

                    {/* Кнопка действий с остановкой всплытия */}
                    <button
                      className="more-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        showDevelopmentMessage(e);
                      }}
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {activeTab === 'my' && (
          <Link to ="/addbook">
          <div
            className="book-card add-card-placeholder"
            style={{ cursor: 'pointer' }}
          >
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