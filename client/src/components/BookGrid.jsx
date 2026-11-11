import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api.js';
import BookCard from './BookCard.jsx';

function BookSkeleton() {
  return (
    <div className="book-skeleton" aria-hidden="true">
      <div className="skeleton-cover" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-author" />
      <div className="skeleton-line skeleton-tag" />
    </div>
  );
}

export default function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: '100' });
    if (genreId) params.set('genreId', genreId);
    if (search) params.set('search', search);

    setLoading(true);
    setError('');
    fetchApi(`/books?${params}`, { signal: controller.signal })
      .then((result) => setBooks(Array.isArray(result) ? result : result.data || []))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'The catalog could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [genreId, search]);

  const sortedBooks = [...books].sort((first, second) =>
    first[sortBy].localeCompare(second[sortBy], undefined, { sensitivity: 'base' }),
  );

  if (loading) {
    return (
      <div className="book-grid" aria-label="Loading books" aria-busy="true">
        {Array.from({ length: 8 }, (_, index) => <BookSkeleton key={index} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-error" role="alert">
        <span className="state-kicker">A little pause</span>
        <h2>We couldn&apos;t reach the shelves.</h2>
        <p>{error}</p>
        <button className="text-button" type="button" onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  if (sortedBooks.length === 0) {
    return (
      <div className="state-panel state-empty" role="status">
        <span className="state-kicker">No matches yet</span>
        <h2>Nothing on this shelf.</h2>
        <p>Try another title, author, or genre to keep browsing.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {sortedBooks.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  );
}