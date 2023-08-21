import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Column } from 'react-virtualized';
import 'react-virtualized/styles.css';

const MovieList = () => {
  const [movieData, setMovieData] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredMovieData, setFilteredMovieData] = useState([]);
  const [ratingMovieTitle, setRatingMovieTitle] = useState('');
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const moviesPerPage = 10; // Number of movies to display per page
  const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  useEffect(() => {
    fetchMovieData();
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      const filteredData = movieData.filter(item => item.title.startsWith(selectedLetter));
      setFilteredMovieData(filteredData);
    } else {
      setFilteredMovieData(movieData);
    }
    setCurrentPage(0); // Reset current page when selecting a new letter
  }, [selectedLetter, movieData]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = movieData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovieData(filteredData);
    } else {
      setFilteredMovieData(movieData);
    }
    setCurrentPage(0); // Reset current page when searching
  }, [searchTerm, movieData]);

  const fetchMovieData = async () => {
    try {
      const response = await axios.post('http://localhost:8002/movie_data');
      setMovieData(response.data.movie_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLetterSelect = event => {
    setSelectedLetter(event.target.value);
    setSearchTerm(''); // Clear search when selecting a letter
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(0, prevPage - 1));
  };

  const handleRateFilm = movieTitle => {
    setRatingMovieTitle(movieTitle);
    setIsRatingOpen(true);
  };

  const handleRatingChange = event => {
    setRating(event.target.value);
  };

  const handleSubmitRating = async () => {
    try {
      const response = await axios.post('http://localhost:8001/submit_rating', {
        movie_title: ratingMovieTitle,
        new_rating: rating
      });
  
      if (response.status === 200) {
        console.log('Rating submitted successfully');
        console.log(response.new_rating);
        setIsRatingOpen(false);
        setRatingMovieTitle('');
        setRating('');
        // You might want to update the movieData state to reflect the new ratings
        fetchMovieData();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };
  

  const startIndex = currentPage * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const dataToShow = filteredMovieData.slice(startIndex, endIndex);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <h2>Movie Titles</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="letterSelect">Select a letter: </label>
        <select id="letterSelect" value={selectedLetter} onChange={handleLetterSelect}>
          <option value="">All</option>
          {alphabet.map(letter => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="searchInput">Search movie names: </label>
        <input
          type="text"
          id="searchInput"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <Table
        width={600}
        height={750}
        headerHeight={20}
        rowHeight={70}
        rowCount={dataToShow.length}
        rowGetter={({ index }) => dataToShow[index]}
      >
        <Column label="Movie Title" dataKey="title" width={450} />
        <Column
          label="Rating"
          dataKey="rating"
          width={150}
        />
        <Column
          label="Rate This Film"
          dataKey="title"
          width={150}
          cellRenderer={({ rowData }) => (
            <button onClick={() => handleRateFilm(rowData.title)}>Rate This Film</button>
          )}
        />
      </Table>
      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <button onClick={handleNextPage} disabled={endIndex >= filteredMovieData.length}>
          Next Page
        </button>
      </div>
      {isRatingOpen && (
        <div style={{ marginTop: '20px' }}>
          <h3>{ratingMovieTitle}</h3>
          <p>Be our critic and rate this film</p>
          <input
            type="number"
            min="0"
            max="10"
            value={rating}
            onChange={handleRatingChange}
          />
          <button onClick={handleSubmitRating}>Submit Rating</button>

        </div>
      )}
    </div>
  );
};

export default MovieList;
