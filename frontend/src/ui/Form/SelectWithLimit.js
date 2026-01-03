import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles, Chip, TextField } from "@material-ui/core";

const InputStyles = makeStyles({
  root: {
    paddingRight: 10,
    paddingLeft: 10,
    background: "#fff",
    border: "1px solid #0263a1",
    borderRadius: "5px",
    minHeight: 40,
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
});

export const SelectWithLimit = ({
  disabled = false,
  limit,
  options,
  getSelectedValues,
  selectType = null,
}) => {
  const [disableInput, setDisableInput] = useState(false);

  const Inputclasses = InputStyles();
  debugger;
  if (selectType === "equipmentName") {
    return (
      <Autocomplete
        classes={Inputclasses}
        label="lol"
        disabled={disabled || disableInput}
        multiple
        options={options}
        groupBy={(option) => option.parent}
        getOptionLabel={(option) => option?.equipmentName}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={index}
              label={option?.equipmentName}
              style={{ width: "fit-content" }}
              {...getTagProps({ index })}
              // Set disable explicitly after getTagProps
              disabled={disabled}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{ ...params.InputProps, disableUnderline: true }}
          />
        )}
        onChange={(event, newValue) => {
          // do something else
          // set the disable input
          getSelectedValues(newValue, selectType);
          setDisableInput(newValue.length >= limit);
        }}
      />
    );
  } else if (selectType === "nomenclature") {
    return (
      <Autocomplete
        classes={Inputclasses}
        label="lol"
        disabled={disabled || disableInput}
        multiple
        options={options}
        groupBy={(option) => option.parent}
        getOptionLabel={(option) => option?.nomenclature}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={index}
              label={option?.nomenclature}
              style={{ width: "fit-content" }}
              {...getTagProps({ index })}
              // Set disable explicitly after getTagProps
              disabled={disabled}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{ ...params.InputProps, disableUnderline: true }}
          />
        )}
        onChange={(event, newValue) => {
          // do something else
          // set the disable input
          getSelectedValues(newValue, selectType);
          setDisableInput(newValue.length >= limit);
        }}
      />
    );
  }
  else {
    return (
      <Autocomplete
        classes={Inputclasses}
        label="lol"
        disabled={disabled || disableInput}
        multiple
        options={options}
        // value={value}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={index}
              label={option}
              style={{ width: "fit-content" }}
              {...getTagProps({ index })}
              // Set disable explicitly after getTagProps
              disabled={disabled}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{ ...params.InputProps, disableUnderline: true }}
          />
        )}
        onChange={(event, newValue) => {
          // do something else
          // set the disable input
          getSelectedValues(newValue, selectType);
          setDisableInput(newValue.length >= limit);
        }}
      />
    );
  }
};