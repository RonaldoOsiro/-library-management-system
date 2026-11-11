import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEYS = ['fieldnotes-reading-list', 'readingList', 'library-reading-list'];

const ReadingListContext = createContext(null);

function readStoredBooks() {
  if (typeof window === 'undefined') return [];

  for (const storageKey of STORAGE_KEYS) {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) continue;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Ignore malformed stored data and continue checking the next key.
    }
  }

  return [];
}

function normalizeBook(book) {
  if (!book) return null;

  const key = book.id ?? book.isbn ?? book.title ?? book.slug;
  if (!key) return null;

  return {
    ...book,
    id: String(key),
  };
}

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const book = normalizeBook(action.payload);
      if (!book) return state;

      const key = String(book.id);
      const alreadyAdded = state.some((item) => String(item.id) === key);
      return alreadyAdded ? state : [...state, book];
    }
    case 'REMOVE_BOOK': {
      const targetId = action.payload ?? action.id;
      if (targetId === undefined || targetId === null || targetId === '') return state;

      return state.filter((item) => String(item.id) !== String(targetId));
    }
    case 'CLEAR_LIST':
      return [];
    case 'MERGE_BOOKS': {
      const incoming = Array.isArray(action.payload) ? action.payload : [];
      const merged = new Map();

      state.forEach((book) => {
        const normalized = normalizeBook(book);
        if (normalized) merged.set(String(normalized.id), normalized);
      });

      incoming.forEach((book) => {
        const normalized = normalizeBook(book);
        if (!normalized) return;
        if (!merged.has(String(normalized.id))) {
          merged.set(String(normalized.id), normalized);
        }
      });

      return Array.from(merged.values());
    }
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [items, dispatch] = useReducer(readingListReducer, [], readStoredBooks);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    STORAGE_KEYS.forEach((storageKey) => window.localStorage.setItem(storageKey, JSON.stringify(items)));
  }, [items]);

  const value = useMemo(() => ({
    items,
    addBook: (book) => dispatch({ type: 'ADD_BOOK', payload: book }),
    removeBook: (bookId) => dispatch({ type: 'REMOVE_BOOK', payload: bookId }),
    clearList: () => dispatch({ type: 'CLEAR_LIST' }),
    mergeBooks: (books) => dispatch({ type: 'MERGE_BOOKS', payload: books }),
  }), [items]);

  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>;
}

export function useReadingList() {
  const context = useContext(ReadingListContext);

  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }

  return context;
}

export default ReadingListContext;
