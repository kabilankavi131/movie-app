import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { Movie, OmdbMovie } from "../interfaces/interface";
import { log } from "console";

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [omdbmovies, setOmdbMovies] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [omdb, setOmdb] = useState<boolean>(false);
  const initialMovies = async () => {
    console.log("Omdb");

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=vikram`
      );
      console.log(response);
      if (response.status === 200) {
        setOmdbMovies(response.data.Search);
        setOmdb(true);
      } else {
        setError(response.data.Error);
        setOmdbMovies([]);
        setOmdb(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    initialMovies();
  }, []);

  const fetchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      console.log("Imsid", query);

      const response = await axios.get(
        `http://localhost:5000/searchmovies?movie=${query}`
      );
      console.log(response);
      if (response.status === 200) {
        setMovies(response.data);
        setOmdb(false);
      } else {
        setError(response.data.Error);
        setMovies([]);
        setOmdb(true);
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

  if (omdb)
    return (
      <div className="movie-search-container">
        <h1>Movie Search App if</h1>
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
          {omdbmovies.map((movie) => (
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

  return (
    <div className="movie-search-container">
      <h1>Movie Search App else</h1>
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
          <div key={movie.imdb_id} className="movie-card">
            <img
              src={
                "https://i.pinimg.com/736x/04/b3/2c/04b32c7e403fc63ca9ac599fa5f8136e.jpg"
              }
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-year">{movie.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
