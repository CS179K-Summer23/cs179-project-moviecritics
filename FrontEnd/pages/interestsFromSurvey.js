import React, { useState } from "react";
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

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const jsonfile = [
  { id: 1, title: "Movie 1", genres: "Action", vote_average: 9.5, Rated: "PG-13" },
  { id: 2, title: "Movie 2", genres: "Drama", vote_average: 8.7, Rated: "R" },
  // ...
];

const theme = createTheme({
  typography: {
    fontSize: 16,
  },
});

export default function MovieshowerFromInterests({ jsonfile }) {
  const [openReview, setOpenReview] = useState(false);
  const [openWatched, setOpenWatched] = useState(false);
  const [openWatchedConfirmation, setOpenWatchedConfirmation] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewedMovies, setReviewedMovies] = useState(new Set()); // Use a Set
  const [movies, setMovies] = useState(); // State to hold movie data

  const [jsonfile, setjsonfile] = useState({ id: 1, title: "Movie 1", genres: "Action", vote_average: 9.5, Rated: "PG-13" });


  const isMovieReviewed = (movie) => reviewedMovies.has(movie.id);

  const handleOpenReview = (movie) => {
    if (!isMovieReviewed(movie)) {
      setSelectedMovie(movie);
      setSliderValue(0); // Initialize the slider value
      setOpenReview(true);
    }
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

  const handleSubmitReview = () => {
    // Perform any review submission logic here

    // Mark the selected movie as reviewed
    if (selectedMovie) {
      const updatedReviewedMovies = new Set(reviewedMovies);
      updatedReviewedMovies.add(selectedMovie.id);
      setReviewedMovies(updatedReviewedMovies);
    }

    handleClose();
  };

  const handleCloseWatchedConfirmation = () => {
    setOpenWatchedConfirmation(false);
  };

  const handleConfirmWatched = () => {
    // Mark the movie as watched or perform other actions
    // You can add your logic here to update the state or perform any other actions.
    // For example, you can set a "watched" flag for the selected movie.

    // Remove the selected movie from the state
    if (selectedMovie) {
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== selectedMovie.id)
      );
    }

    setSelectedMovie(null); // Reset the selectedMovie state
    handleCloseWatchedConfirmation();
  };

  const getData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8003/suggestions",
        email,
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      console.log(res.json());
      setjsonfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
          <h1 style={{ textAlign: "center" }}>
            Suggestions Based on Ratings
          </h1>
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
                  <TableCell>Reviewed</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {movies.map((list, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{list.title}</TableCell>
                      <TableCell>{list.genres}</TableCell>
                      <TableCell>{list.vote_average}</TableCell>
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
                          onClick={() => handleOpenReview(list)}
                        >
                          Review
                        </Button>
                      </TableCell>
                      <TableCell>{list.Rated}</TableCell>
                      <TableCell>
                        {reviewedMovies.has(list.id) ? "True" : "False"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ThemeProvider>

      {selectedMovie && (
        <Dialog open={openReview} onClose={handleClose}>
          <DialogTitle>Review Movie</DialogTitle>
          <DialogContent>
            <DialogContentText>Please rate the movie below:</DialogContentText>
            <Typography gutterBottom>Rating: {sliderValue}</Typography>
            <Slider
              value={sliderValue}
              onChange={(event, newValue) => setSliderValue(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
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
    </>
  );
}
