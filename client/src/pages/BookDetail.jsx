import { ArrowLeft, BookOpen, CalendarDays, Copy, Hash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookCover from '../components/BookCover.jsx';
import { useReadingList } from '../context/ReadingListContext.jsx';
import { fetchApi } from '../lib/api.js';

export default function BookDetail() {
  const { id } = useParams();
  const { items, addBook, removeBook } = useReadingList();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isSaved = items.some((item) => String(item.id) === String(id));

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetchApi(`/books/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(setBook)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'This book could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return (
    <main className="detail-page">
      <Link to="/" className="back-link"><ArrowLeft size={17} /> Back to the shelves</Link>
      {loading ? (
        <div className="detail-loading" aria-busy="true"><div className="detail-cover-skeleton" /><div className="detail-copy-skeleton" /></div>
      ) : error ? (
        <div className="state-panel state-error" role="alert">
          <span className="state-kicker">Unavailable</span>
          <h1>We couldn&apos;t find that book.</h1>
          <p>{error}</p>
        </div>
      ) : book ? (
        <article className="book-detail">
          <div className="detail-cover-wrap"><BookCover book={book} className="detail-cover" /></div>
          <div className="detail-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> {book.genre?.name || 'From the collection'}</p>
            <h1>{book.title}</h1>
            <p className="detail-author">by {book.author}</p>
            <div className="detail-rule" />
            <p className="detail-deck">A title in the Fieldnotes Library collection, ready to be discovered and enjoyed.</p>
            <dl className="book-facts">
              {book.publishedYear && <div><dt><CalendarDays size={16} /> Published</dt><dd>{book.publishedYear}</dd></div>}
              <div><dt><Hash size={16} /> ISBN</dt><dd>{book.isbn}</dd></div>
              <div><dt><BookOpen size={16} /> Collection</dt><dd>{book.totalCopies} {book.totalCopies === 1 ? 'copy' : 'copies'}</dd></div>
              <div><dt><Copy size={16} /> Genre</dt><dd>{book.genre?.name || 'Uncategorized'}</dd></div>
            </dl>
            <button
              type="button"
              className="primary-button detail-save-button"
              onClick={() => (isSaved ? removeBook(id) : addBook(book))}
            >
              {isSaved ? 'Remove from reading list' : 'Add to reading list'}
            </button>
            <Link to="/" className="detail-browse-link">Explore more books <ArrowLeft size={16} /></Link>
          </div>
        </article>
      ) : null}
    </main>
  );
}