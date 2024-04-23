import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const validate = (values) => {
  const errors = {};
  const dutyCycle = parseFloat(values.dutyCycle);
  if (isNaN(dutyCycle) || dutyCycle < 0 || dutyCycle > 1) {
    errors.dutyCycle = "Duty Cycle must be a number between 0 and 1";
  }
  return errors;
};

const initialValues = {
  equipmentNomenclature: "",
  assemblyNomenclature: "",
  parallelComponents: "",
  dutyCycle: "",
};

const equipmentOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const assemblyOptions = [
  { label: "Assembly 1", value: "assembly1" },
  { label: "Assembly 2", value: "assembly2" },
  { label: "Assembly 3", value: "assembly3" },
];

const parallelOptions = [
  { label: "Parallel 1", value: "parallel1" },
  { label: "Parallel 2", value: "parallel2" },
  { label: "Parallel 3", value: "parallel3" },
];

const FormikForm = () => {
  const handleSubmit = (values) => {
    console.log(values);
    // Handle form submission here
  };

  const handleChange = (event, setFieldValue) => {
    const { name } = event.target;
    // Reset the error state for the changed field
    setFieldValue(name, event.target.value);
  };

  const handleBlur = (event, setFieldTouched) => {
    const { name } = event.target;
    // Mark the field as touched
    setFieldTouched(name, true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
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
              setFieldValue(
                "equipmentNomenclature",
                newValue ? newValue.label : ""
              );
              setFieldTouched("equipmentNomenclature", true);
            }}
          />

          <Autocomplete
            options={assemblyOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assembly Nomenclature"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue(
                "assemblyNomenclature",
                newValue ? newValue.label : ""
              );
              setFieldTouched("assemblyNomenclature", true);
            }}
          />

          <Autocomplete
            multiple
            options={parallelOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Parallel Components"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              setFieldValue(
                "parallelComponents",
                newValue ? newValue.map((option) => option.label) : []
              );
              setFieldTouched("parallelComponents", true);
            }}
          />

          <TextField
            label="Duty Cycle (0 - 1)"
            name="dutyCycle"
            type="number"
            step="0.01"
            fullWidth
            variant="outlined"
            onChange={(event) => handleChange(event, setFieldValue)}
            onBlur={(event) => handleBlur(event, setFieldTouched)}
            error={!!errors.dutyCycle && touched.dutyCycle}
            helperText={touched.dutyCycle ? errors.dutyCycle : ""}
          />

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikForm;
