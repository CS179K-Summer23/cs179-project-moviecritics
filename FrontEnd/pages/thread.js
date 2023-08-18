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
        <Box display="flex" justifyContent="center" alignItems="center"
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
        <Box display="flex" justifyContent="center" alignItems="center"
          sx={{
            display: "flex",
            marginTop: 5,
            marginLeft: "10%",
            marginRight: "auto",
            marginBottom: "auto",
            justifyContent: "flex",
            flexDirection: "row",
            backgroundColor: "black",
            align: "left",
            width: "30%",
            height: "100px",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
            <ListIcon/>
          <Button variant="outlined" style={{maxWidth: '500px', maxHeight: '100px', minWidth: '500px', minHeight: '100px'}} onClick={handleClickOpen}>
            User1 List
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>User1 List</DialogTitle>
            <DialogContent>
              <DialogContentText>
                List:
              </DialogContentText>
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
