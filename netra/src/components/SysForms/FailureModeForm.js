import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const initialValues = {
  EquipmentNomenclature: "",
  FailureMode: "",
};

const failureModeOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const FMFormikForm = () => {
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
            options={failureModeOptions}
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

          <TextField
            label="Failure Mode"
            name="FailureMode"
            fullWidth
            variant="outlined"
            onChange={(event) => {
              setFieldValue("FailureMode", event.target.value);
              setFieldTouched("FailureMode", true);
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

export default FMFormikForm;
