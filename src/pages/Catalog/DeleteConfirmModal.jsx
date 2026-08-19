import React from 'react';

export function DeleteConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="delete-confirm-overlay" onClick={onClose}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-confirm-header">
          <h3>Подтверждение</h3>
          <button className="delete-confirm-close" onClick={onClose}>×</button>
        </div>
        <div className="delete-confirm-body">
          <p className="delete-confirm-message">Вы точно хотите удалить книгу?</p>
          <div className="delete-confirm-actions">
            <button className="delete-confirm-btn cancel" onClick={onClose}>
              Нет
            </button>
            <button className="delete-confirm-btn confirm" onClick={onConfirm}>
              Да
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}