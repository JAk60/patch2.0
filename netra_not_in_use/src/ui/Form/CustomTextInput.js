//Custom Text Input- Props{id,label,value,onchange,classname,style}
import React from "react";
import {
  makeStyles,
  FormControl,
  InputBase,
  InputLabel,
} from "@material-ui/core";
const LabelStyles = makeStyles({
  root: {
    color: "black",
    fontWeight: "bold",
    fontSize: "1.3rem",
    position: "unset",
    // marginBottom: 10,
  },
});
const InputStyles = makeStyles({
  root: {
    paddingRight: 10,
    paddingLeft: 10,
    background: "#fff",
    border:'1px solid #0263a1',
    borderRadius: "5px",
    height: 40,
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
});
const CustomTextInput = (props) => {
  const Labelclasses = LabelStyles();
  const Inputclasses = InputStyles();
  return (
    <FormControl className={props.className} style={props.style}>
      <InputLabel shrink classes={Labelclasses}>
        {props.label}
      </InputLabel>
      {/* <TextField id="status"  variant="outlined" value={Status}
                    onChange={handleStatusChange} classes={Inputclasses}/> */}
      <InputBase
        classes={Inputclasses}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        id={props.id}
        name={props.name}
        disabled={props.disabled}
        inputProps={{ variant: "outlined" }}
      ></InputBase>
    </FormControl>
  );
};
export default CustomTextInput;
