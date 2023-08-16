import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import classes from "./cusomNode.module.css";

export default memo(({ data }) => {
  console.log(data);
  return (
    <>
      {/* <Handle
        type="target"
        position="top"
        style={{ background: "#555", width: "10px", height: "10px" }}
        onConnect={(params) => console.log("handle onConnect", params)}
      /> */}
      <div className={classes.customnode}>
        <strong>{data.label}</strong>
      </div>
      <Handle
        type="source"
        position="bottom"
        id="a"
        style={{ background: "#555", width: "10px", height: "10px" }}
      />
    </>
  );
});
