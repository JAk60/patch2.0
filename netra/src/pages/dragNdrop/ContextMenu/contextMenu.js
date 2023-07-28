import React from "react";
import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import './menu.css'

const CustomContextMenu = () => {
  const handleClick = (e, data) => {
    console.log(data.foo);
  };
  return (
    <div>
      {/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
      {/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

      

      <ContextMenu id="same_unique_identifier" style={{position:'absolute',zIndex:'999'}}>
        <MenuItem data={{ foo: "bar" }} onClick={handleClick}>
          ContextMenu Item 1
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{ foo: "bar" }} onClick={handleClick}>
          ContextMenu Item 2
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{ foo: "bar" }} onClick={handleClick}>
          ContextMenu Item 3
        </MenuItem>
      </ContextMenu>
    </div>
  );
};

export default CustomContextMenu;
