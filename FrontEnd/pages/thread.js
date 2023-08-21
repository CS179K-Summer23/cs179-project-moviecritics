import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const lightTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Threadlist() {
  const onSubmit = (e) => {
    e.preventDefault();
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            marginTop: 8,
            display: "flex",
            backgroundColor: "black",
            align: "center",
            width: "250px",
            borderRadius: 8,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1>Movie Lists</h1>
        </Box>
        {/* {lists.map((list, index) => { */}
          {/* return ( */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                display: "flex",
                marginTop: 5,
                marginLeft: "38%",
                marginRight: "auto",
                marginBottom: "auto",
                justifyContent: "flex",
                flexDirection: "row",
                backgroundColor: "black",
                align: "center",
                width: "30%",
                height: "100px",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <ListIcon />
              <Button
                variant="outlined"
                style={{
                  maxWidth: "500px",
                  maxHeight: "100px",
                  minWidth: "500px",
                  minHeight: "100px",
                }}
                onClick={handleClickOpen}
              >
                {/* {list.user} */}
                list1
              </Button>
              <Dialog open={open} onClose={handleClose}>
              <DialogTitle>list1</DialogTitle>
                {/* <DialogTitle>{list.user}</DialogTitle> */}
                <DialogContent>
                  <DialogContentText>________List:_________</DialogContentText>
                  <DialogContentText>Movie 1</DialogContentText>
                  <DialogContentText>Movie 2</DialogContentText>
                  <DialogContentText>Movie 3</DialogContentText>
                  <DialogContentText>Movie 4</DialogContentText>
                  <DialogContentText>Movie 5</DialogContentText>
                  <DialogContentText>Movie 6</DialogContentText>
                  <DialogContentText>Movie 7</DialogContentText>
                  <DialogContentText>Movie 8</DialogContentText>
                  <DialogContentText>Movie 9</DialogContentText>
                  <DialogContentText>Movie 10</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>
      </ThemeProvider>
    </>
  );
}
