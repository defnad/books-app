import React, { useState } from 'react';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const retext = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/`);
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Тест подключения к бэкенду</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      <button onClick={retext} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Подключиться к бэкенду
      </button>
      {data && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;