import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
const initialValues = {
  EquipmentNomenclature: "",
  FailureMode: "",
};

const FMFormikForm = () => {
  const EquipmentNomenclatures = useSelector(
    (state) => state.userSelection.componentsData
  );
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await fetch("/save_system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flatData: [
            {
              EquipmentName: values.EquipmentNomenclature.name,
              eqId: values.EquipmentNomenclature.id,
              id: uuid(), // Assuming you have a function or library to generate unique IDs like uuid()
              fixFailureMode: values.FailureMode,
            },
          ],
          dtype: "failure_mode",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data saved successfully:", data);
        // Handle success if needed
      } else {
        console.error("Failed to save data:", response.statusText);
        // Handle error if needed
      }
    } catch (error) {
      console.error("Error occurred while saving data:", error);
      // Handle error if needed
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ errors, touched, setFieldValue, setFieldTouched }) => (
          <Form>
            <Autocomplete
              options={EquipmentNomenclatures}
              getOptionLabel={(option) => option.nomenclature}
              groupBy={(option) => option.ship_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Equipment Nomenclature"
                  variant="outlined"
                />
              )}
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                // Ensure newValue is logged correctly
                console.log("Selected Equipment Nomenclature:", newValue);
                setFieldValue(
                  "EquipmentNomenclature",
                  newValue ? newValue : ""
                );
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
    </div>
  );
};

export default FMFormikForm;
