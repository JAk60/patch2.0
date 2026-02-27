import classes from "./Module_radio.module.css";
import Radio from "@material-ui/core/Radio";
import RadioButton from "../../ui/RadioButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useState } from "react";
import ModuleData from "./ModuleData";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {},
  label: {
    fontSize: "1.5rem",
  },
});

const Module = () => {
  const classesL = useStyles();
  const [value, setValue] = useState("System Configuration");
  const onValueChangeHandler = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className={classes.module}>
      <div className={classes.radioparent}>
        <RadioGroup
          row
          onChange={onValueChangeHandler}
          name="module"
          className={classes.radiogrp}
          value={value}
        >
          {ModuleData.map((item, index) => {
            return (
              <FormControlLabel
                value={item.value}
                control={<Radio color="primary" />}
                label={item.value}
                classes={{ root: classesL.root, label: classesL.label }}
              ></FormControlLabel>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};
export default Module;
