import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await fetchApi('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const token = result.accessToken || result.token || result.jwt || result.access_token;
      if (!token) {
        throw new Error('The registration response did not include a JWT.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('library_jwt', token);

      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('library_user', JSON.stringify(result.user));
      }

      navigate('/');
    } catch (requestError) {
      setError(requestError.message || 'Unable to create an account right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow"><span className="eyebrow-line" /> New here</p>
        <h1>Create your account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </label>

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
              placeholder="Create a password"
              minLength={8}
              required
            />
          </label>

          {error && <p className="inline-notice" role="alert">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
