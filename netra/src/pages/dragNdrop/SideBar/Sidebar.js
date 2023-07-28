import { Button } from "@material-ui/core";
import classes from "./Sidebar.module.css";
const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside className={classes.parent}>
      {/* <div className={classes.description}>
        You can drag these nodes to the pane below.
      </div> */}
      <div className={classes.nodeparent}>
        <div
          className={`${classes.dndnode} + ' ' + ${classes.system}`}
          onDragStart={(event) => onDragStart(event, "systemNode")}
          draggable
        >
          System Node
        </div>
        <div
          className={classes.dndnode}
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          Component Node
        </div>
        <div
          className={`${classes.dndnode} + ' ' + ${classes.output}`}
          onDragStart={(event) => onDragStart(event, "output")}
          draggable
        >
          LMU Node
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
