import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Keep this for custom styles
import avatar from "./images/avatar.png";

const apiKey = "b81303888057d45a55b44947d03c6710";

function Response({ movie }) {
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (movie) {
      setSummary(movie.overview);
      setDisplayedSummary("");
      setIsTyping(true);
    }
  }, [movie]);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        const nextChar = summary[displayedSummary.length];
        setDisplayedSummary((prev) => prev + nextChar);
        if (displayedSummary.length === summary.length) {
          setIsTyping(false);
        }
      }, 5); // Adjust typing speed here
    }
    return () => clearTimeout(timeout);
  }, [isTyping, displayedSummary, summary]);

  return (
    <div className="response">
      {movie && (
        <div className="displayReply">
          <img className="avatar1" src={avatar} alt="My Image" />
          <p className="typewriter">{displayedSummary}</p>
        </div>
      )}
      {movie && (
        <img
          className="posters"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`Poster for ${movie.title}`}
        />
      )}
    </div>
  );
}

function UserMessage({ message }) {
  return (
    <div className="user-message">
      <p>{message}</p>
    </div>
  );
}

function Major() {
  const [searchInput, setSearchInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); // State for welcome message
  const [chatHistory, setChatHistory] = useState([]);

  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (movies.length > 0) {
      setCurrentIndex(0); // Reset currentIndex when movies change
      
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { movie: movies[currentIndex], userMessage: searchInput },
      ]);
    }
  }, [movies, currentIndex]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      // Scroll to the bottom of the chat history
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

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

  const handleNextMovie = () => {
    nextItem();
  };

  const handleUserMessage = () => {
    if (searchInput.trim() === "") return;
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { movie: null, userMessage: searchInput },
    ]);
    setShowWelcomeMessage(false); // Hide welcome message when movies are loaded
    setSearchInput("");
    searchMovie();
  };

  return (
    <div className="chat-container">
      <div className="head">
        <div className="chat-header">
          <h3>Marvy</h3>
          {movies.length > 0 && (
            <p className="tittle">{movies[currentIndex].title}</p>
          )}
        </div>
        <div className="change">
          {/* {movies.length > 0 && (
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
              onClick={handleNextMovie}
            >
              Movie with similar title
            </button>
          )} */}
        </div>
      </div>
      <div className="empty"></div>

      <div className="mess">
        {error && (
          <p className="marvy">
            <span className="red-text">Marvy : </span>
            {error}
          </p>
        )}
      </div>
      <div className="strait">
        <div className="chat-history" id="movie-info" ref={chatHistoryRef}>
          {chatHistory.map(({ movie, userMessage }, index) => (
            <React.Fragment key={index}>
              <div className="commune">
                <div className="userMessage">
                  <UserMessage message={userMessage} />
                </div>

                <Response movie={movie} />
              </div>
            </React.Fragment>
          ))}
          {showWelcomeMessage && (
            <div className="welcome-message">
              <p>Welcome to Marvy! Search for a movie title to get started.</p>
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
            onClick={handleUserMessage}
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
