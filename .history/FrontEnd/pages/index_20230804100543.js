import * as React from "react";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, FormGroup, FormControlLabel, Checkbox, Dialog, DialogContent, DialogTitle, CssBaseline, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

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

const movieData = {
  horror: ["Movie 1", "Movie 2", "Movie 3"],
  comedy: ["Movie A", "Movie B", "Movie C"],
  romance: ["Movie X", "Movie Y", "Movie Z"],
  scifi: ["Movie P", "Movie Q", "Movie R"],
  drama: ["Movie M", "Movie N", "Movie O"],
};

export default function Home() {
  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState({
    horror: false,
    comedy: false,
    romance: false,
    scifi: false,
    drama: false,
  });
  const [selectedMovies, setSelectedMovies] = useState([]);

  const handlePreferenceChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  const handleMovieSelectChange = (event) => {
    setSelectedMovies(event.target.value);
  };

  const handleSubmit = () => {
    console.log(preferences);
    console.log(selectedMovies);
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        User Preference Survey
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>Movie Genre Survey</DialogTitle>
        <DialogContent sx={{ minWidth: 400, minHeight: 250, borderRadius: 20, p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={preferences.horror} onChange={handlePreferenceChange} name="horror" />}
                label="Horror"
                sx={{ fontSize: 20, my: 1 }}

              />
              {preferences.horror && (
                <FormControl fullWidth sx={{ mt: 4 }}>
                  <InputLabel sx={{ fontSize: 18 }}>Select a Horror Movie</InputLabel>
                  <Select
                    multiple
                    value={selectedMovies}
                    onChange={handleMovieSelectChange}
                    sx={{ fontSize: 10, padding: 2 }}
                  >
                    {movieData.horror.map((movie) => (
                      <MenuItem key={movie} value={movie}>
                        {movie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

<FormControlLabel
                control={<Checkbox checked={preferences.comedy} onChange={handlePreferenceChange} name="comedy" />}
                label="Comedy"
                sx={{ fontSize: 20, my: 1 }}
              />
              {preferences.comedy && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ fontSize: 18 }}>Select a Comedy Movie</InputLabel>
                  <Select
                    multiple
                    value={selectedMovies}
                    onChange={handleMovieSelectChange}
                    sx={{ fontSize: 16, padding: 2 }}
                  >
                    {movieData.comedy.map((movie) => (
                      <MenuItem key={movie} value={movie}>
                        {movie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={<Checkbox checked={preferences.romance} onChange={handlePreferenceChange} name="romance" />}
                label="Romance"
                sx={{ fontSize: 20, my: 1 }}
              />
              {preferences.romance && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ fontSize: 18 }}>Select a Romance Movie</InputLabel>
                  <Select
                    multiple
                    value={selectedMovies}
                    onChange={handleMovieSelectChange}
                    sx={{ fontSize: 16, padding: 2 }}
                  >
                    {movieData.romance.map((movie) => (
                      <MenuItem key={movie} value={movie}>
                        {movie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={<Checkbox checked={preferences.scifi} onChange={handlePreferenceChange} name="scifi" />}
                label="Sci-fi"
                sx={{ fontSize: 20, my: 1 }}
              />
              {preferences.scifi && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ fontSize: 18 }}>Select a Sci-fi Movie</InputLabel>
                  <Select
                    multiple
                    value={selectedMovies}
                    onChange={handleMovieSelectChange}
                    sx={{ fontSize: 16, padding: 2 }}
                  >
                    {movieData.scifi.map((movie) => (
                      <MenuItem key={movie} value={movie}>
                        {movie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={<Checkbox checked={preferences.drama} onChange={handlePreferenceChange} name="drama" />}
                label="Drama"
                sx={{ fontSize: 20, my: 1 }}
              />
              {preferences.drama && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ fontSize: 18 }}>Select a Drama Movie</InputLabel>
                  <Select
                    multiple
                    value={selectedMovies}
                    onChange={handleMovieSelectChange}
                    sx={{ fontSize: 16, padding: 2 }}
                  >
                    {movieData.drama.map((movie) => (
                      <MenuItem key={movie} value={movie}>
                        {movie}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </FormGroup>

            <Button variant="contained" color="secondary" onClick={handleSubmit} sx={{ textAlign: "center", mt: 5 }}>
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
