import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api.js';

function authHeaders(json = false) {
  const token = localStorage.getItem('token') || localStorage.getItem('library_jwt');
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    totalCopies: '1',
    genreId: '',
    publishedYear: '',
  });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadData = useCallback(async () => {
    const [bookResult, genreResult] = await Promise.all([
      fetchApi('/books?limit=100'),
      fetchApi('/genres'),
    ]);
    setBooks(Array.isArray(bookResult) ? bookResult : bookResult.data || []);
    setGenres(Array.isArray(genreResult) ? genreResult : []);
    setForm((current) => ({
      ...current,
      genreId: current.genreId || String(genreResult[0]?.id || ''),
    }));
  }, []);

  useEffect(() => {
    loadData().catch((requestError) => setError(requestError.message || 'Admin data could not be loaded.'));
  }, [loadData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createBook = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    const data = {
      ...form,
      totalCopies: Number(form.totalCopies),
      genreId: Number(form.genreId),
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
    };
    try {
      await fetchApi('/books', {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(data),
      });
      setForm((current) => ({
        ...current,
        title: '',
        author: '',
        isbn: '',
        totalCopies: '1',
        publishedYear: '',
      }));
      setStatus('Book added to the catalog.');
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'The book could not be created.');
    }
  };

  const deleteBook = async (book) => {
    setError('');
    setStatus('');
    try {
      await fetchApi(`/books/${book.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      setStatus(`${book.title} was removed from the catalog.`);
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'The book could not be deleted.');
    }
  };

  return (
    <main className="admin-page">
      <p className="eyebrow"><span className="eyebrow-line" /> Librarian tools</p>
      <h1 className="page-title">Manage books</h1>
      {error && <p className="inline-notice" role="alert">{error}</p>}
      {status && <p className="inline-notice" role="status">{status}</p>}

      <form className="admin-form" onSubmit={createBook}>
        <h2>Add a book</h2>
        <div className="admin-form-grid">
          <label className="field-group">Title<input name="title" value={form.title} onChange={handleChange} required /></label>
          <label className="field-group">Author<input name="author" value={form.author} onChange={handleChange} required /></label>
          <label className="field-group">ISBN<input name="isbn" value={form.isbn} onChange={handleChange} required /></label>
          <label className="field-group">Copies<input type="number" min="0" name="totalCopies" value={form.totalCopies} onChange={handleChange} required /></label>
          <label className="field-group">
            Genre
            <select name="genreId" value={form.genreId} onChange={handleChange} required>
              <option value="" disabled>Select genre</option>
              {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
            </select>
          </label>
          <label className="field-group">Published year<input type="number" min="0" name="publishedYear" value={form.publishedYear} onChange={handleChange} /></label>
        </div>
        <button className="primary-button" type="submit" disabled={!genres.length}>Add book</button>
      </form>

      <section className="admin-section" aria-labelledby="admin-books-title">
        <h2 id="admin-books-title">Catalog ({books.length})</h2>
        {books.length === 0 ? <p>No books found.</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Copies</th><th>Action</th></tr></thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td><td>{book.author}</td><td>{book.genre?.name || '—'}</td><td>{book.totalCopies}</td>
                    <td><button className="text-button" type="button" onClick={() => deleteBook(book)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
