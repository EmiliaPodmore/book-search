import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState(""); // User input for search
  const [topic, setTopic] = useState(""); // Topic filter selection
  const [books, setBooks] = useState([]); // Book results from API
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(""); // Error messages
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Total number of pages from API

  // Search handle
  function handleSearch(event) {
    event.preventDefault();
    searchBooks(1); // Start search from page 1
  }

  // Fetch books from API
  function searchBooks(page) {
    if (!searchTerm.trim()) {
      return; // Stop if search box is empty
    }

    setLoading(true);
    setError("");

    // Base API URL with search term and page
    let apiUrl = `https://gutendex.com/books?search=${searchTerm}&page=${page}`;

    // Add topic filter
    if (topic) {
      apiUrl = apiUrl + `&topic=${topic}`;
    }
    // Fetch data from API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / 32)); // Gutendex returns 32 books per page

        if (data.results.length === 0) {
          setError("No books found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch books. Please try again.");
        setLoading(false);
      });
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      searchBooks(currentPage + 1);
    }
  }

  // Show only the first 6 books on screen
  let displayedBooks = books.slice(0, 6);

  return (
    <div className="App">
      <header>
        <h1>Book Search</h1>
      </header>

      <main>
        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, author, or topic..."
            />
            <select
              className="topic-filter"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
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
          </div>
        </form>

        {displayedBooks.length > 0 && (
          <div>
            {displayedBooks.map((book) => (
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
                      By: {book.authors.map((a) => a.name).join(", ")}
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

            <div className="pagination">
              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
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
