import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";


const lightTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ProfilePage() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            align: "center",
            width: "900px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1>Profile Page</h1>
        </Box>
      </ThemeProvider>
    </>
  );
}
