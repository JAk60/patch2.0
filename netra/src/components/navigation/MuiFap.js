// BackToHomeFab.js
import Fab from "@material-ui/core/Fab";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { elementActions } from "../../store/elements";

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
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleBack=()=>{
    history.push("/");
    dispatch(elementActions.clearCanvas())
  }
  return (
    <Fab
      className={classes.fab}
      color="primary"
      aria-label="back to home"
      onClick={handleBack}
    >
      <ArrowBackIcon />
    </Fab>
  );
};

export default BackToHomeFab;
