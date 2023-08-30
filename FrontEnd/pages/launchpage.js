import * as React from "react";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";
import Login from "./LoginPage";
import Loadsuggestionapp from "./LoaderSuggestions";
import MainApp from "./main"


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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url("movies.jpg")', // Replace with the actual path
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // Optional: You can remove this line if you don't want a fixed background
          /* ... (Other body styles you want) */
        },
      },
    },
  },
});


export default function LaunchPage({setsignout, setemail, setSurveySubmitted}) {

  const [buttonstate, setbuttonstate] = useState(0);
  const [onLogin, setonLogin] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false);
  


  const handleLoginSuccess = () => {
    
    setonLogin(true);
  };

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

    


      <Box  display="flex" justifyContent="center" alignItems="center"
        sx={{
          display:'flex',
          marginTop: '5%',
          marginLeft:'45%',
          marginRight:'auto',
          marginBottom:'auto',
          justifyContent: 'flex-reverse',
          flexDirection: 'column',
          backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
          align: 'center',
          width: '650px',
          height: '300px',
          borderRadius: 3,
          overflow:'hidden',
        }}
        
      >
        <img src="/movie_logo(1).png" alt="movie" width="400" height="200"
  style={{
    display: 'block', // This ensures that the image is treated as a block element
    margin: '0 auto', // This centers the image horizontally
  }}
/>
       

    <form  onSubmit={onSubmit}>
    
      <Button
        onClick={() => (setbuttonstate(1))}
        type="submit"
        name="btn1"
        value="create"
        style={{
          fontSize: '30px',// Adjust the font size as needed
          marginBottom: 'auto',
        }}
      >
        Create Account
      </Button>
      <Button
        onClick={() => (setbuttonstate(2))}
        type="submit"
        name="btn2"
        value="login"
        style={{
          marginLeft:'auto',
          fontSize: '30px',
          marginBottom: 'auto',
        }}
      >
        Login Account
      </Button>
    </form>
      </Box>
        
        {buttonstate===1 && !accountCreated && (<><AccountCreation setsignout={setsignout} onSuccess={handleAccountCreationSuccess} setemail={setemail} /> </>)}
        {buttonstate===1 && accountCreated && (<><UserSurveyApp   onSuccess={handlesurverySubmit} /></>) }
        {buttonstate===2 && !onLogin && (<> <Login setsignout={setsignout} onLogin={handleLoginSuccess} setemail={setemail} setSurveySubmitted={setSurveySubmitted}/> </>)}
        {buttonstate===3}
        
      </ThemeProvider>
    </>
  );
}

