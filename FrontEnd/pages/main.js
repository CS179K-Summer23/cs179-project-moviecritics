import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";
import MovieshowerFromInterests from "./interestsFromSurvey";
import CloseIcon from "@mui/icons-material/Close";
import MovieRatings from "./MovieRating";
import PaginationApp from "./Pagination";
import ProfilePage from "./profile";
import HomeAccount from "./homeaccount";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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


export default function MainApp({ setsignout, jsonfile, jsonfile2, email }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [page, setpage] = React.useState(0);

  const handleDrawerOpen = () => {
    if (!accountCreated) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logoutfunction = () => {
    setsignout(true);
    setAnchorElUser(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" color={"secondary"} open={open}>
            <Toolbar>
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
              
              <Button sx={{ marginLeft: "auto" }}  onClick={logoutfunction}>Log Out</Button>
              <Typography variant="h6" align="right" component="div">
                Email: {email}
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
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem key="Home" disablePadding>
                <ListItemButton onClick={() => setpage(0)}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Suggestions" disablePadding>
                <ListItemButton onClick={() => setpage(1)}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Suggestions" />
                </ListItemButton>
              </ListItem>
              <ListItem key="MovieDB" disablePadding>
                <ListItemButton onClick={() => setpage(2)}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="MovieDB" />
                </ListItemButton>
              </ListItem>
              <ListItem key="LatestMovies" disablePadding>
                <ListItemButton onClick={() => setpage(3)}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="LatestMovies" />
                </ListItemButton>
              </ListItem>
              <ListItem key="Profile" disablePadding>
                <ListItemButton onClick={() => setpage(4)}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </Drawer>
          <Main open={open}>
            {page === 0 && <HomeAccount />}
            {page === 1 && <MovieshowerFromInterests jsonfile={jsonfile} />}
            {page === 2 && <PaginationApp />}
            {page === 3 && <MovieRatings jsonfile2={jsonfile2} />}
            {page === 4 && <ProfilePage email={email}/>}
          </Main>
        </Box>
      </ThemeProvider>
    </>
  );
}
