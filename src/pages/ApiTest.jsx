import React, { useState } from 'react';

const ApiTest = () => {
  // Создаем стейты
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ваша функция с бэкендом
  const retext = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://sol-api.sherstde.ru/");
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ВОТ КУДА ВСТАВЛЯЕТСЯ ВАШ КОД:
  return (
    <div style={{ padding: '20px' }}>
      <h2>Тест подключения к бэкенду</h2>
      
      {/* Если идет загрузка */}
      {loading && <p>Загрузка...</p>}
      
      {/* Если произошла ошибка */}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      {/* Кнопка, по которой происходит запрос */}
      <button onClick={retext} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Подключиться к бэкенду
      </button>

      {/* Вывод данных, если они есть */}
      {data && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;