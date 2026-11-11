import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import BookGrid from '../components/BookGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { fetchApi } from '../lib/api.js';

export default function HomePage() {
  const [genreId, setGenreId] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [genres, setGenres] = useState([]);
  const [genreError, setGenreError] = useState('');
  const handleSearch = useCallback((value) => setSearch(value), []);

  useEffect(() => {
    const controller = new AbortController();
    fetchApi('/genres', { signal: controller.signal })
      .then((result) => setGenres(Array.isArray(result) ? result : []))
      .catch((error) => {
        if (error.name !== 'AbortError') setGenreError('Genre filters are unavailable right now.');
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="catalog-page">
      <section className="catalog-intro">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> The reading room</p>
          <h1>Find your next<br /><em>good read.</em></h1>
          <p className="intro-description">A small collection for wide-open afternoons, thoughtful minds, and one-more-chapter nights.</p>
        </div>
        <div className="intro-aside" aria-hidden="true">
          <span className="aside-number">01 <i>/ 04</i></span>
          <span className="aside-rule" />
          <span className="aside-label">Browse the collection</span>
        </div>
        <div className="intro-stamp" aria-hidden="true"><span>READ<br />SLOWLY</span><span className="stamp-star">✳</span></div>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">A considered collection</p>
            <h2 id="collection-title">The shelves <span>are open.</span></h2>
          </div>
          <p className="collection-note">Pick a direction, or let a book find you.</p>
        </div>

        <div className="catalog-controls">
          <SearchBar onSearch={handleSearch} />
          <div className="control-group">
            <label className="select-control">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <span className="visually-hidden">Filter by genre</span>
              <select value={genreId} onChange={(event) => setGenreId(event.target.value)}>
                <option value="">All genres</option>
                {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
            <label className="select-control sort-control">
              <span className="sort-label">Sort</span>
              <span className="visually-hidden">Sort books by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="title">Title</option>
                <option value="author">Author</option>
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
          </div>
        </div>
        {genreError && <p className="inline-notice" role="status">{genreError}</p>}
        <BookGrid genreId={genreId} search={search} sortBy={sortBy} />
      </section>
    </main>
  );
}