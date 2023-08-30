import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from '@mui/material';

const MovieList = () => {
  const [movieData, setMovieData] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredMovieData, setFilteredMovieData] = useState([]);
  const [ratingMovieTitle, setRatingMovieTitle] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [watchedMovies, setWatchedMovies] = useState([]);

  const moviesPerPage = 10;
  const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  const fetchMovieData = async () => {
    try {
      const response = await axios.post('http://localhost:8003/movie_data');
      setMovieData(response.data.movie_data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, []);

  useEffect(() => {
    if (selectedLetter) {
      const filteredData = movieData.filter((item) => item.title.startsWith(selectedLetter));
      setFilteredMovieData(filteredData);
    } else {
      setFilteredMovieData(movieData);
    }
    setCurrentPage(0);
  }, [selectedLetter, movieData]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = movieData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovieData(filteredData);
    } else {
      setFilteredMovieData(movieData);
    }
    setCurrentPage(0);
  }, [searchTerm, movieData]);

  const handleLetterSelect = (event) => {
    setSelectedLetter(event.target.value);
    setSearchTerm('');
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleRateFilm = (movieTitle) => {
    setRatingMovieTitle(movieTitle);
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = async () => {
    try {
      // Send the POST request to the server
      const response = await axios.post('http://localhost:8003/submit_rating', {

        movie_title: ratingMovieTitle,
        new_rating: rating,
        comment: reviewText,
      }, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      });

      // Check if the review was submitted successfully (adjust the condition based on your response format)
      if (response.status === 200) {
        // Update the movie's data in the state to include the review and rating
        const updatedMovieData = movieData.map((movie) => {
          if (movie.title === ratingMovieTitle) {
            return {
              ...movie,
              review: reviewText,
              rating: rating,
            };
          }
          return movie;
        });

        // Update the state with the modified movie data
        setMovieData(updatedMovieData);

        // Close the review dialog
        setIsReviewDialogOpen(false);
      } else {
        // Handle submission error
        console.error('Submission error:', response);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleMarkAsWatched = (movieTitle) => {
    // Create a copy of the watchedMovies array with the new movie title added
    const updatedWatchedMovies = [...watchedMovies, movieTitle];
    setWatchedMovies(updatedWatchedMovies);
    // You can implement logic here to mark the movie as watched.
    // For example, make an API call or update the movie's status in your data.
  };

  const isMovieWatched = (movieTitle) => {
    // Check if the movie title is in the watchedMovies array
    return watchedMovies.includes(movieTitle);
  };

  const startIndex = currentPage * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const dataToShow = filteredMovieData.slice(startIndex, endIndex);

  return (
    <div style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '44px', marginBottom: '20px', color: '#B2B5E0' }}>MOVIE TITLES</h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{ marginRight: '10px' }}>
          <label htmlFor="letterSelect" style={{ fontSize: '25px', color: '#178582' }}>Select a letter: </label>
          <Select id="letterSelect" value={selectedLetter} onChange={handleLetterSelect}>
            <MenuItem value="">All</MenuItem>
            {alphabet.map((letter) => (
              <MenuItem key={letter} value={letter}>
                {letter}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="searchInput" style={{ fontSize: '25px', color: '#178582' }}>Search movie names: </label>
          <TextField
            type="text"
            id="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          align: "center",
          width: "950px",
          borderRadius: 8,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <TableContainer component={Paper} style={{ flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '18px', color: '#B2B5E0' }}>MOVIE TITLE</TableCell>
                <TableCell style={{ fontSize: '18px', color: '#B2B5E0' }}>RATING</TableCell>
                <TableCell style={{ fontSize: '18px', color: '#B2B5E0' }}>REVIEW</TableCell>
                <TableCell style={{ fontSize: '18px', color: '#B2B5E0' }}>WATCH STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataToShow.map((rowData) => (
                <TableRow key={rowData.title}>
                  <TableCell style={{ fontSize: '16px', color: '#178582' }}>{rowData.title}</TableCell>
                  <TableCell style={{ fontSize: '16px', color: '#178582' }}>{rowData.rating}</TableCell>
                  <TableCell style={{ fontSize: '16px', color: '#178582' }}>
                    {rowData.review ? (
                      <div>
                        <p>Rating: {rowData.rating}</p>
                        <p>Review: {rowData.review}</p>
                      </div>
                    ) : (
                      <Button onClick={() => handleRateFilm(rowData.title)} style={{ backgroundColor: '#178582', color: 'white' }}>
                        Rate This Film
                      </Button>
                    )}
                  </TableCell>
                  <TableCell style={{ fontSize: '16px', color: '#178582' }}>
                    {isMovieWatched(rowData.title) ? (
                      <span>Watched</span>
                    ) : (
                      <Button onClick={() => handleMarkAsWatched(rowData.title)} style={{ backgroundColor: '#178582', color: 'white' }}>
                        Mark as Watched
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div style={{ marginTop: '50px' }}>
        <Button onClick={handlePreviousPage} disabled={currentPage === 0} >
          Previous Page
        </Button>
        <Button onClick={handleNextPage} disabled={endIndex >= filteredMovieData.length}>
          Next Page
        </Button>
      </div>

      {isReviewDialogOpen && (
        <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
          <DialogTitle style={{ textAlign: 'center', color: '#178582' }}>Rate and Review</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: '18px' }}>Be our critic and rate: {ratingMovieTitle} </p>
              <TextField
                type="number"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <p style={{ fontSize: '18px', marginTop: '20px' }}>Write a review:</p>
              <TextField
                multiline
                minRows={3}
                style={{ width: '100%' }} // Set the background color to grey here
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                variant="outlined" // Add this line to match the styling
              />
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={() => setIsReviewDialogOpen(false)} style={{ marginRight: 'auto' }}>Cancel</Button>
            <Button onClick={handleReviewSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MovieList;
