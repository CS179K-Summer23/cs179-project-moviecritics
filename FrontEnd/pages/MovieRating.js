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
  backgroundColor: theme.palette.common.black,
}));

const jsonfile1 = [
  { id: 1, title: "Movie 1", genres: "Action", vote_average: 9.5, Rated: "PG-13" },
];

export default function MovieRatings() {
  const [openReview, setOpenReview] = useState(false);
  const [openWatchedConfirmation, setOpenWatchedConfirmation] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [jsonfile, setjsonfile] = useState(jsonfile1);

  const handleOpenReview = (movie) => {
    setSelectedMovie(movie);
    setSliderValue(0);
    setOpenReview(true);
  };

  const handleOpenWatched = (movie) => {
    console.log("movie")
    setSelectedMovie(movie);
    setOpenWatchedConfirmation(true);
  };

  const handleClose = () => {
    setOpenReview(false);
    setOpenWatchedConfirmation(false);
    setSelectedMovie(null);
  };

  const handleCloseWatchedConfirmation = () => {
    setOpenWatchedConfirmation(false);
  };

  const handleSubmitReview = () => {
    // Perform any review submission logic here

    // Mark the movie as reviewed
    setReviewedMovies([...reviewedMovies, selectedMovie.id]);

    // Close the review dialog
    handleClose();
  };

  const handleConfirmWatched = async () => {
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
        handleCloseWatchedConfirmation();
      } else {
        console.error("API call failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getData2 = async () => {
    try {
      console.log('before')
      const res = await axios.post(
        "http://localhost:8003/movierating", {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      console.log('after')
      setjsonfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData2();
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#178582" }}>Suggestions Based on ReleaseDate</h1>
        </div>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "950px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
            color: "#178582"
          }}
        >
          <TableContainer>
            <Table stickyHeader>
              <caption>Generated from Movie Rating</caption>
              <TableHead>
                <StyledTableRow>
                  <TableCell sx={{ color: '#B2B5E0'}}>RANK</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>MOVIE TITLE</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>GENRE(S)</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>VOTES</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>RATING</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>RELEASE DATE</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>WATCHED?</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>REVIEW?</TableCell>
                  <TableCell sx={{ color: '#B2B5E0' }}>REVIEWED</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {jsonfile.map((movie) => {
                  return(
                  <TableRow key={movie.id}>
                    <TableCell sx={{ color: '#178582' }}>{movie.id}</TableCell>
                    <TableCell sx={{ color: '#178582' }}>{movie.title}</TableCell>
                    <TableCell sx={{ color: '#178582' }}>{movie.genres}</TableCell>
                    <TableCell sx={{ color: '#178582' }}>{movie.vote_count}</TableCell>
                    <TableCell sx={{ color: '#178582' }}>{movie.vote_average}</TableCell>
                    <TableCell sx={{ color: '#178582' }}>{movie.release_date}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: "#178582",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#178582",
                          },
                        }}
                        onClick={() => handleOpenWatched(movie)}
                      >
                        Watch
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{
                          backgroundColor: "#178582",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#178582",
                          },
                        }}
                        onClick={() => handleOpenReview(movie)}
                      >
                        Review
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: "#178582" }}>
                      {reviewedMovies.includes(movie.id) ? "True" : "False"}
                    </TableCell>
                  </TableRow>
                  );
                  })};
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
