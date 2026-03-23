import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";

const RenderMultipleComponent = forwardRef((props, ref) => {
  const [value, setValue] = useState([]);
  const currentShip = useSelector((state) => state.taskData.currentShip);
  const currentTaskName = useSelector((state) => state.taskData.currentTaskName);
  const taskData = useSelector((state) => state.taskData.taskData);

  const filteredData = taskData?.tasks_data.filter(
    (x) => x.ship_name === currentShip && x.task_name === currentTaskName
  );

  const selectedEquipmentId = props.data.id;

  // ✅ Filter task_data to only show ops-active equipment
  // props.opsEquipment is a Set or array of active nomenclature names passed from TaskDashboard
  const allEquipment = filteredData[0]?.task_data || [];
  const opsEquipment = props.opsEquipment;

  const availableEquipment =
    opsEquipment && opsEquipment.length > 0
      ? allEquipment.filter((eq) => opsEquipment.includes(eq.name))
      : allEquipment; // fallback: show all if ops list not loaded yet

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
        setValue(availableEquipment);
      } else {
        setValue(selectedOptions);
      }
    }
  };

  const optionsWithSelectAll = [
    { name: "Select All", EquipmentId: "selectAll" },
    ...availableEquipment,
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