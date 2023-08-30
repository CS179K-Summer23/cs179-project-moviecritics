import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
}));

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

const watchedlist1 = [
  "test1","test2"
];

const revlist1 = [
  { id: 1, title: "Movie1", rating: "8", comment: "test1" },
  { id: 2, title: "Movie2", rating: "9", comment: "test2" },
];
export default function ProfilePage(email) {
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
  const [watchedlist, setwatchedlist] = useState(watchedlist1);
  const [revlist, setrevlist] = useState(revlist1);
  const [open, setOpen] = useState(false);
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
    TVMovie: false,
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

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(formData)

    try {
      const res = await axios.post("http://localhost:8003/updateaccount", formData, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      } );
      console.log(res);
      alert(res.data);
     
      if (res.data && res.status === 200) {
        setSurveySubmitted(true);
        const token = res.data.token;
        localStorage.setItem('authToken', token);
        if (onLogin) {
          setemail(formData.email);
          setsignout(false);
          onLogin(); // Call the callback function passed to the component
        }
      }
    } catch (err) {
      alert("Invalid username or password. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    //event.preventDefault();

    const selectedCount = Object.values(preferences).filter(Boolean).length;
    console.log(selectedCount);
    if (selectedCount === 5) {
      console.log(preferences);
      setOpen(false);
      try {
        
        const res = await axios.post(
          "http://localhost:8003/usersurveyupdate",
          preferences,
          {
            headers: {
              Authorization: localStorage.getItem("authToken"),
            },
          }
        );

        if (res.data && res.status === 200) {
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Display error message
      alert("Please select exactly 5 movie genres.");
    }
  };


  


  const getWatched = async (event) => {
    try {
      const res = await axios.post(
        "http://localhost:8003/getwatched",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      setwatchedlist(res.data);
      console.log("getwatched");
      console.log(res.data);

      if (res.data && res.status === 200) {
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getReviews = async (event) => {
    try {
      const res = await axios.post(
        "http://localhost:8003/getreviews",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      setrevlist(res.data);

      if (res.data && res.status === 200) {
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWatched();
    getReviews();
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "500px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align="center">Profile Page</h1>
          <form onSubmit={handleLogin}>
            <p></p>
            <StyledInput
              label="Email"
              name="email"
              id="email"
              onChange={handleChange}
              required
              variant="outlined"
            />
            <p></p>
            <StyledInput
            id = "password"
              label="Password"
              name="password"
              onChange={handleChange}
              required
              variant="outlined"
            />
            <p></p>
            <Button
              id="sub_button"
              variant="contained"
              type="submit"
              onClick={handleLogin}
            >
              Update
            </Button>
            <p></p>
          </form>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginTop: "5%",
            marginLeft: "42%",
            marginRight: "auto",
            marginBottom: "auto",
          }}
        >
          <Button variant="contained" onClick={() => setOpen(true)}>
            Retake User Preference Survey
          </Button>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle
            sx={{
              textAlign: "center",
              marginBottom: "-16px",
              fontSize: "20px",
            }}
          >
            Updare Genre Preference
          </DialogTitle>
          <DialogContent sx={{ minHeight: 250, borderRadius: 20, p: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Action}
                    onChange={handlePreferenceChange}
                    name="Action"
                  />
                }
                label="Action"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Adventure}
                    onChange={handlePreferenceChange}
                    name="Adventure"
                  />
                }
                label="Adventure"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Animation}
                    onChange={handlePreferenceChange}
                    name="Animation"
                  />
                }
                label="Animation"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Comedy}
                    onChange={handlePreferenceChange}
                    name="Comedy"
                  />
                }
                label="Comedy"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Crime}
                    onChange={handlePreferenceChange}
                    name="Crime"
                  />
                }
                label="Crime"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Documentary}
                    onChange={handlePreferenceChange}
                    name="Documentary"
                  />
                }
                label="Documentary"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Drama}
                    onChange={handlePreferenceChange}
                    name="Drama"
                  />
                }
                label="Drama"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Family}
                    onChange={handlePreferenceChange}
                    name="Family"
                  />
                }
                label="Family"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Fantasy}
                    onChange={handlePreferenceChange}
                    name="Fantasy"
                  />
                }
                label="Fantasy"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.History}
                    onChange={handlePreferenceChange}
                    name="History"
                  />
                }
                label="History"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Horror}
                    onChange={handlePreferenceChange}
                    name="Horror"
                  />
                }
                label="Horror"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Music}
                    onChange={handlePreferenceChange}
                    name="Music"
                  />
                }
                label="Music"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Mystery}
                    onChange={handlePreferenceChange}
                    name="Mystery"
                  />
                }
                label="Mystery"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Romance}
                    onChange={handlePreferenceChange}
                    name="Romance"
                  />
                }
                label="Romance"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.ScienceFiction}
                    onChange={handlePreferenceChange}
                    name="ScienceFiction"
                  />
                }
                label="ScienceFiction"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.TvMovie}
                    onChange={handlePreferenceChange}
                    name="TV Movie"
                  />
                }
                label="TV movie"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.Thriller}
                    onChange={handlePreferenceChange}
                    name="Thriller"
                  />
                }
                label="Thriller"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.War}
                    onChange={handlePreferenceChange}
                    name="War"
                  />
                }
                label="War"
                sx={{ fontSize: 20, my: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.western}
                    onChange={handlePreferenceChange}
                    name="Western"
                  />
                }
                label="Western"
                sx={{ fontSize: 20, my: 1 }}
              />
            </FormGroup>

            <Box
              sx={{
                textAlign: "center",
                fontSize: "14px",
                color: "gray",
                mt: 2,
              }}
            >
              * Please select at least 5 and at most 5 movie genres.
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ textAlign: "center", mt: 3 }}
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "500px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align="center">My Watchlist of Movies</h1>
          {watchedlist.map((l, index) => {
            return (
              <>
                <Typography
                  
                  sx={{ marginBottom: 2, color: "white" }}
                >
                  {l}
                </Typography>
              </>
            );
          })}
        </Box>
        <Box
          alignItems={"center"}
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "800px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1 align="center">Reviewed Movies</h1>
          <TableContainer style={{ width: "70%", textAlign: "center" }}>
            <Table stickyHeader>
              <caption>Reviews Anonymous</caption>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Movie</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comment</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {revlist.map((r, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{r.title}</TableCell>
                      <TableCell>{r.rating}</TableCell>
                      <TableCell>{r.comment}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ThemeProvider>
    </>
  );
}
