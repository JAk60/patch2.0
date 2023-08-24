import { React, useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import classes from "./Slider.module.css";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "98%",
    background: "#ebebeb",
    height: 70,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
});

const PrettoSlider = withStyles({
  root: {
    color: "#fff",
    height: 8,
  },
  thumb: {
    "&.Mui-disabled": {
      height: 20,
      width: 20,
      backgroundColor: "#fff",
      marginTop: -4,
      marginLeft: -4,
      boxShadow:
        "1px 2px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)",
    },
  },
  active: {},

  track: {
    marginLeft: "1%",
    height: 12,
    borderRadius: 10,
    background:
      "linear-gradient(90deg, rgba(0,159,251,1) 0%, rgba(42,42,112,1) 60%)",
  },
  rail: {
    width: "98%",
    marginLeft: 10,
    marginRight: 10,
    height: 12,
    borderRadius: 10,
    background: "#fff",
    opacity: 1,
  },
})(Slider);

export default function StageSlider(props) {
  const [def, Setdef] = useState(props.default);
  useEffect(() => {
    Setdef(props.default);
  }, [props.default]);
  const styles = useStyles();
  return (
    <div className={classes.slider}>
   
      <div className={styles.root}>
        <PrettoSlider value={def} step={null} marks={props.marks} classes={{
            markLabel: classes["slider-labels"], // Apply the class to the labels
          }}disabled />
      </div>
      
    </div>
  );
}
