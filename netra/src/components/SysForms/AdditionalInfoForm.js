import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const initialValues = {
  nomenclature: "",
  installation_date: "", // Initialize with an empty string
  AverageRunning: "", // Initialize with an empty string
  Unit: "",
};

const unitOptions = ["Days", "Hours", "Cycles"];
const equipmentOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const AddInfoFormikForm = () => {
    const handleSubmit = (values) => {
        console.log("Form Values:", values);
        console.log("Nomenclature:", values.nomenclature);
        console.log("Installation Date:", values.installation_date);
        console.log("Average Running:", values.AverageRunning);
        console.log("Unit:", values.Unit);
        // Handle form submission here
      };
      

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
              setFieldValue("nomenclature", newValue ? newValue.label : "");
              setFieldTouched("nomenclature", true);
            }}
          />

          <TextField
            label="Installation Date"
            name="installation_date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            variant="outlined"
            onChange={(event) => {
              setFieldValue("installation_date", event.target.value);
              setFieldTouched("installation_date", true);
            }}
          />

          <TextField
            label="Default Avg. Monthly Utilization"
            name="AverageRunning"
            type="number"
            fullWidth
            variant="outlined"
            onChange={(event) => {
              setFieldValue("AverageRunning", event.target.value);
              setFieldTouched("AverageRunning", true);
            }}
          />

          <Autocomplete
            options={unitOptions}
            renderInput={(params) => (
              <TextField {...params} label="Unit" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              setFieldValue("Unit", newValue ? newValue : "");
              setFieldTouched("Unit", true);
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

export default AddInfoFormikForm;
