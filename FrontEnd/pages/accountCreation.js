import * as React from "react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, FormGroup, FormControlLabel, Checkbox, Dialog, DialogContent, DialogTitle, CssBaseline, FormControl, InputLabel, Select, MenuItem, Box, TextField } from "@mui/material";

export default function AccountCreation() {
    
  const CreateAccountAction = (event) => {
    console.log({
      //email: document.getElementById ("emailbox").value,
      //password:document.getElementById ("passwordbox").value
    });
  };
  
  return (
      <>
          <FormGroup>
          <Box sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'lightblue',
              width:'500px',
              align:'center', onSubmit:{CreateAccountAction} }} >
          
            <TextField margin="normal" required id="namebox" label="Name" autoComplete="name" />
          <p></p>
          <TextField margin="normal" required id="agebox" label="Age" autoComplete="Age" />
           <p></p>
           <TextField margin="normal" required id="emailbox" label="Email" autoComplete="Email" />
           <p></p>
           <TextField margin="normal" required id="passwordbox" label="Password" autoComplete="Password" />
           <p></p>
           <TextField margin="normal" required id="repasswordbox" label="Re-Enter-Password" autoComplete="Re-Enter-Password" />
           <p></p>
          <Button variant="contained" type="submit" onClick={CreateAccountAction} >Create Account</Button>
          </Box>
          </FormGroup>
      </>
    );
  }