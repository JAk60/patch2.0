import React from "react";
import { Button, Grid } from "@material-ui/core";
import { components } from "./userSelectionData";
import CustomSelect from "../../../ui/Form/CustomSelect";
import { Route } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const SelectStyles = makeStyles({
  spacing: {
    marginLeft: "10px",
  },
});

function UserSelection() {
  const SelectClasses = SelectStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="ship-name"
            label="Ship Name"
            fields={components}
          />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="ship-category"
            label="Ship Category"
            fields={components}
          />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="ship-class"
            label="Ship Class"
            fields={components}
          />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="command"
            label="Command"
            fields={components}
          />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="department"
            label="Department"
            fields={components}
          />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: "200px" }}
            id="equipment-name"
            label="Equipment Name"
            fields={components}
          />
        </div>
      </Grid>
    </Grid>
  );
}
export default UserSelection;
