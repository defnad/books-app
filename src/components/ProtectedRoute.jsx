import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAuth }) {
  // Если пользователь не авторизован — отправляем на /login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован — рендерим дочерние страницы (через Outlet)
  return <Outlet />;
}