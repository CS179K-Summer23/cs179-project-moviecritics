import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LaunchPage from "./launchpage";
import MainApp from "./main";


const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F8F9FA" },
    secondary: {
      main: "#010203",
      contrastText: "#F8F9FA",
    },
    IconButton: {
      main: "#008000",
    },
  },
});

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    if (accountCreated) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [signout, setsignout] = useState(true);
  const [email, setemail] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const [accountCreated, setAccountCreated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    repassword: "",
    suggestions: "",
  });

  return (
    <>
    
      <ThemeProvider theme={customTheme}>
        <Box sx={{ display: "flex" }}>
          <Main open={open}>
            {surveySubmitted === false && (<LaunchPage setsignout={setsignout} setemail={setemail} setSurveySubmitted={setSurveySubmitted}/> )}
            {surveySubmitted === true && signout ===false && <MainApp setsignout={setsignout} email={email} />}
          </Main>
        </Box>
      </ThemeProvider>
    </>
  );
}
