import * as React from "react";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.common.black
  }));


const jsonfile1 = [
    {id :1,  Movie:'Movie1',   Genre: 'Genre(s)', Rating: 10.0},
    {id :2,  Movie: 'Movie2',  Genre: 'Genre(s)', Rating: 9.9 },
    {id :3,  Movie: 'Movie3',  Genre: 'Genre(s)', Rating: 9.8 },
    {id :4,  Movie: 'Movie4',  Genre: 'Genre(s)', Rating: 9.7 },
    {id :5,  Movie: 'Movie5',  Genre: 'Genre(s)', Rating: 9.6 },
    {id :6,  Movie: 'Movie6',  Genre: 'Genre(s)', Rating: 9.5 },
    {id :7,  Movie: 'Movie7',  Genre: 'Genre(s)', Rating: 9.4 },
    {id :8,  Movie: 'Movie8',  Genre: 'Genre(s)', Rating: 9.3 },
    {id :9,  Movie: 'Movie9',  Genre: 'Genre(s)', Rating: 9.2 },
    {id :10, Movie: 'Movie10', Genre: 'Genre(s)', Rating: 9.1 },
   
];


export default function MovieshowerFromInterests({jsonfile}) {
  console.log('\n\n\n')
  console.log('this is jsonfile')
  console.log(jsonfile)
  return (
    <>
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <TableContainer>
                <Table stickyHeader >
                <caption>Generated from UserSurvey</caption>
                    <TableHead>
                        <StyledTableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Movie</TableCell>
                            <TableCell>Genre(s)</TableCell>
                            <TableCell>Rating</TableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {jsonfile1.map((list, index) => {
                        return(
                        <TableRow key={index}>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{list.title}</TableCell>
                            <TableCell>{list.genres}</TableCell>
                            <TableCell>{list.vote_average}</TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    </>
  );
}

