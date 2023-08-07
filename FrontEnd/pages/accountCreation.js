import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function AccountCreation() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    repassword: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const CreateAccountAction = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.repassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      console.log(res);
      alert(res.data);
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
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'lightblue',
          align: 'center',
          width: '400px',
          borderRadius: 8,
          marginLeft:'auto',
          marginRight:'auto',
        }}
        
      >
        <form onSubmit={CreateAccountAction}>
          <h1>Create Your Account</h1>
          <p></p>
          <TextField id="name" label="Name" required onChange={handleChange} />
          <p></p>
          <TextField id="age" label="Age" required onChange={handleChange} />
          <p></p>
          <TextField id="email" label="Email" required onChange={handleChange} />
          <p></p>
          <TextField id="password" label="Password" type="password" required onChange={handleChange} />
          <p></p>
          <TextField id="repassword" label="Re-Enter-Password" type="password" required onChange={handleChange} />
          <p></p>
          <Button variant="contained" type="submit">Create Account</Button>
          <p></p>
        </form>
      </Box>
      </ThemeProvider>
    </>
  );
}

