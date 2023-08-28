import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from "styled-components";
import CircularProgress from "@mui/material";

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

export default function Loadsuggestionapp({setSurveySubmitted}) {
const [loading, setloading] = useState(true);

    const CreateAccountAction = async (event) => {
        event.preventDefault();
        try {
            setloading(true);
            const res = await axios.post(
            "http://localhost:8003/json1load",
            id
            );
            const res2 = await axios.post(
            "http://localhost:8003/json2load",
            id
            );
            const jsonfileresult = res.data;
            const jsonfileresult2 = res2.data;
            setloading(false);
            setjsonfile(jsonfileresult);
            setjsonfile2(jsonfileresult2);
            setSurveySubmitted(true);
            //setjsonfilevar(res.data);
            alert(res2.data);
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
        {loading === true && (
        <Box
          sx={{
            display: "flex",
            marginTop: "1%",
            marginLeft: "54%",
            marginRight: "auto",
            marginBottom: "auto",
          }}
        >
          <CircularProgress />
        </Box>
        )}
        </ThemeProvider>
    </>
  );
}
