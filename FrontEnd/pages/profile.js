import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

let watchedlist = [
  { id: 1, title: "Movie1" },
  { id: 2, title: "Movie2" },
  { id: 3, title: "Movie3" },
  { id: 4, title: "Movie4" },
  { id: 5, title: "Movie5" },
  { id: 6, title: "Movie6" },
  { id: 7, title: "Movie7" },
  { id: 8, title: "Movie8" },
  { id: 9, title: "Movie9" },
  { id: 10, title: "Movie10" },
];

export default function ProfilePage(email) {
  const [formdata, setformdata] = useState({
    Email: "Filler.email",
    Password: "Filler.password",
  });

  const handleChange = (event) => {
    setformdata({
      ...formdata,
      [event.target.id]: event.target.value,
    });
  };

  const UpdateAccount = async (event) => {
    event.preventDefault();
  };

  const SaveProfile = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8002/saveprofile",
        formData
      );
      alert(res.data);
      if (res.data && res.status === 200) {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getWatched = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:8002/getwatched", email);
      watchedlist = res.data;

      alert(res.data);
      if (res.data && res.status === 200) {
        if (onSuccess) {
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
          <form onSubmit={UpdateAccount}>
            <p></p>
            <StyledInput
              label="Email"
              name="email"
              onChange={handleChange}
              required
              value={formdata.Email}
              variant="outlined"
            />
            <p></p>
            <StyledInput
              label="Password"
              name="Password"
              onChange={handleChange}
              required
              value={formdata.Password}
              variant="outlined"
            />
            <p></p>
            <Button
              id="sub_button"
              variant="contained"
              type="submit"
              onClick={SaveProfile}
            >
              Update
            </Button>
            <p></p>
          </form>
        </Box>
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
          <h1 align="center">My Recommendation of Movies</h1>
          {watchedlist.map((list, index) => {
            return (
              <>
                <h3>
                  {index + 1} {list.title}
                </h3>
              </>
            );
          })}
          ;
        </Box>
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
          <h1 align="center">Reviewed Movies</h1>
        </Box>
      </ThemeProvider>
    </>
  );
}
