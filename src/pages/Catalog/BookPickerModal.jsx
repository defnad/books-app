import React from 'react';

export function BookPickerModal({ books, onSelect, onClose }) {
  return (
    <div className="picker-modal-overlay" onClick={onClose}>
      <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-modal-header">
          <h3>Выберите книгу</h3>
          <button className="picker-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="picker-modal-list">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="picker-modal-item"
                onClick={() => onSelect(book.id)}
              >
                <span className="picker-modal-item-title">{book.title}</span>
                <span className="picker-modal-item-author">{book.author}</span>
              </div>
            ))
          ) : (
            <div className="picker-modal-item disabled">У вас нет книг для выбора</div>
          )}
        </div>
      </div>
    </div>
  );
}