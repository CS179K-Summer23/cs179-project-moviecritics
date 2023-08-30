import * as React from "react";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import axios from "axios";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const jsonfile1 = [
  {
    title: "The Kid",
    genre: "Comedy-Drama",
    vote_count: 1758.0,
    vote_average: 8.212,
    rated: "PG",
    backdrop_path: "/mAhCW7QbpL5kwvCWGsfyY3ILoW6.jpg",
    poster_path: "/drgMcyTsySQBnUPGaBThCHGdlWT.jpg",
  },
];

const jsonfile2 = [
  {
    rating: 8,
    comment: "test"
  }
];


export default function MovieInfoApp({ moviename }) {
  const [movieinfo, setmovieinfo] = useState(jsonfile1);
  const [reviews, setreviews] = useState(jsonfile2);
  const [streaminfo, setstreaminfo] = useState([
    { service: "Test1", streamingType: "Test2" },
  ]);

  const moviedata = async () => {
    try {
      console.log(moviename);
      const res = await axios.post(
        `http://localhost:8003/movieInfo?moviename=${moviename}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      setmovieinfo([res.data]);
      if (res.status === 200) {
      } else {
        alert("Failed to Retrieve");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const revmovie = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8003/reviews?moviename=${moviename}`,
        {}
      );
      console.log(res.data);
      setreviews(res.data);
      if (res.status === 200) {
      } else {
        alert("Failed to Retrieve");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getstream = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8003/streaminfo?moviename=${moviename}`,
        {}
      );
      console.log(res.data);
      setstreaminfo(res.data);
      if (res.status === 200) {
      } else {
        alert("Failed to Retrieve");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    moviedata();
   revmovie();
    getstream();
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Box
          alignItems={"left"}
          sx={{
            display: "flex",
            marginTop: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "auto",
            justifyContent: "flex-reverse",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "90%",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {movieinfo.map((m, index) => {
            return (
              <>
                <Card sx={{ maxWidth: 700, minWidth: 400 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="400"
                      image={`https://image.tmdb.org/t/p/w1280/${m.backdrop_path}`}
                      alt="pic of movie"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {m.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Genre: {m.genre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        language: {m.language}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overview: {m.overview}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Production Companies: {m.productioncompanies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Release Date: {m.release_date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {m.vote_average}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Votes: {m.vote_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Credits: {m.credits}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                <h1>Reviews:</h1>
                <Box
                  alignItems={"left"}
                  sx={{ marginLeft: "1%", height: 400, width: "100%" }}
                >
                  <TableContainer style={{ width: "70%", textAlign: "center" }}>
            <Table stickyHeader>
              <caption>Reviews Anonymous</caption>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comment</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {reviews.map((list, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{list.rating}</TableCell>
                      <TableCell>
                        {list.comment}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
                
              </TableBody>
            </Table>
          </TableContainer>
                 
                </Box>
                <Card sx={{ maxWidth: 700, minWidth: 400 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="700"
                      image={`https://image.tmdb.org/t/p/w500/${m.poster_path}`}
                      alt="pic of movie"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Streaming:
                      </Typography>
                      {streaminfo.map((s, index) => {
                        return (
                          <Typography variant="body2" color="text.secondary">
                            Streaming Service: {s.service}
                            Type: {s.streamingType}
                          </Typography>
                        );
                      })}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </>
            );
          })}
        </Box>
      </ThemeProvider>
    </>
  );
}
