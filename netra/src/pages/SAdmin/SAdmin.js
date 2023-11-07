import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";
import AccCreate from "./AccCreate";
import ManageUsers from "./Manage_User";
import WelcomePage from "./welcome";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "250px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundImage: "linear-gradient(10deg, #498fe8,#2a2a72)",
    width: "250px",
    borderRight: "1px solid #ccc",
    borderBottomRightRadius: "15px", // Add this line to set the border radius
    borderTopRightRadius: "15px", // Add this line to set the border radius
  },
  content: {
    width: "calc(100vw - 250px)", // Adjust the width based on your specific layout
  },
  listnav: {
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  TxtLogo: {
    color: "white",
  },
  menuItem: {
    color: "white",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const SAdmin = ({ logout }) => {
  const classes = useStyles();
  const [selectedMenu, setSelectedMenu] = useState("Welcome");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    fetch("/card_counts") // Assuming this is the Flask endpoint
      .then((response) => response.json())
      .then((data) => setCardData(data))
      .catch((error) => console.error("Error fetching card counts:", error));
  }, []);
  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box style={{ textAlign: "center", margin: "16px 0" }}>
          <img src="/InsmaLogo.png" alt="Logo" style={{ width: "140px" }} />
          <Typography variant="h4" className={classes.TxtLogo}>
            NETRA
          </Typography>
        </Box>
        <List className={classes.listnav}>
          <ListItem
            button
            selected={selectedMenu === "Welcome"}
            onClick={() => handleMenuClick("Welcome")}
            className={classes.menuItem}
          >
            <ListItemIcon
              style={selectedMenu === "Welcome" ? { color: "#fff" } : {}}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            selected={selectedMenu === "Create Account"}
            onClick={() => handleMenuClick("Create Account")}
            className={classes.menuItem}
          >
            <ListItemIcon
              style={selectedMenu === "Create Account" ? { color: "#fff" } : {}}
            >
              <BorderColorIcon />
            </ListItemIcon>
            <ListItemText primary="Create Account" />
          </ListItem>
          <ListItem
            button
            selected={selectedMenu === "Manage User"}
            onClick={() => handleMenuClick("Manage User")}
            className={classes.menuItem}
          >
            <ListItemIcon
              style={selectedMenu === "Manage User" ? { color: "#fff" } : {}}
            >
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Manage User" />
          </ListItem>
          <div style={{ flex: 1 }} />
          {/* Add this div to push the Logout item to the bottom */}
          <ListItem button onClick={logout} className={classes.menuItem}>
            <ListItemIcon style={{ color: "#fff" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.content}>
        {selectedMenu === "Welcome" && <WelcomePage cardData={cardData} />}
        {selectedMenu === "Create Account" && <AccCreate />}
        {selectedMenu === "Manage User" && <ManageUsers />}
      </div>
    </div>
  );
};

export default SAdmin;
