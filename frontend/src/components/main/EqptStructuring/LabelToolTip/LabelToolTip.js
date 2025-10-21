import { InputLabel, Tooltip } from "@material-ui/core";
import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import classes from "./LabelToolTip.module.css";

function LabelToolTip({ label, info }) {
  return (
    <div className={classes.root}>
      <InputLabel
        style={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
      >
        {label}
      </InputLabel>
      <Tooltip title={info} placement="left">
        <InfoIcon />
      </Tooltip>
    </div>
  );
}

export default LabelToolTip;
