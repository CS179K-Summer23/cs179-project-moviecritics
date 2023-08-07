import * as React from "react";
import { useState } from "react";
import axios from "axios";
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

var jsonfile = {Sample : '123'};

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

export default function UserSurveyApp({onSuccess}) {

  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState({
    Adventure: false,
    Animation: false,
    Biogrphy: false,
    Comedy: false,
    Crime: false,
    Documentry: false,
    Horror: false,
    Mystery: false,
    Thriller: false,
    War: false,
  });

  const handlePreferenceChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedCount = Object.values(preferences).filter(Boolean).length;
    var genres; 
    if (selectedCount === 5) {
      console.log(genres);
      console.log(preferences);
      setOpen(false);
    } else {
      // Display error message
      alert("Please select exactly 5 movie genres.");
    }

    try {
      const res = await axios.post('http://localhost:5000/usersurvey', preferences);
      jsonfile = res.data;

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
  control={<Checkbox checked={preferences.Biogrphy} onChange={handlePreferenceChange} name="Biogrphy" />}
  label="Biography"
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
  control={<Checkbox checked={preferences.Horror} onChange={handlePreferenceChange} name="Horror" />}
  label="Horror"
  sx={{ fontSize: 20, my: 1 }}
/>
<FormControlLabel
  control={<Checkbox checked={preferences.Mystery} onChange={handlePreferenceChange} name="Mystery" />}
  label="Mystery"
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