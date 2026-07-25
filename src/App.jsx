import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { BookPage } from './pages/BookPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/book/:id" element={<BookPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;