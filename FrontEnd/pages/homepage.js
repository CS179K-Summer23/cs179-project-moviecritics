import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";

//use this with variant="outlined"
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
    mode: 'dark',
  },
});

export default function LaunchPage({setAccountForm}) {

    const state = {
        button: 1
      };
    
      const onSubmit = e => {
        e.preventDefault();
        if (state.button === 1) {
          console.log("Create Account");
          setAccountForm=('create');
        }
        if (state.button === 2) {
          console.log("Login Account");
          setAccountForm=('login');
        }
      };

  
  return (
    <>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'black',
          align: 'center',
          width: '400px',
          borderRadius: 8,
          marginLeft:'auto',
          marginRight:'auto',
          marginBottom:'auto'
        }}
        
      >
    <form  onSubmit={onSubmit}>
    <h1>Welcome to MovieCritic!</h1>
      <Button
        onClick={() => (state.button = 1)}
        type="submit"
        name="btn1"
        value="create"
      >
        Create Account
      </Button>
      <Button
        onClick={() => (state.button = 2)}
        type="submit"
        name="btn2"
        value="login"
      >
        Login Account
      </Button>
    </form>
      </Box>
      </ThemeProvider>
    </>
  );
}

