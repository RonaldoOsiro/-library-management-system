import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ReadingListProvider } from './context/ReadingListContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SpaceBookingPage from './pages/SpaceBookingPage.jsx';
import BookDetail from './pages/BookDetail.jsx';
import HomePage from './pages/HomePage.jsx';

export default function App() {
  return (
    <ReadingListProvider>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/space-booking"
            element={(
              <ProtectedRoute>
                <SpaceBookingPage />
              </ProtectedRoute>
            )}
          />
        </Routes>

        <footer className="site-footer">
          <span>Fieldnotes Library</span>
          <span>Stories worth keeping close.</span>
        </footer>
      </div>
    </ReadingListProvider>
  );
}