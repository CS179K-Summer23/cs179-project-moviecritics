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

  const [listchoose, setlistchoose] = React.useState();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewList = temp => {
    setlistchoose(temp);
    getList();
  };

  const getUsers = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post('http://localhost:8002/getusers');
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


  const getList = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post('http://localhost:8002/getlist', listchoose);
      console.log(res.data);
      movielists = res.data;
      setOpen(true);
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

  useEffect(() => {
    getUsers();
  }, []);

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
        {lists.map((list, index) => {
          return (
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
                onClick={() => handleViewList(list.user)}
              >
                {list.user}
              </Button>
            </Box>
          );
        })}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{listchoose}</DialogTitle>
          <DialogContent>
            <DialogContentText>________List:_________</DialogContentText>
            {movielists.map((m, index) => {
                  return (
            <DialogContentText>{m.title}</DialogContentText>
            );
          })}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
