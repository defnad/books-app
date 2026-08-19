import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Импорты страниц
import { LoginPage } from './pages/LoginPage/LoginPage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { BookPage } from './pages/BookPage/BookPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';

// Компоненты навигации
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Путь к логину (обычно без Sidebar и Header) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Главные страницы приложения */}
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Header />
                <Routes>
                  <Route path="/" element={<CatalogPage />} />
                  <Route path="/book/:id" element={<BookPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}