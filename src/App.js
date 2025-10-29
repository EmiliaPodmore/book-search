import React, { useState } from "react";
import "./App.css";

export default function App() {
  // State variables for managing search term, topic filter, book data, and pagination
  const [searchTerm, setSearchTerm] = useState("");

  // topic stores the selected filter from the dropdown menu
  const [topic, setTopic] = useState("");

  // bookData stores the entire response object from the API, including results array and pagination info
  const [bookData, setBookData] = useState(null);

  // currentPage tracks which page of results we're currently viewing
  const [currentPage, setCurrentPage] = useState(1);

  // totalPages stores the total number of pages available based on the total count of books
  const [totalPages, setTotalPages] = useState(0);

  // This function runs when the user clicks the Search button
  function handleSearch() {
    loadBooks(1);
  }

  // This is the main function that fetches book data from the Gutendex API
  function loadBooks(page) {
    // Start building the API URL
    let apiUrl = `https://gutendex.com/books?search=${searchTerm}&page=${page}`;

    // Check if the user has selected a topic filter from the dropdown and add to the API URL
    if (topic) {
      apiUrl += `&topic=${topic}`;
    }

    // fetch() sends a request to the API
    fetch(apiUrl)
      // First .then() converts the response into JSON format
      .then((response) => response.json())
      // Second .then() takes the JSON data and updates our state variables
      .then((data) => {
        // Store all the API response data in bookData state
        setBookData(data);
        // Update currentPage to match the page we just loaded
        setCurrentPage(page);
        // Calculate total pages by dividing total count by 32 (Gutendex returns 32 books per page)
        // Math.ceil rounds up to make sure we account for any partial pages
        setTotalPages(Math.ceil(data.count / 32));
      });
  }

  // This function handles clicking the "Previous" button in pagination
  function previousPage() {
    if (currentPage > 1) {
      // Subtract 1 from current page to go backwards
      loadBooks(currentPage - 1);
    }
  }

  // This function handles clicking the "Next" button in pagination and loads the next page by adding 1 to the current page number
  function nextPage() {
    loadBooks(currentPage + 1);
  }

  // This function updates the searchTerm state whenever the user types in the search box
  // event.target.value contains whatever text is currently in the input field
  function updateSearch(event) {
    setSearchTerm(event.target.value);
  }

  // This function updates the topic state when the user selects a different option from the dropdown
  // event.target.value contains the value attribute of the selected option element
  function updateTopic(event) {
    setTopic(event.target.value);
  }

  return (
    <div className="App">
      <header>
        <h1>Book Search</h1>
      </header>

      <main>
        <div className="search-bar">
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

          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Conditional rendering - only show results if bookData exists and has a results array */}
        {bookData && bookData.results && (
          <div>
            {/* Loop through the first 6 books using .slice(0, 6) to limit results displayed */}
            {/* .map() creates a result card for each book in the array */}
            {bookData.results.slice(0, 6).map((book) => (
              <div className="result-card" key={book.id}>
                {/* Only display the book cover image if the book has one in JPEG format */}
                {book.formats["image/jpeg"] && (
                  <img
                    className="result-cover"
                    src={book.formats["image/jpeg"]}
                    alt={book.title}
                  />
                )}

                <div className="result-details">
                  {/* Display the book title */}
                  <h3 className="result-title">{book.title}</h3>

                  {/* Only show authors if the book has any authors in the array */}
                  {book.authors.length > 0 && (
                    <p className="result-author">
                      {/* .map() gets each author's name, .join() combines them with commas */}
                      {book.authors.map((author) => author.name).join(", ")}
                    </p>
                  )}

                  {/* Only show the "Read Online" link if an HTML version is available */}
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
            {/* Show "No results found" message if search returned empty results */}
            {bookData && bookData.results && bookData.results.length === 0 && (
              <div className="no-results">
                <p>No results found.</p>
              </div>
            )}
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={nextPage}
                disabled={!bookData.next}
              >
                →
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
