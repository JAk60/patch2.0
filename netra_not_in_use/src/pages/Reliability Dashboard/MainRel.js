import {
  Container,
  makeStyles
} from "@material-ui/core";
import React from "react";
import Navigation from "../../components/navigation/Navigation";
import ReliabilityDashboard from "./ReliabilityDashboard";

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
  const classes = useStyles();
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Navigation />
      </div>
      <Container
        className={classes.content}
      >
          <ReliabilityDashboard />
      </Container>
    </>
  );
}
