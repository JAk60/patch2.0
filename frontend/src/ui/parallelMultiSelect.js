import React from "react";
// import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
// import Chip from "@material-ui/core/Chip";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 120,
    maxWidth: 220,
    width: 220,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

export default function ParallelMultiSelect(props) {
  const classes = useStyles();
  const system = props.system;
  const [eqName, seteqName] = React.useState([]);

  const handleChange = (event) => {
    debugger;
    seteqName(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id={props.eqId}
          multiple
          className="pSelect"
          value={eqName}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => selected.join(", ")}
        >
          {system.map((eq) => (
            <MenuItem key={eq.id} value={eq.name}>
              <Checkbox checked={eqName.indexOf(eq.name) > -1} />
              <ListItemText primary={`${eq.name}{${eq.parentName}}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
