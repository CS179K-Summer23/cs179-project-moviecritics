import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";


const StyledInput = styled(TextField)`
  width: 80%;
  & .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: blue;
  }
  align: 'center';
`;


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// const regex = /^[0-9\b]+$/;

export default function AccountCreation({setsignout, setemail, onSuccess}) {
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


    // if(regex.test(formData.age.target.value) === false || formData.age.length === 0)
    // {
      // console.log('Not a valid age')
    // }


    if (formData.password !== formData.repassword) {
      console.log("Passwords do not match");
      return;
    }

    // if(formData.email.indexOf('@') === -1 )
    // {
    //   console.log("email must be valid");
    //   return;
    // }

    

    try {
      const res = await axios.post('http://localhost:8003/signup', formData);
      console.log(res);
      if(res.status === 201){
        if(res.data.message === "User Already Exists"){
          alert("Email already Exists!")
        }
        else{
        alert('Signup Successful');
        const token = res.data.token;
        localStorage.setItem('authToken', token);
        if(onSuccess){
          setemail(formData.email);
          setsignout(false);
          onSuccess();
        }
      }
      }
      else{
        alert('Signup Failed')
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
          backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
          align: 'center',
          width: '650px',
          borderRadius: 5,
          overflow:'hidden',
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
        </form>
      </Box>
      </ThemeProvider>
    </>
  );
}

