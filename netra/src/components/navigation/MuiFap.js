// BackToHomeFab.js
import React from "react";
import Fab from "@material-ui/core/Fab";

import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import HomeIcon from "@material-ui/icons/Home";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: theme.zIndex.tooltip + 1, // Ensure it's above other elements
  },
}));

const BackToHomeFab = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Fab
      className={classes.fab}
      color="primary"
      aria-label="back to home"
      onClick={() => history.push("/")}
    >
      <ArrowBackIcon />
    </Fab>
  );
};

export default BackToHomeFab;
