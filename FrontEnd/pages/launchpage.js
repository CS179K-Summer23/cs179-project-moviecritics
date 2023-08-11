import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, useNavigate  } from "react-router-dom";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";
import Link from "@mui/material";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";


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

export default function LaunchPage({setjsonfile}) {

  const [buttonstate, setbuttonstate] = useState(0);

  const [accountCreated, setAccountCreated] = useState(false);

  const [surveySubmitted, setSurveySubmitted] = useState(false);
 // const [jsonfilevar, setjsonfilevar] = useState(null);

  const handleAccountCreationSuccess = () => {
    setAccountCreated(true);
  };

  const handlesurverySubmit = () => {
    setSurveySubmitted(true);
  };
    
      const onSubmit = e => {
        e.preventDefault();
        if (buttonstate === 1) {
          console.log("Create Account");
        }
        if (buttonstate === 2) {
          console.log("Login Account");
        }
      };

  
  return (
    <>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />

      <Box
        sx={{
          display:'flex',
          marginTop: 8,
          marginLeft:'auto',
          marginRight:'auto',
          justifyContent: 'flex-reverse',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'black',
          align: 'center',
          width: '400px',
          borderRadius: 3,
          marginLeft:'auto',
          marginRight:'auto',
          marginBottom:'auto',
          overflow:'hidden',
          width:'400px'
        }}
        
      >
    <form  onSubmit={onSubmit}>
    <h1>Welcome to MovieCritic!</h1>
      <Button
        onClick={() => (setbuttonstate(1))}
        type="submit"
        name="btn1"
        value="create"
      >
        Create Account
      </Button>
      <Button
        onClick={() => (setbuttonstate(2))}
        type="submit"
        name="btn2"
        value="login"
        style={{
          marginLeft:'auto', //ALLIGN THIS LATER
          
        }}
      >
        Login Account
      </Button>
    </form>
      </Box>
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
        
        {buttonstate===1 && !accountCreated && (<><AccountCreation onSuccess={handleAccountCreationSuccess} /> </>)}
        {buttonstate===1 && accountCreated && (<><UserSurveyApp  setjsonfile={setjsonfile}  onSuccess={handlesurverySubmit} /></>) }
        {buttonstate===2}
        
      </Box>
      </ThemeProvider>
    </>
  );
}

