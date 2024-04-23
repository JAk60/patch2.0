import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const initialValues = {
  EquipmentNomenclature: "",
  RepairType: "",
  PreventiveMaintenaceApplicable: "",
  PreventiveMaintenaceInterval: "",
  ComponentsReplaced: "",
};

const repairTypeOptions = ["Replaceable", "Repairable"];
const preventiveMaintenanceApplicableOptions = ["No", "Yes"];
const componentsReplacedOptions = ["No", "Yes"];

const equipmentOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const MaintenanceFormikForm = () => {
  const handleSubmit = (values) => {
    console.log(values);
    // Handle form submission here
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, setFieldValue, setFieldTouched }) => (
        <Form>
          <Autocomplete
            options={equipmentOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipment Nomenclature"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue("EquipmentNomenclature", newValue ? newValue.label : "");
              setFieldTouched("EquipmentNomenclature", true);
            }}
          />

          <Autocomplete
            options={repairTypeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Repair Type"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue("RepairType", newValue ? newValue : "");
              setFieldTouched("RepairType", true);
            }}
          />

          <Autocomplete
            options={preventiveMaintenanceApplicableOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Preventive Maintenance Applicable"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue("PreventiveMaintenaceApplicable", newValue ? newValue : "");
              setFieldTouched("PreventiveMaintenaceApplicable", true);
            }}
          />

          <TextField
            label="Preventive Maintenance Interval (hrs)"
            name="PreventiveMaintenaceInterval"
            type="number"
            fullWidth
            variant="outlined"
          />

          <Autocomplete
            options={componentsReplacedOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Can it be replaced by ship staff ?"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue("ComponentsReplaced", newValue ? newValue : "");
              setFieldTouched("ComponentsReplaced", true);
            }}
          />

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default MaintenanceFormikForm;
