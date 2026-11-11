import { useState } from 'react';

export default function BookCover({ book, className = '' }) {
  const [failed, setFailed] = useState(false);
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-L.jpg?default=false`
    : '';

  return (
    <div className={`book-cover cover-tone-${(book.id % 5) + 1} ${className}`}>
      {coverUrl && !failed ? (
        <img src={coverUrl} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="cover-placeholder" aria-label={`No cover available for ${book.title}`}>
          <span className="placeholder-mark" aria-hidden="true">f.</span>
          <span className="placeholder-title">{book.title}</span>
          <span className="placeholder-author">{book.author}</span>
        </div>
      )}
    </div>
  );
}