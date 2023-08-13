import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
    id: 1, Movie: "Movie1", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 2, Movie: "Movie2", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 3, Movie: "Movie3", Revenue: "$200 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 4, Movie: "Movie4", Revenue: "$250 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 5, Movie: "Movie5", Revenue: "$300 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 6, Movie: "Movie6", Revenue: "350 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 7, Movie: "Movie7", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 8, Movie: "Movie8", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 9, Movie: "Movie9", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 10, Movie: "Movie10", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },

  {
    id: 11, Movie: "Movie11", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 12, Movie: "Movie12", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 13, Movie: "Movie13", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 14, Movie: "Movie14", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 15, Movie: "Movie15", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 16, Movie: "Movie16", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 17, Movie: "Movie17", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 18, Movie: "Movie18", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
  {
    id: 19, Movie: "Movie19", Revenue: "$100 million", ReleaseDate: "2023-01-15",
  },
  {
    id: 20, Movie: "Movie20", Revenue: "$150 million", ReleaseDate: "2023-02-20",
  },
];

export default function MovieRatings({jsonfile2}) {
  console.log('break');
  console.log(jsonfile2);
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <TableContainer>
          <Table stickyHeader>
            <caption>Generated from Movie Rating</caption>
            <TableHead>
              <StyledTableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Movie Title</TableCell>
                <TableCell>Genres</TableCell>
                <TableCell>Release Date</TableCell>
                <TableCell>Votes</TableCell>
                <TableCell>Rating</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {jsonfile2.map((movie, index) => {
                return(
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.genres}</TableCell>
                  <TableCell>{movie.vote_count}</TableCell>
                  <TableCell>{movie.vote_average}</TableCell>
                  <TableCell>{movie.release_date}</TableCell>
                </TableRow>
                );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
}
