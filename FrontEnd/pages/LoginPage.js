import React, { useState } from "react";
import axios from "axios";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      console.log(res);
      alert(res.data);
      if (res.data && res.status === 200) {
        if (onLogin) {
          onLogin(); // Call the callback function passed to the component
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
          sx={{
            display: "flex",
            marginTop: "10%",
            marginLeft: "45%",
            marginRight: "auto",
            marginBottom: "auto",
            justifyContent: "flex-reverse",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "400px",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleLogin}>
            <h1>Login to Your Account</h1>
            <p></p>
            <StyledInput
              id="email"
              label="Email"
              required
              onChange={handleChange}
            />
            <p></p>
            <StyledInput
              id="password"
              label="Password"
              type="password"
              required
              onChange={handleChange}
            />
            <p></p>
            <Button variant="contained" type="submit">
              Login
            </Button>
            <p></p>
            <Button variant="contained" onClick={onLogin}>
              Don't have an account? Sign Up
            </Button>
            <p></p>
          </form>
        </Box>
      </ThemeProvider>
    </>
  );
}
