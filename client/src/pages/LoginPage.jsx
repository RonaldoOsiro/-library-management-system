import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';
import { fetchApi } from '../lib/api.js';

function readGuestBooks() {
  const keys = ['fieldnotes-reading-list', 'readingList', 'library-reading-list'];

  for (const key of keys) {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Ignore malformed persisted data.
    }
  }

  return [];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mergeBooks } = useReadingList();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await fetchApi('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const token = result.accessToken || result.token || result.jwt || result.access_token;
      if (!token) {
        throw new Error('The login response did not include a JWT.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('library_jwt', token);

      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('library_user', JSON.stringify(result.user));
      }

      const guestBooks = readGuestBooks();
      if (guestBooks.length > 0) {
        mergeBooks(guestBooks);
        ['fieldnotes-reading-list', 'readingList', 'library-reading-list'].forEach((key) =>
          localStorage.removeItem(key),
        );
      }

      navigate('/');
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow"><span className="eyebrow-line" /> Welcome back</p>
        <h1>Sign in to your account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </label>

          <label className="field-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p className="inline-notice" role="alert">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Need an account?
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}
