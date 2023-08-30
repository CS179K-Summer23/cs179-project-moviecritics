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
import { Container, Link } from "@mui/material";
import axios from "axios";

const lightTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const jsonfile1 = [
  {
    id: 1,
    title: "Movie 1",
    genres: "Action",
    vote_average: 9.5,
    Rated: "PG-13",
  },
  { id: 2, title: "Movie 2", genres: "Drama", vote_average: 8.7, Rated: "R" },

];
export default function HomeAccount() {
  
  
  
  const [openReview, setOpenReview] = useState(false);
  const [openWatchedConfirmation, setOpenWatchedConfirmation] =useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [reviewedMovies, setReviewedMovies] = useState([]);
  const [isBackdropView, setIsBackdropView] = useState({});

  const [jsonfile, setjsonfile] = useState(jsonfile1);
  const [currentMovies, setcurrentMovies] = useState([]);

  const [totalMovies, settotalMovies] = useState(0);

  const [news, setNews] = useState([]);

  const getData = async () => {
    try {
      console.log('before')
      const res = await axios.post(
        "http://localhost:8003/movierating",{},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      console.log('after')
      setjsonfile(res.data);
      console.log(res.data);
      settotalMovies(jsonfile.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8003/news")
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
      })
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  const toggleBackdropView = (movieId) => {
    setIsBackdropView((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId],
    }));
  };

  const handleOpenReview = (movie) => {
    setSelectedMovie(movie);
    setSliderValue(0);
    setOpenReview(true);
  };

  const handleOpenWatched = (movie) => {
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
    // Mark the movie as watched or perform other actions
    // You can add your logic here to update the state or perform any other actions.
    // For example, you can set a "watched" flag for the selected movie.

    // Close the watched confirmation dialog
    handleCloseWatchedConfirmation();
  };

  useEffect(() => {
    getData();
  }, []);


  


  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      {/* Hot New Arrivals */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
          alignItems: "center",
          width: "2000px",
          borderRadius: 8,
          marginLeft: "auto",
          marginRight: "auto",
          padding: "20px",
        }}
      >
        <h1>Hot New Arrivals</h1>
      </Box>

      {/* Movie List */}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 8,
          padding: "20px",
          backgroundColor: "#333",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: 2, color: "white" }}
        ></Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            marginBottom: "20px",
            width: "100%", // Add this to make sure pagination buttons stay within the container
          }}
        >
          {jsonfile.map((movie) => {
            return (
              <Box
                key={movie.id}
                sx={{
                  width: "300px",
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: 8,
                  margin: "8px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography variant="h5">{movie.title}</Typography>
                  <Typography variant="h8">{movie.genre}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "8px",
                    width: "300px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        isBackdropView[movie.id]
                          ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
                          : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      }
                      alt={`Image for ${movie.title}`}
                      height="200"
                      width="200"
                      onClick={() => toggleBackdropView(movie.id)}
                      style={{
                        cursor: "pointer",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography>
                    Votes: {movie.vote_count} | Rating: {movie.vote_average} |
                    Release Date: {movie.release_date}
                  </Typography>
                  <Typography variant="h7">{movie.rated}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenWatched(movie)}
                    >
                      Watch
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenReview(movie)}
                    >
                      Review
                    </Button>
                    {reviewedMovies.includes(movie.id) ? (
                      <Typography color="success">Reviewed</Typography>
                    ) : (
                      <Typography color="error">Not Reviewed</Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        
      </Container>

      {/* Latest News */}
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 8,
          padding: "20px",
          backgroundColor: "#333",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, color: "white" }}>
          Latest News
        </Typography>
        {news.map((article, index) => {
          return(
          <Container
            key={index}
            sx={{
              marginBottom: 4,
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            <Typography variant="h5">{article.title}</Typography>
            <img
              src={article.urlToImage}
              alt={article.title}
              style={{ maxWidth: "100%", height: "auto", marginBottom: 10 }}
            />
            <Typography>{article.description}</Typography>
            <Link href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </Link>
          </Container>
          );
          })};
      </Box>
    </ThemeProvider>
    
  );
}
