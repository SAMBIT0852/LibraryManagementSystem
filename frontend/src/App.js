import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:8080/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: ''
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('libraryFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'libraryFavorites',
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setBooks(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setBooks([]);
      setError(
        'Backend server is not available. Please start Spring Boot on port 8080.'
      );
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();

    if (!newBook.title.trim() || !newBook.author.trim()) {
      showToast('Please enter title and author.', 'error');
      return;
    }

    try {
      await axios.post(API_URL, newBook);

      setNewBook({
        title: '',
        author: ''
      });

      await fetchBooks();

      showToast('Book added successfully! 📚');
    } catch (err) {
      console.error(err);
      showToast('Failed to add book.', 'error');
    }
  };

  const borrowBook = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/borrow`);

      await fetchBooks();

      setSelectedBook(null);

      showToast('Book borrowed successfully! 📖');
    } catch (err) {
      console.error(err);
      showToast('Failed to borrow book.', 'error');
    }
  };

  const returnBook = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/return`);

      await fetchBooks();

      setSelectedBook(null);

      showToast('Book returned successfully! ↩️');
    } catch (err) {
      console.error(err);
      showToast('Failed to return book.', 'error');
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(
        favorites.filter((favoriteId) => favoriteId !== id)
      );

      showToast('Removed from favorites');
    } else {
      setFavorites([...favorites, id]);

      showToast('Added to favorites ❤️');
    }
  };

  const availableBooks = books.filter(
    (book) => book.available
  ).length;

  const borrowedBooks = books.filter(
    (book) => !book.available
  ).length;

  const favoriteBooks = books.filter(
    (book) => favorites.includes(book.id)
  ).length;

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query)
      );
    }

    if (filter === 'available') {
      result = result.filter((book) => book.available);
    }

    if (filter === 'borrowed') {
      result = result.filter((book) => !book.available);
    }

    if (filter === 'favorites') {
      result = result.filter((book) =>
        favorites.includes(book.id)
      );
    }

    if (sortBy === 'title') {
      result.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );
    }

    if (sortBy === 'author') {
      result.sort((a, b) =>
        (a.author || '').localeCompare(b.author || '')
      );
    }

    if (sortBy === 'status') {
      result.sort(
        (a, b) => Number(b.available) - Number(a.available)
      );
    }

    return result;
  }, [books, search, filter, sortBy, favorites]);

  return (
    <div className={`app ${darkMode ? 'dark-app' : ''}`}>

      {/* Decorative background */}

      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="orb orb-three"></div>

      <div className="floating-decoration decoration-one">
        📚
      </div>

      <div className="floating-decoration decoration-two">
        ✨
      </div>

      <div className="floating-decoration decoration-three">
        📖
      </div>

      {/* Header */}

      <header className="header">

        <div className="brand">

          <div className="logo">
            📚
          </div>

          <div>
            <h1>Digital Library</h1>
            <p>Discover your next great read</p>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button
            className="mode-button"
            onClick={() => setIsAdmin(!isAdmin)}
          >
            {isAdmin ? '👤 User Mode' : '⚙️ Admin Mode'}
          </button>

        </div>

      </header>

      <main className="container">

        {/* Hero */}

        <section className="hero">

          <div className="hero-content">

            <span className="hero-badge">
              ✨ SMART DIGITAL LIBRARY
            </span>

            <h2>
              Discover.
              <span> Read.</span>
              <br />
              Return. Repeat.
            </h2>

            <p>
              Explore your collection, borrow books,
              manage your favorites and keep your
              reading journey organized.
            </p>

            <div className="hero-actions">

              <button
                className="hero-button"
                onClick={() =>
                  document
                    .getElementById('library')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })
                }
              >
                Explore Books →
              </button>

            </div>

          </div>

          <div className="hero-visual">

            <div className="book-stack">

              <div className="hero-book book-red">
                📕
              </div>

              <div className="hero-book book-green">
                📗
              </div>

              <div className="hero-book book-blue">
                📘
              </div>

            </div>

            <div className="sparkle sparkle-one">
              ✦
            </div>

            <div className="sparkle sparkle-two">
              ✧
            </div>

          </div>

        </section>

        {/* Statistics */}

        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon">
              📚
            </div>

            <div>
              <span>Total Collection</span>
              <h3>{books.length}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              🟢
            </div>

            <div>
              <span>Available Now</span>
              <h3>{availableBooks}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon red">
              🔴
            </div>

            <div>
              <span>Currently Borrowed</span>
              <h3>{borrowedBooks}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pink">
              ❤️
            </div>

            <div>
              <span>My Favorites</span>
              <h3>{favoriteBooks}</h3>
            </div>

          </div>

        </section>

        {/* Error */}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Admin */}

        {isAdmin && (

          <section className="admin-panel">

            <div className="section-title">

              <div>
                <span>ADMINISTRATION</span>
                <h2>Add New Book</h2>
              </div>

              <div className="admin-badge">
                🔐 ADMIN
              </div>

            </div>

            <form
              className="add-book-form"
              onSubmit={addBook}
            >

              <div className="input-group">

                <label>Book Title</label>

                <input
                  type="text"
                  placeholder="Enter book title"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      title: e.target.value
                    })
                  }
                />

              </div>

              <div className="input-group">

                <label>Author</label>

                <input
                  type="text"
                  placeholder="Enter author name"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      author: e.target.value
                    })
                  }
                />

              </div>

              <button
                type="submit"
                className="add-button"
              >
                + Add Book
              </button>

            </form>

          </section>

        )}

        {/* Library */}

        <section
          className="library-section"
          id="library"
        >

          <div className="section-title">

            <div>
              <span>LIBRARY COLLECTION</span>
              <h2>Explore Books</h2>
            </div>

            <span className="book-count">
              {filteredBooks.length} books
            </span>

          </div>

          {/* Search */}

          <div className="search-container">

            <div className="search-box">

              <span>🔎</span>

              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                >
                  ✕
                </button>
              )}

            </div>

          </div>

          {/* Filters */}

          <div className="filters">

            <div className="filter-buttons">

              <button
                className={
                  filter === 'all'
                    ? 'filter active'
                    : 'filter'
                }
                onClick={() => setFilter('all')}
              >
                All Books
              </button>

              <button
                className={
                  filter === 'available'
                    ? 'filter active'
                    : 'filter'
                }
                onClick={() => setFilter('available')}
              >
                🟢 Available
              </button>

              <button
                className={
                  filter === 'borrowed'
                    ? 'filter active'
                    : 'filter'
                }
                onClick={() => setFilter('borrowed')}
              >
                🔴 Borrowed
              </button>

              <button
                className={
                  filter === 'favorites'
                    ? 'filter active'
                    : 'filter'
                }
                onClick={() => setFilter('favorites')}
              >
                ❤️ Favorites
              </button>

            </div>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="title">
                Sort: Title
              </option>

              <option value="author">
                Sort: Author
              </option>

              <option value="status">
                Sort: Availability
              </option>
            </select>

          </div>

          {/* Books */}

          {loading ? (

            <div className="empty-state">
              <div className="loading-icon">
                📚
              </div>

              <h3>Loading your library...</h3>

              <p>
                Connecting to the library server.
              </p>
            </div>

          ) : filteredBooks.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🔍
              </div>

              <h3>
                No books found
              </h3>

              <p>
                Try changing your search or filter.
              </p>

              <button
                className="clear-button"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="books-grid">

              {filteredBooks.map((book) => {

                const isFavorite =
                  favorites.includes(book.id);

                return (

                  <article
                    className="book-card"
                    key={book.id}
                  >

                    <div className="book-cover">

                      <button
                        className={`favorite-button ${
                          isFavorite
                            ? 'favorite-active'
                            : ''
                        }`}
                        onClick={() =>
                          toggleFavorite(book.id)
                        }
                      >
                        {isFavorite ? '❤️' : '♡'}
                      </button>

                      <div className="cover-decoration">
                        ✦
                      </div>

                      <span className="book-emoji">
                        📖
                      </span>

                      <div className="cover-lines"></div>

                    </div>

                    <div className="book-info">

                      <div className="status-row">

                        {book.available ? (

                          <span className="status available-status">
                            ● Available
                          </span>

                        ) : (

                          <span className="status borrowed-status">
                            ● Borrowed
                          </span>

                        )}

                      </div>

                      <h3>
                        {book.title}
                      </h3>

                      <p className="author">
                        By {book.author}
                      </p>

                      <button
                        className="details-button"
                        onClick={() =>
                          setSelectedBook(book)
                        }
                      >
                        View Details →
                      </button>

                      {!isAdmin && (
                        <div className="card-action">

                          {book.available ? (

                            <button
                              className="borrow-button"
                              onClick={() =>
                                borrowBook(book.id)
                              }
                            >
                              📚 Borrow Book
                            </button>

                          ) : (

                            <button
                              className="return-button"
                              onClick={() =>
                                returnBook(book.id)
                              }
                            >
                              ↩️ Return Book
                            </button>

                          )}

                        </div>
                      )}

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

      </main>

      {/* Book Modal */}

      {selectedBook && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedBook(null)
          }
        >

          <div
            className="book-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedBook(null)
              }
            >
              ✕
            </button>

            <div className="modal-cover">
              📖
            </div>

            <div className="modal-content">

              <span
                className={
                  selectedBook.available
                    ? 'modal-status available-status'
                    : 'modal-status borrowed-status'
                }
              >
                {selectedBook.available
                  ? '● Available'
                  : '● Currently Borrowed'}
              </span>

              <h2>
                {selectedBook.title}
              </h2>

              <p className="modal-author">
                By {selectedBook.author}
              </p>

              <div className="modal-info">

                <div>
                  <span>Book ID</span>
                  <strong>
                    #{selectedBook.id}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {selectedBook.available
                      ? 'Available'
                      : 'Borrowed'}
                  </strong>
                </div>

              </div>

              <div className="modal-actions">

                <button
                  className="favorite-modal-button"
                  onClick={() =>
                    toggleFavorite(selectedBook.id)
                  }
                >
                  {favorites.includes(
                    selectedBook.id
                  )
                    ? '❤️ Remove Favorite'
                    : '♡ Add Favorite'}
                </button>

                {!isAdmin &&
                  selectedBook.available && (

                    <button
                      className="borrow-button"
                      onClick={() =>
                        borrowBook(selectedBook.id)
                      }
                    >
                      📚 Borrow Book
                    </button>

                  )}

                {!isAdmin &&
                  !selectedBook.available && (

                    <button
                      className="return-button"
                      onClick={() =>
                        returnBook(selectedBook.id)
                      }
                    >
                      ↩️ Return Book
                    </button>

                  )}

              </div>

            </div>

          </div>

        </div>

      )}

      {/* Toast */}

      {toast && (

        <div
          className={`toast ${
            toast.type === 'error'
              ? 'toast-error'
              : ''
          }`}
        >
          {toast.message}
        </div>

      )}

      <footer>
        <p>
          📚 Digital Library
          <span> • </span>
          React + Spring Boot
        </p>
      </footer>

    </div>
  );
}

export default App;