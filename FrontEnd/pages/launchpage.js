import * as React from "react";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";
import Login from "./LoginPage";
<<<<<<< Updated upstream
import Loadsuggestionapp from "./LoaderSuggestions";
=======
import MainApp from "./main"
>>>>>>> Stashed changes


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

export default function LaunchPage({setsignout, setemail, setjsonfile, setSurveySubmitted, setjsonfile2}) {

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
          backgroundColor: 'black',
          align: 'center',
          width: '500px',
          borderRadius: 3,
          overflow:'hidden',
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
          marginLeft:'auto',
          
        }}
      >
        Login Account
      </Button>
    </form>
      </Box>
        
        {buttonstate===1 && !accountCreated && (<><AccountCreation setsignout={setsignout} onSuccess={handleAccountCreationSuccess} setemail={setemail} /> </>)}
        {buttonstate===1 && accountCreated && (<><UserSurveyApp  setjsonfile={setjsonfile} setjsonfile2={setjsonfile2} onSuccess={handlesurverySubmit} /></>) }
        {buttonstate===2 && !onLogin && (<> <Login setsignout={setsignout} onLogin={handleLoginSuccess} setemail={setemail}/> </>)}
        {buttonstate===2 && onLogin && (<> <Loadsuggestionapp setjsonfile={setjsonfile} setjsonfile2={setjsonfile2} setSurveySubmitted={setSurveySubmitted} /> </>)}
        {buttonstate===3}
        
      </ThemeProvider>
    </>
  );
}

