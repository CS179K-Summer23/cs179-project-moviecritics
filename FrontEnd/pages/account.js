import React, {useState} from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DescriptionIcon from "@mui/icons-material/Description";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";
import MovieshowerFromInterests from "./interestsFromSurvey";
import CloseIcon from '@mui/icons-material/Close';
import LaunchPage from "./homepage";

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

const customTheme = createMuiTheme({
  palette: {
    mode: 'dark',
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
    if(accountCreated){setOpen(true)};
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
 
  const [jsonfile, setjsonfile] = useState({});

  const [accountForm, setAccountForm] = useState('');
  
  const [accountCreated, setAccountCreated] = useState(false);

  const [surveySubmitted, setSurveySubmitted] = useState(false);
 // const [jsonfilevar, setjsonfilevar] = useState(null);

  const handleAccountCreationSuccess = () => {
    setAccountCreated(true);
  };

  const handlesurverySubmit = () => {
    setSurveySubmitted(true);
  };

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" color={"secondary"} open={open}>
            <Toolbar  >
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                MovieCritics
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
            color="secondary"
          >
            <DrawerHeader>
              <IconButton color="secondary" onClick={handleDrawerClose}>
                <CloseIcon color="primary" />
                {theme.direction === "ltr"}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {["Home", "Suggestions", "MovieDB", "PlaceHolder"].map(
                (text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {index % 2 === 0 ? (
                          <DescriptionIcon />
                        ) : (
                          <DescriptionIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
            <Divider />
          </Drawer>
          <Main open={open}>
            {/* If Account is created, show UserSurvey */}
            {accountCreated && (
              <>
                <UserSurveyApp setjsonfile={setjsonfile}  onSuccess={handlesurverySubmit} /*setjsonfilevar={setjsonfilevar} */ />
              </> 
            )}
            {accountCreated && surveySubmitted && (
              <>
                <MovieshowerFromInterests jsonfile={jsonfile} /*jsonfile={jsonfilevar}*/ />
              </>
            )}
            {/* <MovieshowerFromInterests />
            <MovieRating /> */}
          </Main>
        </Box>
      </ThemeProvider>
    </>
  );
}
