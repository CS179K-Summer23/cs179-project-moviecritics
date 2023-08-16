import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";

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

export default function ProfilePage() {

  const [formdata, setformdata] = useState({
    Name: "Filler.name",
    Email: "Filler.email",
    Password: "Filler.password"
    
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const UpdateAccount = async (event) => {
    event.preventDefault();

  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "500px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align='center'>Profile Page</h1>
          <form onSubmit={UpdateAccount}>
          <p></p>
          <StyledInput label="Email" name="email" onChange={handleChange} required value={formdata.Email} variant="outlined" />
          <p></p>
          <StyledInput label="Password" name="Password" onChange={handleChange} required value={formdata.Password} variant="outlined" />
          <p></p>
          <Button variant="contained" type="submit" >Update</Button>
          <p></p>
        </form>
        </Box>
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "500px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align='center'>Watched Movies</h1>
        </Box>
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "500px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align='center'>Reviewed Movies</h1>
        </Box>
      </ThemeProvider>
    </>
  );
}
