import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const jsonfile1 = [
  {'title': 'The Kid', 'genre': 'Comedy-Drama', 'vote_count': 1758.0, 'vote_average': 8.212, 'rated': 'PG', 'backdrop_path': '/mAhCW7QbpL5kwvCWGsfyY3ILoW6.jpg', 'poster_path': '/drgMcyTsySQBnUPGaBThCHGdlWT.jpg'}
 
  
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90,editable: false },
  {
    field: 'Rating',
    headerName: 'Rating',
    width: 100,
    editable: false,
  },
  {
    field: 'Comment',
    headerName: 'Comment',
    width: 1100,
    editable: false,
  }
  
];

const rows = [
  { id: 1,  },
  { id: 2,  },
  { id: 3,  },
  { id: 4,  },
  { id: 5,  },
  { id: 6, },
  { id: 7, },
  { id: 8,  },
  { id: 9, },
];

export default function MovieInfoApp({ moviename }) {
  const [movieinfo, setmovieinfo] = useState(jsonfile1);
  const [reviews, setreviews] = useState([]);
  const [streaminfo, setstreaminfo] = useState({});

  const moviedata = async () => {
    try {
      console.log(moviename)
      const res = await axios.post(
        `http://localhost:8003/movieInfo?moviename=${moviename}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem('authToken')
          }
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
        `http://localhost:8003/reviews?moviename=${moviename}`, {},
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
        `http://localhost:8003/streaminfo?moviename=${moviename}`, {},
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

  useEffect(() => {
    moviedata();
    revmovie();
    //getstream();
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
              <Card sx={{ maxWidth: 700 ,minWidth: 400 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image= {`https://image.tmdb.org/t/p/w500/${m.poster_path}`}
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
               <Box alignItems={"left"} sx={{  marginLeft: "1%", height: 400, width: '100%' }}>
               <DataGrid
                 rows={rows}
                 columns={columns}
                 initialState={{
                   pagination: {
                     paginationModel: {
                       pageSize: 5,
                     },
                   },
                 }}
                 pageSizeOptions={[5]}
                 checkboxSelection
                 disableRowSelectionOnClick
               />
             </Box>
             </>
            );
          })}
        </Box>
      </ThemeProvider>
    </>
  );
}
