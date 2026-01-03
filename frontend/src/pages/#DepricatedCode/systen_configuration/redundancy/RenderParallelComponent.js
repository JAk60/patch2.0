import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const RenderParallelComponent = forwardRef((props, ref) => {
  const [value, setValue] = useState([]);
  const refInput = useRef(null);
  const location = useLocation();

  const systemData = useSelector((state) => state.treeData.treeData);
  const userSelection = useSelector((state) => state.userSelection.userSelection);
  const componentsData = useSelector((state) => state.userSelection.componentsData);

  const selectedEquipment = props.data.EquipmentName;
  const selectedEquipmentId = props.data.eqId;
  const selectedEquipmentParent = props.data.EquipmentParentName;
  console.log(selectedEquipment, selectedEquipmentId, selectedEquipmentParent);

  let potentialParallelComponents = [];
  
  if (location.pathname === "/system_config/additional_info") {
    potentialParallelComponents = userSelection["equipmentName"]
      .map((x) => {
        let component = componentsData?.find((c) => c.name === x);
        return {
          name: x,
          parentName: component.parentName,
          id: component.id,
        };
      })
      .filter((component) => component.parentName === selectedEquipmentParent && component.name !== selectedEquipment);
  } else {
    potentialParallelComponents = systemData
      .filter((x) => x.parentName === selectedEquipmentParent && x.nomenclature !== selectedEquipment)
      .map((component) => ({
        name: component.nomenclature,
        parentName: component.parentName,
        id: component.id,
      }));
  }
  
  console.log(potentialParallelComponents);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useImperativeHandle(ref, () => ({
    getValue() {
      let valueStr = [];
      let ids = [];

      if (location.pathname === "/system_config/failure_mode") {
        ids = [value.id];
        valueStr = [value.name];
        props.data["rEquipmentId"] = ids[0];
      } else {
        value.forEach((element) => {
          ids = [...ids, element.id];
          valueStr = [...valueStr, element.name];
        });
        props.setParallelIds(ids);
      }

      return valueStr.toString();
    },
    isPopup() {
      return true;
    },
    isCancelBeforeStart() {
      return false;
    },
  }));

  return (
    <Autocomplete
      id={selectedEquipmentId}
      options={potentialParallelComponents}
      value={value}
      multiple={props.isMultiple}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          ref={refInput}
          label={props.label}
          variant="outlined"
        />
      )}
      filterOptions={(options, params) => {
        const filtered = options.filter(option => 
          !value.some(item => item.id === option.id)
        );
        return filtered;
      }}
    />
  );
});

export default RenderParallelComponent;