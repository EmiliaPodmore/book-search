import React, { useState } from "react";
import "./App.css";

// Gutendex always returns 32 books per page
const PAGE_SIZE = 32;

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topic, setTopic] = useState("");
  const [bookData, setBookData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Runs when the form is submitted (Search button click OR pressing Enter)
  function handleSearch(event) {
    event.preventDefault();
    loadBooks(1);
  }

  // Fetches book data from the Gutendex API
  function loadBooks(page) {
    // encodeURIComponent makes sure characters like & or # don't break the URL
    let apiUrl = `https://gutendex.com/books?search=${encodeURIComponent(
      searchTerm,
    )}&page=${page}`;

    if (topic) {
      apiUrl += `&topic=${encodeURIComponent(topic)}`;
    }

    setLoading(true);
    setError("");

    fetch(apiUrl)
      .then((response) => {
        // fetch doesn't throw on HTTP errors, so check manually
        if (!response.ok) {
          throw new Error(`Request failed (status ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setBookData(data);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
      })
      .catch(() => {
        setError(
          "Sorry, something went wrong loading books. Please try again.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function previousPage() {
    if (currentPage > 1) {
      loadBooks(currentPage - 1);
    }
  }

  function nextPage() {
    loadBooks(currentPage + 1);
  }

  function updateSearch(event) {
    setSearchTerm(event.target.value);
  }

  function updateTopic(event) {
    setTopic(event.target.value);
  }

  const results = bookData && bookData.results ? bookData.results : null;

  return (
    <div className="App">
      <header>
        <h1>Book Search</h1>
      </header>

      <main>
        {/* A form lets the Enter key trigger the search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            autoFocus={true}
            value={searchTerm}
            onChange={updateSearch}
            placeholder="Search by title, author or term..."
          />

          <select className="topic-filter" value={topic} onChange={updateTopic}>
            <option value="">All Topics</option>
            <option value="adventure">Adventure</option>
            <option value="fantasy">Fantasy</option>
            <option value="science fiction">Science Fiction</option>
            <option value="mystery">Mystery</option>
            <option value="romance">Romance</option>
            <option value="horror">Horror</option>
            <option value="history">History</option>
            <option value="philosophy">Philosophy</option>
            <option value="poetry">Poetry</option>
            <option value="drama">Drama</option>
          </select>

          <button className="search-button" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="no-results">
            <p>{error}</p>
          </div>
        )}

        {results && (
          <div>
            {results.length === 0 ? (
              <div className="no-results">
                <p>No results found.</p>
              </div>
            ) : (
              <>
                {/* Show every book on the page (previously only 6 of 32) */}
                {results.map((book) => (
                  <div className="result-card" key={book.id}>
                    {book.formats["image/jpeg"] && (
                      <img
                        className="result-cover"
                        src={book.formats["image/jpeg"]}
                        alt={book.title}
                      />
                    )}

                    <div className="result-details">
                      <h3 className="result-title">{book.title}</h3>

                      {book.authors.length > 0 && (
                        <p className="result-author">
                          {book.authors.map((author) => author.name).join(", ")}
                        </p>
                      )}

                      {book.formats["text/html"] && (
                        <a
                          className="result-link"
                          href={book.formats["text/html"]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read Online
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pagination only appears when there are results */}
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={previousPage}
                    disabled={currentPage === 1 || loading}
                  >
                    ←
                  </button>

                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="pagination-button"
                    onClick={nextPage}
                    disabled={!bookData.next || loading}
                  >
                    →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer>
        This project was coded by{" "}
        <a
          href="https://emiliapodmoredev.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          Emilia Podmore
        </a>
      </footer>
    </div>
  );
}
