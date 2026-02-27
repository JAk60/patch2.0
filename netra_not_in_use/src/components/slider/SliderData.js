import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
  },
  margin: {
    height: theme.spacing(3),
  },
}));

// function ValueLabelComponent(props) {
//   const { children, open, value } = props;

//   return (
//     <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
//       {children}
//     </Tooltip>
//   );
// }

// ValueLabelComponent.propTypes = {
//   children: PropTypes.element.isRequired,
//   open: PropTypes.bool.isRequired,
//   value: PropTypes.number.isRequired,
// };

const PrettoSlider = withStyles({
  root: {
    color: "rgb(41, 41, 114)",
    height: 8,
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -15,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  markLabel: {
    fontSize: "1.2rem",
  },
  track: {
    height: 14,
    borderRadius: 10,
    background: "linear-gradient(90deg, #498FE8 50%, #292972 70%);",
  },
  rail: {
    height: 14,
    borderRadius: 10,
  },
})(Slider);

const CustomizedSlider = (props) => {
  const classes = useStyles();
  const onChangeHandler = (e) => {
    console.log(e);
  };
  return (
    <div className={classes.root}>
      <PrettoSlider
        defaultValue={props.default}
        marks={props.marks}
        onChangeCommitted={onChangeHandler}
      />
    </div>
  );
};

export default CustomizedSlider;
