import React, { useState } from "react";
import CmmsSysConfig from "./CmmsSysConfig";
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
import { useSelector } from "react-redux";

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
  const currentlySelected=useSelector((state)=>state.userSelection.currentSelection);
  console.log(currentlySelected);
  const formik = useFormik({
    initialValues: {
      shipName: '',
      department: '',
      equipmentName: '',
      equipmentCode: '',
      nomenclature: '',
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
        padding: "2rem", // Adjusted padding
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}> {/* Adjusted spacing */}
          {formik.values.registerAll ? (
            <>
              <Grid item xs={12} sm={6}> {/* Full width on small screens, half on larger screens */}
                <TextField
                  id={InputFields[0].name}
                  name={InputFields[0].name}
                  label={InputFields[0].label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[InputFields[0].name]}
                  variant="outlined"
                  fullWidth
                  style={{ textAlign: "center" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}> {/* Full width on small screens, half on larger screens */}
                <TextField
                  id={InputFields[1].name}
                  name={InputFields[1].name}
                  label={InputFields[1].label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[InputFields[1].name]}
                  variant="outlined"
                  fullWidth
                  style={{ textAlign: "center" }}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <CmmsSysConfig />
            </Grid>
          )}
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ height: "3em", marginTop: "20px", width: "100%" }}
            >
              Submit
            </Button>
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
