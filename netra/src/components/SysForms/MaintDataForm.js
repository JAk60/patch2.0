import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const initialValues = {
  LMU: "",
  EventType: "",
  Date: "",
  MaintenanceType: "",
  ReplaceType: "",
  CannibalisedAge: "",
  MaintenanceDuration: "",
  FM: "",
  Remark: "",
};

const eventTypeOptions = ["Preventive", "Breakdown"];
const maintenanceTypeOptions = ["Replaced", "Repaired"];
const replaceTypeOptions = ["New", "Refurbished", "Cannibalised", "Duplicate"];
const failureModeOptions = [
  "Failure Mode 1",
  "Failure Mode 2",
  "Failure Mode 3",
];

const MaintenanceDataFormik = () => {
  const handleSubmit = (values) => {
    console.log(values);
    // Handle form submission here
  };
  const equipmentOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
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
        {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
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
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                setFieldValue("LMU", newValue ? newValue.label : "");
                setFieldTouched("LMU", true);
              }}
            />

            <Autocomplete
              options={eventTypeOptions}
              renderInput={(params) => (
                <TextField {...params} label="Event Type" variant="outlined" />
              )}
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                setFieldValue("EventType", newValue ? newValue : "");
                setFieldTouched("EventType", true);
              }}
            />

            <TextField
              label="Date"
              name="Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={values.Date}
              style={{ width: "400px" }}
              onChange={(event) => {
                setFieldValue("Date", event.target.value);
                setFieldTouched("Date", true);
              }}
            />

            <Autocomplete
              options={maintenanceTypeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Maintenance Type"
                  variant="outlined"
                />
              )}
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                setFieldValue("MaintenanceType", newValue ? newValue : "");
                setFieldTouched("MaintenanceType", true);
              }}
            />

            <Autocomplete
              options={replaceTypeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Replace Component Type"
                  variant="outlined"
                />
              )}
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                setFieldValue("ReplaceType", newValue ? newValue : "");
                setFieldTouched("ReplaceType", true);
              }}
            />

            <TextField
              label="Cannibalised Age"
              name="CannibalisedAge"
              type="number"
              fullWidth
              variant="outlined"
              value={values.CannibalisedAge}
              style={{ width: "400px" }}
              onChange={(event) => {
                setFieldValue("CannibalisedAge", event.target.value);
                setFieldTouched("CannibalisedAge", true);
              }}
            />
            <div>
              <TextField
                label="Maintenance Duration"
                name="MaintenanceDuration"
                type="number"
                fullWidth
                variant="outlined"
                value={values.MaintenanceDuration}
                style={{ width: "400px" }}
                onChange={(event) => {
                  setFieldValue("MaintenanceDuration", event.target.value);
                  setFieldTouched("MaintenanceDuration", true);
                }}
              />
            </div>

            <Autocomplete
              options={failureModeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Failure Mode"
                  variant="outlined"
                />
              )}
              style={{ width: "400px" }}
              onChange={(event, newValue) => {
                setFieldValue("FM", newValue ? newValue : "");
                setFieldTouched("FM", true);
              }}
            />

            <TextField
              label="Remark"
              name="Remark"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={values.Remark}
              style={{ width: "400px" }}
              onChange={(event) => {
                setFieldValue("Remark", event.target.value);
                setFieldTouched("Remark", true);
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

export default MaintenanceDataFormik;
