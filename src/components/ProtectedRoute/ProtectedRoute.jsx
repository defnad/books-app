import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';

export function ProtectedRoute({ searchQuery, setSearchQuery }) {
  const [cookies] = useCookies(['isAuth', 'userId']);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Приводим к строке или проверяем существование значений
    const rawAuth = cookies.isAuth;
    const rawUserId = cookies.userId;

    const authed = 
      rawAuth === true || 
      rawAuth === 'true' || 
      Boolean(rawUserId);

    setIsAuth(authed);
    setIsAuthChecked(true);
  }, [cookies.isAuth, cookies.userId]);

  if (!isAuthChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#555'
      }}>
        Проверка авторизации...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Outlet />
      </main>
    </div>
  );
}