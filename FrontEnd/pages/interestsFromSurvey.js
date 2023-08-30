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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "black", // Set the background color to black
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  color: "#178582",
  fontWeight: "bold",
  backgroundColor: "black", // Change this to your desired background color
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#178582",
  color: "white",
  "&:hover": {
    backgroundColor: "#178582",
  },
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  color: "#178582",
  fontWeight: "bold",
}));

const jsonfile = [
  // ... (your movie data)
];

const theme = createTheme({
  typography: {
    fontSize: 16,
  },
});

export default function MovieshowerFromInterests() {
  const [openReview, setOpenReview] = useState(false);
  const [openWatched, setOpenWatched] = useState(false);
  const [openWatchedConfirmation, setOpenWatchedConfirmation] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewedMovies, setReviewedMovies] = useState(new Set());
  const [movies, setMovies] = useState(jsonfile);

  const isMovieReviewed = (movie) => reviewedMovies.has(movie.id);

  const handleOpenReview = (movie) => {
    if (!isMovieReviewed(movie)) {
      setSelectedMovie(movie);
      setSliderValue(0);
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
    setSelectedMovie(null);
  };

  const handleSubmitReview = () => {
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
    if (selectedMovie) {
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== selectedMovie.id)
      );
    }
    setSelectedMovie(null);
    handleCloseWatchedConfirmation();
  };

  const getData3 = async () => {
    try {
      console.log('before');
      const res = await axios.post(
        "http://localhost:8003/suggestions",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      console.log('after');
      setMovies(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData3();
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
            alignItems: "center",
            borderRadius: 8,
            padding: "20px",
            backgroundColor: "black", // Set the background color to black
          }}
        >
          <h1 style={{ textAlign: "center", color: "#178582", backgroundColor: "black" }}>
            Suggestions Based on Ratings
          </h1>
          <TableContainer style={{ width: "70%", textAlign: "center", color: "#178582", backgroundColor: "black" }}>
            <Table stickyHeader>
              <caption>Generated from User Survey</caption>
              <TableHead>
                <StyledTableRow>
                  <StyledTableHeaderCell>RANK</StyledTableHeaderCell>
                  <StyledTableHeaderCell>MOVIE</StyledTableHeaderCell>
                  <StyledTableHeaderCell>GENRES</StyledTableHeaderCell>
                  <StyledTableHeaderCell>RATING</StyledTableHeaderCell>
                  <StyledTableHeaderCell>WATCHED?</StyledTableHeaderCell>
                  <StyledTableHeaderCell>REVIEW?</StyledTableHeaderCell>
                  <StyledTableHeaderCell>RATED</StyledTableHeaderCell>
                  <StyledTableHeaderCell>REVIEWED</StyledTableHeaderCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {movies.map((list, index) => {
                  return (
                    <TableRow key={index}>
                      <CustomTableCell>{index + 1}</CustomTableCell>
                      <CustomTableCell>{list.title}</CustomTableCell>
                      <CustomTableCell>{list.genres}</CustomTableCell>
                      <CustomTableCell>{list.vote_average}</CustomTableCell>
                      <TableCell>
                        <CustomButton
                          variant="outlined"
                          onClick={() => handleOpenWatched(list)}
                        >
                          Watched
                        </CustomButton>
                      </TableCell>
                      <TableCell>
                        <CustomButton
                          variant="outlined"
                          onClick={() => handleOpenReview(list)}
                        >
                          Review
                        </CustomButton>
                      </TableCell>
                      <CustomTableCell>{list.Rated}</CustomTableCell>
                      <CustomTableCell>
                        {reviewedMovies.has(list.id) ? "True" : "False"}
                      </CustomTableCell>
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
