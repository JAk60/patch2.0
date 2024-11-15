//Custom Select- Props{id,label,value,onchange,classname,fields}
import {
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";

const LabelStyles = makeStyles({
  root: {
    color: "black",
    fontWeight: "bold",
    fontSize: "1.3rem",
    position: "unset",
    // marginBottom: 10,
  },
});
const StyledInput = withStyles({
  root: {
    paddingRight: 25,
    paddingLeft: 10,
    background: "#fff",
    border: "1px solid #0263a1",
    borderRadius: "5px",
    width: "250px",
    height: "40px",
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
})(InputBase);
const CustomSelect = (props) => {
  const Labelclasses = LabelStyles();

  return (
    <FormControl className={props.className}>
      <InputLabel id={props.id} classes={Labelclasses} shrink>
        <Typography variant="h5" sx={{ fontSize: "700" }}>
          {props.label}
        </Typography>
      </InputLabel>
      {props.value ? (
        <Select
          style={props.style}
          labelId={props.id + "-label"}
          id={props.id}
          name={props.name}
          onChange={props.onChange}
          input={<StyledInput />}
          value={props.value}
        >
          {props.fields?.map((data, index) => (
            <MenuItem key={index} value={data}>
              {data}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Select
          style={props.style}
          labelId={props.id + "-label"}
          id={props.id}
          name={props.name}
          onChange={props.onChange}
          input={<StyledInput />}
        >
          {props.fields?.map((data, index) => (
            <MenuItem value={data} key={index}>
              {data}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};
export default CustomSelect;
