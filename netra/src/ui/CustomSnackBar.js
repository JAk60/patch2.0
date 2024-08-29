import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import React from "react";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const CustomizedSnackbars = (props) => {
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
