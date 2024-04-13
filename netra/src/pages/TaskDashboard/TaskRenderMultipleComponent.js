import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const RenderMultipleComponent = forwardRef((props, ref) => {
  const [value, setValue] = useState([]);
  const location = useLocation();
  const currentShip = useSelector((state) => state.taskData.currentShip);
  const currentTaskName = useSelector((state) => state.taskData.currentTaskName);
  const taskData = useSelector((state) => state.taskData.taskData);
  
  const filteredData = taskData?.tasks_data.filter(
    (x) => x.ship_name === currentShip && x.task_name === currentTaskName
  );
  const selectedEquipmentId = props.data.id;

  useImperativeHandle(ref, () => ({
    getValue() {
      let valueStr = [];
      let ids = [];
      props.data.components = [];
      value.forEach((element) => {
        ids = [...ids, element.EquipmentId];
        valueStr = [...valueStr, element.name];
        props.data.components.push(element);
      });
      props.setParallelIds(ids);
      return valueStr.toString();
    },
    isPopup() {
      return true;
    },
    isCancelBeforeStart() {
      return false;
    },
  }));

  const handleChange = (e, selectedOptions) => {
    if (selectedOptions && selectedOptions.length > 0) {
      if (selectedOptions[selectedOptions.length - 1].name === "Select All") {
        setValue(filteredData[0]?.task_data || []);
      } else {
        setValue(selectedOptions);
      }
    }
  };

  const optionsWithSelectAll = [
    { name: "Select All", EquipmentId: "selectAll" },
    ...(filteredData[0]?.task_data || [])
  ];

  return (
    <Autocomplete
      id={selectedEquipmentId}
      options={optionsWithSelectAll}
      value={value}
      multiple={props.isMultiple}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
      style={{ width: 850 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          variant="outlined"
        />
      )}
    />
  );
});

export default RenderMultipleComponent;
