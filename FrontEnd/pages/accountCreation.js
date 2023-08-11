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

const regex = /^[0-9\b]+$/;

export default function AccountCreation({onSuccess}) {
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


    if(regex.test(formData.age.target.value) === false || formData.age.length === 0)
    {
      console.log('Not a valid age')
    }


    if (formData.password !== formData.repassword) {
      console.log("Passwords do not match");
      return;
    }

    if(formData.email.indexOf('@') === -1 )
    {
      console.log("email must be valid");
    }

    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      console.log(res);
      alert(res.data);
      if (res.data && res.status === 200) {
        if(onSuccess){
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
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'black',
          align: 'center',
          width: '400px',
          borderRadius: 8,
          marginLeft:'auto',
          marginRight:'auto',
        }}
        
      >
        <form onSubmit={CreateAccountAction}>
          <h1  >Create Your Account</h1>
          <p></p>
          <StyledInput id="name" label="Name"  variant="outlined" required onChange={handleChange} />
          <p></p>
          <StyledInput id="age" label="Age" required onChange={handleChange} />
          <p></p>
          <StyledInput id="email" label="Email" required onChange={handleChange} />
          <p></p>
          <StyledInput id="password" label="Password" type="password" required onChange={handleChange} />
          <p></p>
          <StyledInput id="repassword" label="Re-Enter-Password" type="password" required onChange={handleChange} />
          <p></p>
          <Button variant="contained" type="submit" >Create Account</Button>
          <p></p>
          <Button variant="contained" type="submit"  >Already, Have an Account, Login Here</Button>
          <p></p>
        </form>
      </Box>
      </ThemeProvider>
    </>
  );
}

