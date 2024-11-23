import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Movie } from "../interfaces/interface";

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${query}&page=100`
      );
      console.log(response);
      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setError(response.data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setMovies([]);
    }
    setLoading(false);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchMovies();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="movie-search-container">
      <h1>Movie Search App</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for movies..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.Title}</h3>
            <p className="movie-year">{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
