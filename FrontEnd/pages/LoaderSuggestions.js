import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";
import CircularProgress from "@mui/material";

const StyledInput = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: blue;
  }
`;


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Loadsuggestionapp({setSurveySubmitted}) {
const [loading, setloading] = useState(true);

    const loadsug = async (event) => {
        event.preventDefault();
        try {
            setloading(true);
            setSurveySubmitted(true);
            setloading(false);
            //setjsonfilevar(res.data);
            alert(res2.data);
           
        } catch (err) {
            console.error(err);
        }
    };


  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {loading === true && (
        <Box
          sx={{
            display: "flex",
            marginTop: "1%",
            marginLeft: "54%",
            marginRight: "auto",
            marginBottom: "auto",
          }}
        >
          <CircularProgress />
        </Box>
        )}
        </ThemeProvider>
    </>
  );
}
