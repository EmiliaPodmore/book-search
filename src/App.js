import React from "react";
import "./App.css";
import Library from "./Library";

export default function App() {
  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Book Search</h1>
        </header>
        <main>
          <Library />
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
    </div>
  );
}
