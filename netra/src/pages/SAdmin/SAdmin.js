import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  makeStyles,
  Button,
} from "@material-ui/core";
import AccCreate from "./AccCreate"
import ManageUsers from "./Manage_User";
import WelcomePage from "./welcome";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "250px",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "250px",
    borderRight: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
  },
  content: {
    width: "calc(100vw - 250px)", // Adjust the width based on your specific layout
  },

  menuItem: {
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));



const SAdmin = ({logout}) => {
  const classes = useStyles();
  const [selectedMenu, setSelectedMenu] = useState("Welcome");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

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
        <List>
          <ListItem
            button
            selected={selectedMenu === "Welcome"}
            onClick={() => handleMenuClick("Welcome")}
            className={classes.menuItem}
          >
            <ListItemText primary="Welcome" />
          </ListItem>
          <ListItem
            button
            selected={selectedMenu === "Create Account"}
            onClick={() => handleMenuClick("Create Account")}
            className={classes.menuItem}
          >
            <ListItemText primary="Create Account" />
          </ListItem>
          <ListItem
            button
            selected={selectedMenu === "Manage User"}
            onClick={() => handleMenuClick("Manage User")}
            className={classes.menuItem}
          >
            <ListItemText primary="Manage User" />
          </ListItem>
          <ListItem
            button
            selected={selectedMenu === "Logout"}
            onClick={() => handleMenuClick("Logout")}
            className={classes.menuItem}
          >
            <Button onClick={logout}>Logout</Button>
          </ListItem>
        </List>
      </Drawer>
      <div className={classes.content}>
        {selectedMenu === "Welcome" && (
          <WelcomePage />
        )}
        {selectedMenu === "Create Account" && <AccCreate />}
        {selectedMenu === "Manage User" && <ManageUsers />}
      </div>
    </div>
  );
};

export default SAdmin;
