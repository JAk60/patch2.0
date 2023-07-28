import React, { useState } from "react";
import classes from "./Tree.module.css";
import DynamicTree from "react-dynamic-animated-tree";

var data = [
  {
    title: "Fresh Water Cooling",
    id: "1",
    childNodes: [
      {
        title: "Heat Exchanger",
        id: "11",
        childNodes: [
          { title: "Heat Transfer Core", id: "111", childNodes: [] },
          { title: "Inlet Tank", id: "112", childNodes: [] },
          { title: "Outlet Tank", id: "113", childNodes: [] },
          { title: "Zinc Plugs", id: "114", childNodes: [] },
        ],
      },
      {
        title: "HE Top Tank",
        id: "12",
        childNodes: [],
      },
      { title: "Lubricant Oil Cooler", id: "13", childNodes: [] },
      { title: "Rubber Hoes", id: "14", childNodes: [] },
      { title: "Turbo Cooler", id: "15", childNodes: [] },
      { title: "Water Manifold", id: "16", childNodes: [] },
      { title: "Water Temperature Gauge", id: "17", childNodes: [] },
      { title: "Water Pump & Water Bypass", id: "18", childNodes: [] },
    ],
  },
];

const styles = {
  leaf: {
    cursor: "pointer",
    display: "inline",
  },
  node: {
    cursor: "pointer",
    display: "inline",
    color: "white",
  },
  icon: {
    width: "1em",
    height: "1em",
    marginLeft: 5,
    cursor: "cursor",
  },
  selected: {
    color: "green",
  },
  background: {
    background: "rgb(220, 220, 220)",
  },
};
function Tree() {
  // const [node, setSelectedNode] = useState("");
  return (
    <div>
      {/* <div> */}
      {/* <p>
          Selected Node: {JSON.stringify({ node: node.title, id: node.id })}
        </p> */}
      <DynamicTree
        // classes={classes}
        style={styles}
        key="root"
        id="root"
        data={[...data]}
        title="DA"
        //onClick={(node) => setSelectedNode(node)}
      />
      {/* </div> */}
    </div>
  );
}

export default Tree;
