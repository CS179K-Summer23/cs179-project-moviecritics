import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCreation from "./accountCreation";
import UserSurveyApp from "./UserSurvey";
import MovieshowerFromInterests from "./interestsFromSurvey";
import MovieRatings from "./MovieRating";
import PaginationApp from "./Pagination";
import ProfilePage from "./profile";
import HomeAccount from "./homeaccount";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MovieList from "./Movies_list";
import ThreadList from "./thread";
import { Tooltip, Avatar, IconButton } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import Analytics from "./analytics";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled } from "@mui/system";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";


function AccountMenu({ logoutfunction, toggleTheme, themeMode }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: "auto" }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>P</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logoutfunction}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          Theme
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

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

export default function MainApp({ setsignout, email }) {
  const [open, setOpen] = React.useState(false);
  const [page, setpage] = React.useState(0);
  const [themeMode, setThemeMode] = React.useState("dark"); // Default to dark theme
  const [reqopen, setreqOpen] = React.useState(false);

  const handleClose = () => {
    setreqOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logoutfunction = () => {
    localStorage.removeItem('authToken');
    setsignout(true);
    window.location.reload();
  };

  const toggleTheme = () => {
    // Toggle between 'dark' and 'light' themes
    const newThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newThemeMode);
  };

  // Define your themes
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      // other dark theme settings...
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      // other light theme settings...
    },
  });

  // Determine which theme object to use based on the themeMode state
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  const handleSubmitReview = async () => {

    const params = {
      "comment": reviewText,
      "movie_title": moviename
    }
    

    handleClose();
    console.log("params:", params);
    try {
      const res = await axios.post(
        "http://localhost:8003/submit_request",
        params,
        {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        }
      );
      
      
      if (res.data && res.status === 200) {
        console.log("success")
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            {/* Center the title */}
            <div style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Typography variant="h6" noWrap component="div">
                MovieCritics
              </Typography>
            </div>
            <Dialog open={reqopen} onClose={handleClose}>
          <DialogTitle style={{ textAlign: 'center', color: '#178582' }}>Request Movie</DialogTitle>
          <DialogContent>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: '18px' }}>Enter the Movie Name: </p>
              <TextField
                multiline
                minRows={3}
                style={{ width: '100%' }} // Set the background color to grey here
                value={name}
                onChange={(e) => setmovie(e.target.value)}
                id="name"
              />
              <p style={{ fontSize: '18px', marginTop: '20px' }}>Supporting Information:</p>
              <TextField
                multiline
                minRows={3}
                style={{ width: '100%' }} // Set the background color to grey here
                value={Text}
                onChange={(e) => setText(e.target.value)}
                variant="outlined" // Add this line to match the styling
                id="text"
              />
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button onClick={handleClose} style={{ marginRight: 'auto' }}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit</Button>
          </DialogActions>
        </Dialog>
            {/* AccountMenu on the right */}
            <AccountMenu
              logoutfunction={logoutfunction}
              toggleTheme={toggleTheme}
              themeMode={themeMode}
            />
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
          <IconButton color="secondary" onClick={handleDrawerClose}>
            <CloseIcon color="primary" />
          </IconButton>
          <Divider />
          <List>
            <ListItem key="Home" disablePadding>
              <ListItemButton onClick={() => setpage(0)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="HOME"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="Suggestions" disablePadding>
              <ListItemButton onClick={() => setpage(1)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="SUGGESTIONS"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="MovieDB" disablePadding>
              <ListItemButton onClick={() => setpage(2)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="MOVIE-DB"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="LatestMovies" disablePadding>
              <ListItemButton onClick={() => setpage(3)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="LATESTMOVIES"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="Profile" disablePadding>
              <ListItemButton onClick={() => setpage(4)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="PROFILE"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="MovieList" disablePadding>
              <ListItemButton onClick={() => setpage(5)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="MOVIELIST"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="ThreadList" disablePadding>
              <ListItemButton onClick={() => setpage(6)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="THREADLIST"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="Analytics" disablePadding>
              <ListItemButton onClick={() => setpage(7)}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Analytics"
                  style={{ color: "#178582", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <Main open={open}>
          {page === 0 && <HomeAccount />}
          {page === 1 && <MovieshowerFromInterests />}
          {page === 2 && <PaginationApp />}
          {page === 3 && <MovieRatings />}
          {page === 4 && <ProfilePage email={email} />}
          {page === 5 && <MovieList />}
          {page === 6 && <ThreadList />}
          {page === 7 && <Analytics />}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
