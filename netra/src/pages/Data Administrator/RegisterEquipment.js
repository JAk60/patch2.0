import React, { useState } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  Grid,
  Container,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const RegisterEquipment = () => {
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });

  const InputFields = [
    { name: "shipName", label: "Ship Name" },
    { name: "nomenclature", label: "Nomenclature" },
  ];

  const formik = useFormik({
    initialValues: {
      shipName: "",
      nomenclature: "",
      registerAll: false,
    },
    onSubmit: async (values) => {
      console.log(values);
      fetch("/sysmetl", {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code === 1) {
            setSnackBarMessage({
              severity: "success",
              message: data.message,
              showSnackBar: true,
            });
          } else {
            setSnackBarMessage({
              severity: "error",
              message: data.message,
              showSnackBar: true,
            });
          }
        });
    },
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Close",
      showSnackBar: false,
    });
  };

  return (
    <Container
      style={{
       marginTop: "7rem",
        padding: "7rem",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1}>
          {formik.values.registerAll ? (
            <Grid item lg={6} key={InputFields[0].name}>
              <TextField
                id={InputFields[0].name}
                name={InputFields[0].name}
                label={InputFields[0].label}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[InputFields[0].name]}
                variant="outlined"
                fullWidth
                margin="normal"
                style={{ width: "450px", textAlign: "center" }}
              />
            </Grid>
          ) : (
            InputFields.map((field) => (
              <Grid item lg={6} key={field.name}>
                <TextField
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  style={{ width: "450px", textAlign: "center" }}
                />
              </Grid>
            ))
          )}
          <Grid item lg={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ height: "4em", marginTop: "20px" }}
            >
              Submit
            </Button>
          </Grid>
          <Grid item lg={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.registerAll}
                  onChange={formik.handleChange}
                  name="registerAll"
                />
              }
              label="Register All Equipments at Once"
            />
          </Grid>
        </Grid>
      </form>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </Container>
  );
};

export default RegisterEquipment;
