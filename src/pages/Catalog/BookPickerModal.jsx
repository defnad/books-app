import React, { useState } from 'react';

export function BookPickerModal({ books = [], mode = 'given', onSelect, onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [personName, setPersonName] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Заглушка для даты (сегодняшнее число)
  const todayStr = new Date().toISOString().split('T')[0];

  const isGiven = mode === 'given'; // true - отдаем свою книгу, false - берем чужую

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook || !personName.trim() || !returnDate) return;

    // Формируем payload в зависимости от того, отдаем или берем
    const extraData = isGiven
      ? { borrowedTo: personName.trim(), returnDate, is_taken: true }
      : { borrowedFrom: personName.trim(), returnDate, is_borrowed: true };

    onSelect(selectedBook.id, extraData);
    onClose();
  };

  return (
    <div className="picker-modal-overlay" onClick={onClose}>
      <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-modal-header">
          <h3>
            {selectedBook 
              ? (isGiven ? 'Передача книги' : 'Взять книгу') 
              : (isGiven ? 'Выберите книгу для отдачи' : 'Выберите взятую книгу')}
          </h3>
          <button type="button" className="picker-modal-close" onClick={onClose}>×</button>
        </div>

        {!selectedBook ? (
          /* Шаг 1: Выбор книги */
          <div className="picker-modal-list">
            {books.length > 0 ? (
              books.map((book) => (
                <div
                  key={book.id}
                  className="picker-modal-item"
                  onClick={() => setSelectedBook(book)}
                >
                  <span className="picker-modal-item-title">{book.title}</span>
                  <span className="picker-modal-item-author">{book.author}</span>
                </div>
              ))
            ) : (
              <div className="picker-modal-item disabled">У вас нет доступных книг</div>
            )}
          </div>
        ) : (
          /* Шаг 2: Поля в зависимости от вкладки */
          <form onSubmit={handleSubmit} className="picker-modal-form" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              Выбрана книга: <strong>{selectedBook.title}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>
                {isGiven ? 'Кому отдаете книгу?' : 'У кого взяли книгу?'}
              </label>
              <input
                type="text"
                placeholder={isGiven ? 'Имя друга' : 'Имя владельца'}
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                required
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>До какого числа?</label>
              <input
                type="date"
                min={todayStr}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedBook(null)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
              >
                Назад
              </button>
              <button 
                type="submit"
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
              >
                Сохранить
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}