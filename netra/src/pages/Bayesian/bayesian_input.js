import React, { useEffect, useState } from "react";
import NewModule from "../../components/module/NewModule";
import Navigation from "../../components/navigation/Navigation";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./UserSelectionConfiguration.module.css";
import { AgGridColumn } from "ag-grid-react";
import Table from "../../ui/Table/DataManagerTable";
import { Button, makeStyles, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import ustyles from '../systen_configuration/SystemConfiguration.module.css'
//From Add new equipment form
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import classes from "./EqptStructuring.module.css";
import LabelToolTip from "../../components/main/EqptStructuring/LabelToolTip/LabelToolTip";
// import Tree from "./Tree";
// import TreeComponent from "../../sortableTree/SortableTree";
import CustomTextInput from "../../ui/Form/CustomTextInput";
import CustomSelect from "../../ui/Form/CustomSelect";
import AutoSelect from "../../ui/Form/AutoSelect";
import { useFormik } from "formik";
import { v4 as uuid } from "uuid"; 
import { Route } from "react-router-dom/cjs/react-router-dom.min";
const useStyles = makeStyles({
    root: {
      margin: "0 2.5em",
    },
  });
  
const SystemStyles = makeStyles({
  formControl: {
    margin: "2rem",
    minWidth: 200,
  },
  Submit: {
    margin: "2rem",
  },
  buttons: {
    minWidth: 150,
    marginLeft: 10,
    marginTop: 15,
    float: "right",
  },
});
const Bayesian_Inputs = (props) => {
  const SystemClasses = SystemStyles();
  const dispatch = useDispatch();
  const selectedInputs = useSelector(
    (state) => state.userSelection.currentSelection
  );

  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const [disableButton, setDisableButton] = useState(false);
  let fData = useSelector((state) => state.treeData.treeData);
//   const [gridApi, setGridApi] = useState(null);
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
  const [parentFiledValue, setParentFieldValue] = useState({
    title: "",
    name: "",
    children: [],
    id: "",
    eqType: "",
    parentName: "",
    parentId: "",
    lmu: 1,
  });

  const classesButton = useStyles();
  const parentOnChange = (e, value) => {
    debugger
    setParentFieldValue(value);
  };
  const clearForm = (e) => {
    e.preventDefault();
    setDisableButton(false);
    dispatch(treeDataActions.setTreeData({ treeData: [] }));
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
        command: "",
      ship_name: "",
      department: "",
      shipClass: "",
      shipC: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values, {resetForm}) => {
      // alert(JSON.stringify(values, null, 2));
      debugger;
    //   const { platform, platformType, system, systemType } = values;
      console.log(values);
      fetch("/addUserSelectionData", {
        method: "POST",
        body: JSON.stringify({values}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
            if (data.code == 1){
                // resetForm()
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
        }else{
            setSnackBarMessage({
                severity: "error",
                message: data.message,
                showSnackBar: true,
              });
        }
        })
    //   
    //   const platformId = uuid();
    //   const systemId = uuid();
    //   debugger;
    //   const treeNodes = [
    //     {
    //       name: system,
    //       id: systemId,
    //       eqType: systemType,
    //       parentName: selectedInputs["shipName"],
    //       parentId: null,
    //       parent: null,
    //       children: [],
    //       lmu: 1,
    //       command: selectedInputs["command"],
    //       department: selectedInputs["department"],
    //       shipCategory: selectedInputs["shipCategory"],
    //       shipClass: selectedInputs["shipClass"],
    //       shipName: selectedInputs["shipName"],
    //     },
    //   ];
    //   const updateEqStore = {
    //     equipmentName: system,
    //     equipmentCode: systemType,
    //   };
    //   const filteredData = {
    //     equipmentName: [system],
    //     equipmentCode: [systemType],
    //   };
    //   dispatch(treeDataActions.addElement({ data: treeNodes }));
    //   dispatch(
    //     userActions.onAddingEquipmentName({
    //       selectedData: updateEqStore,
    //       filteredData: filteredData,
    //     })
    //   );
    //   setDisableButton(true);
    },
  });



  //Save Button Handler
const onSaveButtonClickHandler = () => {
  alert("Hello")
} 

const onLoadTreeStructure = () => {
  fetch("/fetch_system", {
    method: "POST",
    body: JSON.stringify({
      system: currentSelection["equipmentName"],
      ship_name: currentSelection["shipName"],
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((d) => {
      let treeD = d["treeD"];
      let failureModes = d["failureMode"];
      dispatch(
        treeDataActions.setTreeData({
          treeData: treeD,
          failureModes: failureModes,
        })
      );
    });
};

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        {/* <div className={styles.user}>
          <Button
            variant="contained"
            color="primary"
            className={SystemClasses.buttons}
            onClick={onSaveButtonClickHandler}
          >
            Save
          </Button>
        </div> */}
        <div className={ustyles.flex} style={{ marginTop: "5rem" }}>
          <div className={ustyles.user} ><UserSelection /></div>
          <div className={styles.buttons}>
          <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={onLoadTreeStructure}
              >
                Load System
              </Button>
        </div>
          </div>
        
        <div className={styles.table}>
          {/* <Table
            rowData={rowState}
            columnDefs={MProfileColumns}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
          /> */}
         <div className={classes.form}>
      <div className={classes.header}>Add Current Data</div>
        <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
          <div className={classes.formrow1}>
            <div className={classes.field1}>
              <LabelToolTip label="Component Current Age" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="command"
                name="command"
                value={formik.values.command}
                onChange={formik.handleChange}
                disabled={disableButton}
              ></CustomTextInput>
            </div>
            <div className={classes.field1}>
              <LabelToolTip label="Select Parameter" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="shipC"
                name="shipC"
                value={formik.values.shipC}
                onChange={formik.handleChange}
                disabled={disableButton}
              ></CustomTextInput>
            </div>
          </div>
          <div className={classes.formrow1}>
            <div className={classes.field1}>
              <LabelToolTip label="Current Parameter Value" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="cpv"
                name="cpv"
                value={formik.values.shipClass}
                onChange={formik.handleChange}
                disabled={disableButton}
              ></CustomTextInput>
            </div>
            <div className={classes.field1}>
              <LabelToolTip label="Projected Days" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="p_days"
                name="p_days"
                value={formik.values.department}
                onChange={formik.handleChange}
                disabled={disableButton}
              ></CustomTextInput>
            </div>
          </div>
          <div className={classes.formrow1}>
            <div className={classes.field1}>
              <LabelToolTip label="Number of Phases" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="n_phases"
                name="n_phases"
                value={formik.values.ship_name}
                onChange={formik.handleChange}
                disabled={disableButton}
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
        </form>
       
      </div>
          {/* <div className={styles.tableFooter}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              onClick={() => AddRow()}
            >
              Add Row
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              onClick={() => deleteRows()}
            >
              Delete Rows
            </Button>
          </div> */}
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
};

export default Bayesian_Inputs;
