import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
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
  const [jsonchoose, setjsonchoose] = React.useState('Test');
  const [listchoose, setlistchoose] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [lists, setLists] = React.useState(['0', '1', '2', '3']);
  const [movielists, setmovielists] = React.useState(['movie1', 'movie3', 'movie2', 'movie3']);
  const [boolval, setboolval] = React.useState(false);

  const handleClickOpen = () => {
    getUsers();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setboolval(false);
  };

  const handleViewList = temp => {
    setlistchoose(temp);
    console.log(temp);
    setboolval(true);
    setjsonchoose(temp);
    getList();
  };

  const getUsers = async () => {

    try {
      const res = await axios.post('http://localhost:8003/getusers');
      console.log(res.data);
      console.log('here')
      setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const getList = async () => {

    try {
      console.log(listchoose)
      console.log(jsonchoose)
      const res = await axios.post(`http://localhost:8003/getlist?jsonchoose=${jsonchoose}`);
      console.log('Here is listchoose')
      console.log(listchoose)
      console.log(res.data);
      setmovielists(res.data);
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
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "auto",
                justifyContent: "flex",
                flexDirection: "row",
                backgroundColor: "black",
                align: "center",
                width: "50%",
                height: "100px",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <ListIcon />
              <Button
                variant="outlined"
                style={{
                  maxWidth: "800px",
                  maxHeight: "100px",
                  minWidth: "800px",
                  minHeight: "100px",
                }}
                id={list.title}
                onClick={() => handleViewList(list.title) }
              >
                {list.title}
              </Button>
            </Box>
          );
        })}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{listchoose} 's Watched List</DialogTitle>
          <DialogContent>
            <DialogContentText>________List:_________</DialogContentText>
            {movielists.map((m, index) => {
                  return (
            <DialogContentText>{m}</DialogContentText>
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
