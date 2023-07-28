import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomizedSnackbars = (props) => {
  // const classes = useStyles();
  // const [open, setOpen] = React.useState(props.message.showSnackBar);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  return (
    <Snackbar
      open={props.message.showSnackBar}
      autoHideDuration={7000}
      onClose={props.onHandleClose}
    >
      <Alert onClose={props.onHandleClose} severity={props.message.severity}>
        {props.message.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbars;
