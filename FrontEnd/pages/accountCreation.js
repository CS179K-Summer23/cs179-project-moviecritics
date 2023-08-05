import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";

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
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'lightblue',
          width: '500px',
          align: 'center',
        }}
      >
        <form onSubmit={CreateAccountAction}>
          <TextField id="name" label="Name" required onChange={handleChange} />
          <TextField id="age" label="Age" required onChange={handleChange} />
          <TextField id="email" label="Email" required onChange={handleChange} />
          <TextField id="password" label="Password" type="password" required onChange={handleChange} />
          <TextField id="repassword" label="Re-Enter-Password" type="password" required onChange={handleChange} />
          <Button variant="contained" type="submit">Create Account</Button>
        </form>
      </Box>
    </>
  );
}
