import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



export default function MovieInfoApp({moviename}) {
    const [movieinfo, setmovieinfo] = useState({});
    

  const CreateAccountAction = async () => {

    try {
      const res = await axios.post('http://localhost:8002/movieInfo', moviename);
      console.log(res.data);
      setmovieinfo(movieinfo)
      if(res.status === 200){
        
      }
      else{
        alert('Failed to Retrieve')
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />

      <Box
        alignItems={"center"}
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
          borderRadius: 5,
          overflow:'hidden',
        }}
        
      >
        {movieinfo.map((m, index) => {
                  return (
                    
                  );
                })}
        
      </Box>
      </ThemeProvider>
    </>
  );
}

