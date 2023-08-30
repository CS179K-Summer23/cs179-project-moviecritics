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

const lightTheme = createTheme({
  palette: {
    mode: "light",
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
      const response = await axios.post(
        "http://localhost:8003/movierating",  // Use the correct URL for your Flask server
        { user_id: 1 },  // Replace with the appropriate user ID
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      setjsonfile(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    getData2();
  }, []);

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <h1>___________You may also like!!...</h1>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            align: "center",
            width: "90%",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <TableContainer>
            <Table stickyHeader>
              <caption>Generated from Movie Rating</caption>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Movie Title</TableCell>
                  <TableCell>Genres</TableCell>
                  <TableCell>Votes</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Release Date</TableCell>
                  
                 
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {jsonfile.map((movie, index) => {
                  return(
                  <TableRow key={movie.id}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>{movie.genre}</TableCell>
                    <TableCell>{movie.vote_count}</TableCell>
                    <TableCell>{movie.vote_average}</TableCell>
                    <TableCell>{movie.release_date}</TableCell>
                   
                    
                   
                   
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
