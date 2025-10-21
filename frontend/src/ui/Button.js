import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(180deg, #264C99, #292972);",
    borderRadius: 10,
    fontSize: "1.3rem",
    border: 0,
    color: "white",
    height: 45,
    padding: "0 30px",
    margin: "0 0.8rem",
    boxShadow: "0 3px 5px 2px rgb(119,119,119, 0.4)",
  },
  label: {
    textTransform: "capitalize",
  },
});

const CustomButton = (props) => {
  const classes = useStyles();

  return (
    <Button
      classes={{
        root: classes.root,
        label: classes.label,
      }}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
