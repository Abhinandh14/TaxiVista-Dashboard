import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Collapse,
  Switch,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useTheme } from "./ThemeProvider";

const Header = ({ isAuthenticated, onLogout }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openAnalysis, setOpenAnalysis] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const toggleAnalysis = () => {
    setOpenAnalysis(!openAnalysis);
  };

  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    onLogout();
    navigate("/login");
  };

  const authToken = localStorage.getItem("authToken");

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            TaxiVista
          </Typography>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="default"
            inputProps={{ "aria-label": "toggle dark mode" }}
            sx={{ marginLeft: "auto" }}
          />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
        <List>
          <ListItem button component={Link} to="/" onClick={toggleDrawer}>
            <ListItemText primary="Home" />
          </ListItem>

          {isAuthenticated && (
            <>
              <ListItem
                button
                component={Link}
                to="/graphs"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Graphs" />
              </ListItem>

              <ListItem button onClick={toggleAnalysis}>
                <ListItemText primary="Analysis" />
                {openAnalysis ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={openAnalysis} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={Link}
                    to="/analysis/basic"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Basic Analysis" />
                  </ListItem>
                  <ListItem
                    button
                    component={Link}
                    to="/analysis/complex"
                    onClick={toggleDrawer}
                  >
                    <ListItemText primary="Complex Analysis" />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                component={Link}
                to="/settings"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Settings" />
              </ListItem>
            </>
          )}

          {isAuthenticated && (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}

          {!isAuthenticated && (
            <>
              <ListItem
                button
                component={Link}
                to="/login"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/register"
                onClick={toggleDrawer}
              >
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </React.Fragment>
  );
};

export default Header;
