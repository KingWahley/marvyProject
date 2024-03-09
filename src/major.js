/* App.js */

// Import necessary Tailwind CSS classes
import React, { useState, useEffect } from "react";
import "./App.css"; // Keep this for custom styles

const apiKey = "b81303888057d45a55b44947d03c6710";

function Major() {
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); // State for welcome message

  useEffect(() => {
    if (movies.length > 0) {
      setCurrentIndex(0); // Reset currentIndex when movies change
      setShowWelcomeMessage(false); // Hide welcome message when movies are loaded
    }
  }, [movies]);

  const searchMovie = async () => {
    setLoading(true);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results.length > 0) {
        setMovies(data.results);
        setError(null);
      } else {
        setMovies([]);
        setError(
          "I'm so sorry, I could not find a movie with the provided title, please try another title."
        );
      }
    } catch (error) {
      setError(
        "I'm so sorry, I can not process your request. Please check your internet connection and try again."
      );
    }
    setLoading(false);
  };

  const nextItem = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < movies.length - 1 ? prevIndex + 1 : 0
    );
  };

  const previous = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Marvy</h1>
      </div>
      <div className="change">
        {movies.length > 0 && (
          <>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
              onClick={previous}
            >
              Previous
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
              onClick={nextItem}
            >
              Next Movie with similar title
            </button>
          </>
        )}
      </div>

      <div className="loader">{loading && <p>Loading...</p>}</div>
      <div className="mess">
        {error && (
          <p className="marvy">
            <span className="red-text">Marvy : </span>
            {error}
          </p>
        )}
      </div>
      <div className="strait">
        <div className="chat-history" id="movie-info">
          {showWelcomeMessage && (
            <div className="welcome-message">
              <p>Welcome to Marvy! Search for a movie title to get started.</p>
            </div>
          )}
          {movies.length > 0 && (
            <div>
              <p className="tittle">{movies[currentIndex].title}</p>
              <p>{movies[currentIndex].overview}</p>
              <img
                className="posters"
                src={`https://image.tmdb.org/t/p/w500${movies[currentIndex].poster_path}`}
                alt={`Poster for ${movies[currentIndex].title}`}
              />
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            id="search-input"
            placeholder="Enter a movie title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <button
            type="button"
            id="search-button"
            onClick={searchMovie}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Major;
