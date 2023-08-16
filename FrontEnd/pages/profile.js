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

export default function ProfilePage(email) {

  const [formdata, setformdata] = useState({
    Email: "Filler.email",
    Password: "Filler.password"
    
  });

  const handleChange = (event) => {
    setformdata({
      ...formdata,
      [event.target.id]: event.target.value,
    });
  };

  const UpdateAccount = async (event) => {
    event.preventDefault();

  };

  const LoadProfile = async (event) => {
    event.preventDefault();
    try {
        
        const res = await axios.post(
        "http://localhost:5000/loadprofile",
        email
        );
        setformdata.Password=res.data;
        
        alert(res.data);
        if (res.data && res.status === 200) {
        if (onSuccess) {
            onSuccess();
        }
        }
    } catch (err) {
        console.error(err);
    }
  };

  const SaveProfile = async (event) => {
    event.preventDefault();
    try {
        
        const res = await axios.post(
        "http://localhost:5000/saveprofile",
        formData
        );
        alert(res.data);
        if (res.data && res.status === 200) {
        if (onSuccess) {
            onSuccess();
        }
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
          <Button id="sub_button" variant="contained" type="submit" onClick={SaveProfile} >Update</Button>
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
