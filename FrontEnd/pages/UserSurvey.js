import * as React from "react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  Box,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue color for primary elements
    },
    secondary: {
      main: "#d32f2f", // Red color for secondary elements
    },
  },
});

export default function Home() {
  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState({
    Action: false,
    Adventure: false,  
    Animation: false,           
    Comedy: false,             
    Crime: false,              
    Documentary: false,         
    Drama: false,           
    Family: false,              
    Fantasy: false,             
    History: false,             
    Horror: false,             
    Music: false,               
    Mystery: false,            
    Romance: false,            
    ScienceFiction: false,     
    TVMovie:  false,            
    Thriller: false,           
    War: false,                 
    Western: false,             
  });
  const handlePreferenceChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = () => {
    const selectedCount = Object.values(preferences).filter(Boolean).length;

    if (selectedCount === 5) {
      console.log(preferences);
      setOpen(false);
    } else {
      // Display error message
      alert("Please select exactly 5 movie genres.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        User Preference Survey
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ textAlign: "center", marginBottom: "-16px", fontSize: "20px" }}>
          Movie Genre Survey
        </DialogTitle>
        <DialogContent sx={{ minHeight: 250, borderRadius: 20, p: 2 }}>
       < FormGroup>
       <FormControlLabel
  control={<Checkbox checked={preferences.Action} onChange={handlePreferenceChange} name="Action" />}
  label="Action"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Adventure} onChange={handlePreferenceChange} name="Adventure" />}
  label="Adventure"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Animation} onChange={handlePreferenceChange} name="Animation" />}
  label="Animation"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Comedy} onChange={handlePreferenceChange} name="Comedy" />}
  label="Comedy"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Crime} onChange={handlePreferenceChange} name="Crime" />}
  label="Crime"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Documentry} onChange={handlePreferenceChange} name="Documentry" />}
  label="Documentry"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Drama} onChange={handlePreferenceChange} name="Drama" />}
  label="Drama"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Family} onChange={handlePreferenceChange} name="Family" />}
  label="Family"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Fantasy} onChange={handlePreferenceChange} name="Fantasy" />}
  label="Fantasy"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.History} onChange={handlePreferenceChange} name="History" />}
  label="History"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Horror} onChange={handlePreferenceChange} name="Horror" />}
  label="Horror"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Music} onChange={handlePreferenceChange} name="Music" />}
  label="Music"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Mystery} onChange={handlePreferenceChange} name="Mystery" />}
  label="Mystery"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Romance} onChange={handlePreferenceChange} name="Romance" />}
  label="Romance"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.ScienceFiction} onChange={handlePreferenceChange} name="Science Fiction" />}
  label="science Fiction"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.TvMovie} onChange={handlePreferenceChange} name="TV Movie" />}
  label="TV movie"
  sx={{ fontSize: 20, my: 1 }}
/>
  <FormControlLabel
  control={<Checkbox checked={preferences.Thriller} onChange={handlePreferenceChange} name="Thriller" />}
  label="Thriller"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.War} onChange={handlePreferenceChange} name="War" />}
  label="War"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.western} onChange={handlePreferenceChange} name="Western" />}
  label="Western"
  sx={{ fontSize: 20, my: 1 }}
/>
</FormGroup>

          <Box sx={{ textAlign: "center", fontSize: "14px", color: "gray", mt: 2 }}>
            * Please select at least 5 and at most 5 movie genres.
          </Box>
          <Button variant="contained" color="secondary" onClick={handleSubmit} sx={{ textAlign: "center", mt: 3 }}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
