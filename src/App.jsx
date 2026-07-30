import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import  { BookPage}  from './pages/BookPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AddBookPage } from "./pages/AddBookPage";

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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/addbook" element={<AddBookPage/>} />
        </Routes>
        
      </main>
    </div>
  );
}

export default App;