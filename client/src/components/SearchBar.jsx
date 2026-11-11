import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => onSearch(value.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <label className="search-field">
      <Search size={19} aria-hidden="true" />
      <span className="visually-hidden">Search by title or author</span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search by title or author"
        autoComplete="off"
      />
      {value && (
        <button className="icon-button search-clear" type="button" aria-label="Clear search" onClick={() => setValue('')}>
          <X size={17} />
        </button>
      )}
    </label>
  );
}