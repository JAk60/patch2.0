import React, { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import MultiSelect from "./MultiSelect";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function SelectEquipment(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const list = props.list;

  const handleClearOptions = () => setSelectedOptions([]);
  return (
    <MultiSelect
      items={list}
      getOptionLabel={(option) => `${option.name}`}
      // getOptionDisabled={option => option.name === "foo"}
      selectedValues={selectedOptions}
      label="Select Equipment"
      // selectAllLabel="Select all"
      onUpdateSelectedEquipmentList={props.onUpdateSelectedEquipmentList}
      onToggleOption={(selectedOptions) => setSelectedOptions(selectedOptions)}
      onClearOptions={handleClearOptions}
      // onSelectAll={(isSelected) => {
      //   if (isSelected) {
      //     setSelectedOptions(list);
      //     props.onUpdateSelectedEquipmentList(list);
      //   } else {
      //     handleClearOptions();
      //     props.onUpdateSelectedEquipmentList([]);
      //   }
      // }}
    />
  );
}

export default SelectEquipment;
