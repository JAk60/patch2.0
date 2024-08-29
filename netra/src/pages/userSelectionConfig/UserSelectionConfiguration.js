import { Button, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import styles from "./UserSelectionConfiguration.module.css";
import LabelToolTip from "../../components/main/EqptStructuring/LabelToolTip/LabelToolTip";
import classes from "./EqptStructuring.module.css";
import { useFormik } from "formik";
import CustomTextInput from "../../ui/Form/CustomTextInput";
const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
});


const UserSelectionConfiguration = (props) => {
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Close",
      showSnackBar: false,
    });
  };

  const classesButton = useStyles();


  const formik = useFormik({
    initialValues: {
      command: "",
      ship_name: "",
      department: "",
      shipClass: "",
      shipC: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      debugger;
      //   const { platform, platformType, system, systemType } = values;
      console.log(values);
      fetch("/addUserSelectionData", {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data)
          if (data.code === 1) {
            // resetForm()
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
        })
    },
  });




  return (
    <>
      <Navigation />
      <div className={styles.body}>
        <div className={styles.table}>
          <div className={classes.form}>
            <div className={classes.header}>Add Ship Details</div>
            {shipConfiguration()}

          </div>
        </div>
      </div>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );

  function shipConfiguration() {
    return <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
      <div className={classes.formrow1}>
        <div className={classes.field1}>
          <LabelToolTip label="Command Name" info="Command to which the ship belong" />
          <CustomTextInput
            className={classes.fullWidth}
            id="command"
            name="command"
            value={formik.values.command}
            onChange={formik.handleChange}
          ></CustomTextInput>
        </div>
        <div className={classes.field1}>
          <LabelToolTip label="Ship Category" info="Category to which the ship belong" />
          <CustomTextInput
            className={classes.fullWidth}
            id="shipC"
            name="shipC"
            value={formik.values.shipC}
            onChange={formik.handleChange}
          ></CustomTextInput>
        </div>
      </div>
      <div className={classes.formrow1}>
        <div className={classes.field1}>
          <LabelToolTip label="Ship Class" info="Class to which the ship belong" />
          <CustomTextInput
            className={classes.fullWidth}
            id="shipClass"
            name="shipClass"
            value={formik.values.shipClass}
            onChange={formik.handleChange}
          ></CustomTextInput>
        </div>
        <div className={classes.field1}>
          <LabelToolTip label="Department Name" info="Department to which the ship belong" />
          <CustomTextInput
            className={classes.fullWidth}
            id="department"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
          ></CustomTextInput>
        </div>
      </div>
      <div className={classes.formrow1}>
        <div className={classes.field1}>
          <LabelToolTip label="Ship Name" info="Name of ship" />
          <CustomTextInput
            className={classes.fullWidth}
            id="ship_name"
            name="ship_name"
            value={formik.values.ship_name}
            onChange={formik.handleChange}
          ></CustomTextInput>
        </div>
        <div className={classes.field1}>
          <Button
            className={classesButton.root}
            variant="contained"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    </form>;
  }
};

export default UserSelectionConfiguration;
