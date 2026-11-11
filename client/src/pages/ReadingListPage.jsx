import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { useReadingList } from '../context/ReadingListContext.jsx';
import { fetchApi } from '../lib/api.js';

export default function ReadingListPage() {
  const { items, clearList, removeBook } = useReadingList();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitBorrowRequest = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('library_jwt');
    if (!token) {
      window.location.assign('/login');
      return;
    }

    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await fetchApi('/borrow-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookIds: items.map((book) => Number(book.id)) }),
      });
      clearList();
      setStatus('Your borrow request has been submitted.');
    } catch (requestError) {
      setError(requestError.message || 'The borrow request could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="collection reading-list-page">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">Saved for later</p>
          <h1 className="page-title">Your reading list</h1>
        </div>
        {items.length > 0 && (
          <button type="button" className="text-button" onClick={clearList}>Clear list</button>
        )}
      </div>

      {error && <p className="inline-notice" role="alert">{error}</p>}
      {status && <p className="inline-notice" role="status">{status}</p>}

      {items.length === 0 ? (
        <div className="state-panel state-empty" role="status">
          <span className="state-kicker">Nothing saved yet</span>
          <h2>Start with a book that calls to you.</h2>
          <p>Save titles from the catalog and they will be collected here.</p>
          <Link className="primary-button reading-browse-button" to="/">Browse the collection</Link>
        </div>
      ) : (
        <>
          <div className="book-grid">
            {items.map((book) => (
              <article className="reading-list-item" key={book.id}>
                <Link to={`/books/${book.id}`} aria-label={`View ${book.title}`}>
                  <BookCover book={book} />
                  <h2>{book.title}</h2>
                  <p>{book.author}</p>
                </Link>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => removeBook(book.id)}
                  aria-label={`Remove ${book.title} from reading list`}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <button type="button" className="primary-button borrow-submit" onClick={submitBorrowRequest} disabled={submitting}>
            {submitting ? 'Submitting request...' : `Request to borrow ${items.length} ${items.length === 1 ? 'book' : 'books'}`}
          </button>
        </>
      )}
    </main>
  );
}
