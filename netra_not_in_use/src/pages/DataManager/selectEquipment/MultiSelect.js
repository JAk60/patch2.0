/*
Reference: https://codesandbox.io/s/thirsty-moon-9egd9?file=/src/MultiSelect/MultiSelect.js
*/

import { Checkbox } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";

const MultiSelect = ({
  items,
  selectedValues,
  label,
  selectAllLabel,
  noOptionsText,
  onToggleOption,
  onClearOptions,
  onSelectAll,
  getOptionLabel,
  onUpdateSelectedEquipmentList,
}) => {
  const allSelected = items.length === selectedValues.length;
  const handleToggleSelectAll = () => {
    onSelectAll && onSelectAll(!allSelected);
  };

  const handleChange = (event, selectedOptions, reason) => {
    if (reason === "select-option" || reason === "remove-option") {
      if (selectedOptions.find((option) => option.name === "Select All")) {
        handleToggleSelectAll();
      } else {
        onToggleOption && onToggleOption(selectedOptions);
      }
    } else if (reason === "clear") {
      onClearOptions && onClearOptions();
    }
    onUpdateSelectedEquipmentList(selectedOptions);
  };
  const optionRenderer = (option, { selected }) => {
    const selectAllProps =
      option.name === "Select All" // To control the state of 'Select All' checkbox
        ? { checked: allSelected }
        : {};
    return (
      <>
        <Checkbox
          color="primary"
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          style={{ marginRight: 8 }}
          checked={selected}
          {...selectAllProps}
        />
        {getOptionLabel(option)}
      </>
    );
  };
  const inputRenderer = (params) => (
    <TextField {...params} label={label} variant="outlined" />
  );
  const getOptionSelected = (option, anotherOption) =>
    option.name === anotherOption.name;
  return (
    <Autocomplete
      multiple
      style={{ width: 500 }}
      options={items}
      value={selectedValues}
      disableCloseOnSelect
      limitTags={2}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      noOptionsText={noOptionsText}
      onChange={handleChange}
      renderOption={optionRenderer}
      renderInput={inputRenderer}
    />
  );
};

MultiSelect.defaultProps = {
  items: [],
  selectedValues: [],
  getOptionLabel: (name) => name,
};

export default MultiSelect;
