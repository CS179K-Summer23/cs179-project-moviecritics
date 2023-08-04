import * as React from "react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, FormGroup, FormControlLabel, Checkbox, Dialog, DialogContent, DialogTitle, CssBaseline, FormControl, InputLabel, Select, MenuItem, Box, TextField } from "@mui/material";

export default function AccountCreation() {
    return (
      <>
          <Box sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', }} >

           <TextField margin="normal" required id="namebox" label="Name" autoComplete="name" />
          <p></p>
           <TextField required id="outlined-required" label="Required" defaultValue="Age" />
           <p></p>
           <TextField required id="outlined-required" label="Required" defaultValue="Email" />
           <p></p>
           <TextField required id="outlined-required" label="Required" defaultValue="Password" />
           <p></p>
           <TextField required id="outlined-required" label="Required" defaultValue="Re-Enter Password"/>
           <p></p>
          <Button variant="contained">Create Account</Button>


          </Box>
           
      </>
    );
  }