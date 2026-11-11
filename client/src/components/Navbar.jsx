import { BookOpenText, ListOrdered, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

export default function Navbar() {
  const { items } = useReadingList();
  const token = localStorage.getItem('token') || localStorage.getItem('library_jwt');
  let user;
  try {
    user = JSON.parse(localStorage.getItem('library_user') || localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('library_jwt');
    localStorage.removeItem('library_user');
    localStorage.removeItem('user');
    window.location.assign('/');
  };

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Fieldnotes Library home">
        <span className="wordmark-icon"><BookOpenText size={17} strokeWidth={1.8} /></span>
        <span>fieldnotes<span className="wordmark-light"> / library</span></span>
      </Link>

      <nav className="header-nav" aria-label="Main navigation">
        <NavLink className="header-link" to="/">Browse</NavLink>
        <NavLink className="header-link" to="/space-booking">Bookings</NavLink>

        <Link className="header-reading-list" to="/reading-list" aria-label="Reading list with count">
          <ListOrdered size={15} />
          <span>Reading list</span>
          <span className="reading-count">{items.length}</span>
        </Link>

        {user?.role === 'LIBRARIAN' && (
          <>
            <Link className="header-action" to="/admin/books">Admin books</Link>
            <Link className="header-action" to="/admin/borrow-requests">Borrow requests</Link>
            <Link className="header-action" to="/admin/bookings">Bookings admin</Link>
          </>
        )}

        {token ? (
          <button type="button" className="header-action" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <Link className="header-action" to="/login">
              <LogIn size={15} />
              <span>Login</span>
            </Link>
            <Link className="header-action" to="/register">
              <UserPlus size={15} />
              <span>Register</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
