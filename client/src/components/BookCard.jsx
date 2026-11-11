import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover.jsx';

export default function BookCard({ book }) {
  return (
    <Link className="book-card" to={`/books/${book.id}`} aria-label={`View ${book.title} by ${book.author}`}>
      <BookCover book={book} />
      <div className="book-card-info">
        <div className="book-card-copy">
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
        <ArrowUpRight className="card-arrow" size={17} aria-hidden="true" />
      </div>
      <div className="book-card-meta">
        <span>{book.genre?.name || 'Uncategorized'}</span>
        {book.publishedYear && <span>{book.publishedYear}</span>}
      </div>
    </Link>
  );
}