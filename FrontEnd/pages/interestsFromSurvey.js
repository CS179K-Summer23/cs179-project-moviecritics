import * as React from "react";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import axios from "axios";
import MovieInfoApp from "./movieinfo";
import {TextField} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const jsonfile = [
  {
    id: 1,
    title: "Movie 1",
    genres: "Action",
    vote_average: 9.5,
    Rated: "PG-13",
  },
  { id: 2, title: "Movie 2", genres: "Drama", vote_average: 8.7, Rated: "R" },
  // ...
];

const theme = createTheme({
  typography: {
    fontSize: 16,
  },
});

export default function MovieshowerFromInterests() {
  const [formData, setFormData] = useState({
    rating: "",
    movie_title: "",
    comment: ""
  });
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };
  const [openReview, setOpenReview] = useState(false);
  const [openWatched, setOpenWatched] = useState(false);
  const [openWatchedConfirmation, setOpenWatchedConfirmation] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewedMovies, setReviewedMovies] = useState(new Set()); // Use a Set
  const [movies, setMovies] = useState(jsonfile); // State to hold movie data
  const [openmovie, setopenmovie] = useState(false);
  const [moviename, setmoviename] = useState('Test');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [ratingMovieTitle, setRatingMovieTitle] = useState('');

  const isMovieReviewed = (movie) => reviewedMovies.has(movie.id);

  const handleOpenReview = (movie) => {
    if (!isMovieReviewed(movie)) {
      setSelectedMovie(movie);
      setSliderValue(0); // Initialize the slider value
      setOpenReview(true);
      setmoviename(movie)
    }
  };

  const handleRateFilm = (movieTitle) => {
    setRatingMovieTitle(movieTitle);
    setOpenReview(true);
  };

  const handleOpenWatched = (movie) => {
    setSelectedMovie(movie);
    setOpenWatchedConfirmation(true);
  };

  const handleClose = () => {
    setOpenReview(false);
    setOpenWatched(false);
    setSelectedMovie(null); // Reset the selectedMovie state
  };

  

  const handleSubmitReview = async () => {

    const params = {
      "new_rating": rating,
      "comment": reviewText,
      "movie_title": moviename
    }
    // Perform any review submission logic here

    // Mark the selected movie as reviewed
    if (selectedMovie) {
      const updatedReviewedMovies = new Set(reviewedMovies);
      updatedReviewedMovies.add(selectedMovie.id);
      setReviewedMovies(updatedReviewedMovies);
    }

    handleClose();
    console.log("params:", params);
    try {
      const res = await axios.post(
        "http://localhost:8003/submit_rating",
        params,
        {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        }
      );
      
      setOpenReview(false);
      setOpenWatched(false);
      setSelectedMovie(null); // Reset the selectedMovie state
      if (res.data && res.status === 200) {
        console.log("success")
      }
    } catch (err) {
      console.error(err);
    }
  };



  const handleCloseWatchedConfirmation = () => {
    setOpenWatchedConfirmation(false);
  };

  const handleConfirmWatched = async () => {
    // Mark the movie as watched or perform other actions
    // You can add your logic here to update the state or perform any other actions.
    // For example, you can set a "watched" flag for the selected movie.

    // Remove the selected movie from the state
    // if (selectedMovie) {
    //   setMovies((prevMovies) =>
    //     prevMovies.filter((movie) => movie.id !== selectedMovie.id)
    //   );
    // }
    console.log("handleConfirmWatched")
    try {
      const response = await axios.post(
        `http://localhost:8003/addToWatchList/${selectedMovie.title}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem('authToken')
          }
        }
      );
  
      if (response.status === 201) {
        getData3();
        handleCloseWatchedConfirmation();
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    

    setSelectedMovie(null); // Reset the selectedMovie state
    handleCloseWatchedConfirmation();
  };

  const getData3 = async () => {
    try {
      console.log("before");
      const res = await axios.post(
        "http://localhost:8003/suggestions",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      console.log("after");
      setMovies(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData3();
  }, [selectedMovie, openReview]);

  const handleOpeninfo = (value) => {
    console.log("pressed", value);
    setmoviename(value);
    setopenmovie(true);
    setFormData.movie_title = value;
  };

  const handleCloseinfo = (value) => {
    setopenmovie(false);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            alignItems: "center", // Center the content horizontally
            borderRadius: 8,
            padding: "20px",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Suggestions Based on Ratings</h1>
          <TableContainer style={{ width: "70%", textAlign: "center" }}>
            <Table stickyHeader>
              <caption>Generated from User Survey</caption>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Movie</TableCell>
                  <TableCell>Genre(s)</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Watched?</TableCell>
                  <TableCell>Review?</TableCell>
                  <TableCell>Rated</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {movies.map((list, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpeninfo(list.title)}
                        >
                          {list.title}
                        </Button>
                      </TableCell>
                      <TableCell>{list.genre}</TableCell>
                      <TableCell>{(Math.round(list.vote_average * 100) / 100).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenWatched(list)}
                        >
                          Watched
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenReview(list.title)}
                        >
                          Review
                        </Button>
                      </TableCell>
                      <TableCell>{list.rated}</TableCell>
                    </TableRow>
                  );
                })}
                
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ThemeProvider>

      {selectedMovie && (
        // <Dialog open={openReview} onClose={handleClose}>
        //   <DialogTitle>Review Movie</DialogTitle>
        //   <DialogContent>
        //     <DialogContentText>Please rate the movie below:</DialogContentText>
        //     <Typography gutterBottom>Rating: {sliderValue}</Typography>
        //     <Slider
        //       value={sliderValue}
        //       onChange={(event, newValue) => setSliderValue(newValue)}
        //       valueLabelDisplay="auto"
        //       min={0}
        //       max={10}
        //       step={0.1}
        //     />
        //   </DialogContent>
        //   <DialogActions>
        //     <Button onClick={handleClose}>Cancel</Button>
        //     <Button onClick={handleSubmitReview}>Submit Review</Button>
        //   </DialogActions>
        // </Dialog>
        <Dialog open={openReview} onClose={handleClose}>
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
                id="rating"
              />
              <p style={{ fontSize: '18px', marginTop: '20px' }}>Write a review:</p>
              <TextField
                multiline
                minRows={3}
                style={{ width: '100%' }} // Set the background color to grey here
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                variant="outlined" // Add this line to match the styling
                id="comment"
              />
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={handleClose} style={{ marginRight: 'auto' }}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit</Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedMovie && (
        <Dialog
          open={openWatchedConfirmation}
          onClose={handleCloseWatchedConfirmation}
        >
          <DialogTitle>Watched Movie</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark "{selectedMovie.title}" as watched?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWatchedConfirmation}>Cancel</Button>
            <Button onClick={handleConfirmWatched}>Confirm</Button>
          </DialogActions>
        </Dialog>
      )}

      {openmovie && (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={openmovie}
          onClose={handleCloseinfo}
        >
          <DialogTitle>Movie Info</DialogTitle>
          <DialogContent>
            <MovieInfoApp moviename={moviename}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseinfo} >Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
