import {
    AppBar,
    Container,
    Tab,
    Tabs,
    makeStyles,
    useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import ReliabilityDashboard from "./ReliabilityDashboard";
import AssemblyRelDash from "./AssemblyRelDash";

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
    paddingTop: theme.spacing(8),
    gridRow: "1", // Adjust according to your grid setup
    gridColumn: "2 / span 12", // Adjust according to your grid setup
    width: "100%",
    height: "100%",
  },
}));

export default function MainRel() {
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
          }}
        >
          <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth">
            <Tab
              label="Equipment Reliability"
              className={
                selectedTab === 0 ? classes.coloredTab : classes.transparentTab
              }
            />
            <Tab
              label="Assembly Reliability"
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
        //   <div className={classes.content}>
            <ReliabilityDashboard />
        //   </div>
        )}
        {selectedTab === 1 && (
          <div>
            <AssemblyRelDash />
          </div>
        )}
      </Container>
    </>
  );
}
