import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Container,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import Navigation from "../../components/navigation/Navigation";
import EqptStructuring from "../../components/main/EqptStructuring/EqptStructuring";
import SystemConfiguration from "./SystemConfiguration";
import FormsTab from "./FormsTab";

const useStyles = makeStyles((theme) => ({
  transparentTab: {
    backgroundColor: "#1976d4",
    color: theme.palette.text.white,
  },
  coloredTab: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  content: {
    // paddingTop: theme.spacing(8),
    // width: "100%",
    // display: "flex",
    // // flexDirection: "column",
    // alignItems:"center",
    // justifyContent: "center"  // Adjust the padding value as needed
    // Assuming you have a fixed AppBar, adjust the paddingTop to match its height
  },
}));

export default function SysConfig() {
  const [selectedTab, setSelectedTab] = useState(0);
  const classes = useStyles();
  const theme = useTheme(); // Accessing the theme

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Navigation />

        <AppBar
          style={{
            zIndex: "1",
            marginLeft: "20px",
            gridColumn: "2/13",
            gridRow: "1/2",
          }}
        >
          <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth">
            <Tab
              label="Create System"
              className={
                selectedTab === 0 ? classes.coloredTab : classes.transparentTab
              }
            />
            <Tab
              label="Config System"
              className={
                selectedTab === 1 ? classes.coloredTab : classes.transparentTab
              }
            />
          </Tabs>
        </AppBar>
      </div>
      <Container
        className={classes.content}
      >
        {selectedTab === 0 && (
          <div >
            <SystemConfiguration />
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            <FormsTab />
          </div>
        )}
      </Container>
    </>
  );
}
