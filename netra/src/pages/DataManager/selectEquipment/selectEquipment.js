import React, { useState } from "react";
import MultiSelect from "./MultiSelect";


function SelectEquipment(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const list = props.list;
  console.log(props.list);

  const handleClearOptions = () => setSelectedOptions([]);
  return (
    <MultiSelect
      items={list}
      getOptionLabel={(option) => option.nomenclature}
      selectedValues={selectedOptions}
      label="Select Equipment"
      onUpdateSelectedEquipmentList={props.onUpdateSelectedEquipmentList}
      onToggleOption={(selectedOptions) => setSelectedOptions(selectedOptions)}
      onClearOptions={handleClearOptions}
    />
  );
}

export default SelectEquipment;
