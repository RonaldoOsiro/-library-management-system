import { ArrowUpRight, LibraryBig } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
import BookDetail from './pages/BookDetail.jsx';
import HomePage from './pages/HomePage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Fieldnotes Library home">
          <span className="wordmark-icon"><LibraryBig size={19} strokeWidth={1.8} /></span>
          <span>fieldnotes<span className="wordmark-light"> / library</span></span>
        </Link>
        <a className="header-link" href="https://github.com" target="_blank" rel="noreferrer">
          A place for curious minds <ArrowUpRight size={15} />
        </a>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Routes>
      <footer className="site-footer">
        <span>Fieldnotes Library</span>
        <span>Stories worth keeping close.</span>
      </footer>
    </div>
  );
}