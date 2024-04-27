import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const initialValues = {
  EquipmentNomenclature: "",
  installation_date: "",
  AverageRunning: "",
  Unit: "",
};

const unitOptions = ["Days", "Hours", "Cycles"];

const AddInfoFormikForm = () => {
  const EquipmentNomenclatures = useSelector(
    (state) => state.userSelection.componentsData
  );

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("/save_system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flatData: [
          {
            id: uuid(),
            component_id: values.EquipmentNomenclature.id,
            EquipmentName: values.EquipmentNomenclature.nomenclature,
            AverageRunning: values.AverageRunning,
            Unit: values.Unit,
            installation_date: values.installation_date,
            maintDataAvail: "Component Level",
            hK: 1,
            elhK: 1,
            cK: 1,
            dsK: 1,
            asK: 1,
            parallelComponentIds: [],
            N: 1,
          }
        ],dtype: "additionalInfo"
      }) 
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
            onChange={(event, newValue) => {
              setFieldValue("EquipmentNomenclature", newValue ? newValue : "");
              setFieldTouched("EquipmentNomenclature", true);
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
