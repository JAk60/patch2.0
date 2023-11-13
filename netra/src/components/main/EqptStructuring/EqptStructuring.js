import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  makeStyles,
} from "@material-ui/core";
import React, { useState, useRef } from "react";
import classes from "./EqptStructuring.module.css";
import LabelToolTip from "./LabelToolTip/LabelToolTip";
// import Tree from "./Tree";
import TreeComponent from "../../sortableTree/SortableTree";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomTextInput from "../../../ui/Form/CustomTextInput";
import CustomSelect from "../../../ui/Form/CustomSelect";
import AutoSelect from "../../../ui/Form/AutoSelect";
import { useFormik } from "formik";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../../store/TreeDataStore";
import xData from "../../sortableTree/SortableTreeData";
import { userActions } from "../../../store/ApplicationVariable";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AgGridColumn } from "ag-grid-react";
import Table from "../../../ui/Table/Table";
import { flushSync } from "react-dom";


const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabView: {

  }
});

function EqptStructuring(props) {
  const [tab, setTab] = useState(0);
  const [selectedOption, setSelectedOption] = useState("addNew");
  const dispatch = useDispatch();
  let fData = useSelector((state) => state.treeData.treeData);
  const selectedInputs = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const systemConfigurationData = useSelector(
    (state) => state.treeData.sortTreeData
  );
  const [disableButton, setDisableButton] = useState(false);
  const classesButton = useStyles();
  const [childInputFields, setChildInputFields] = useState([]);
  // const customSelectFields = treeData.map((x) => `${x.title}`);
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

  const [rowDataTable, setRowDataTable] = useState([]);

  const DCcolumnDefs = [
    <AgGridColumn
      field="name"
      headerName="Component Name"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="nomenclature"
      headerName="Nomenclature"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="eqType"
      headerName="CMMS ID"
      type="number"
      width={500}
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const fileInputRef = useRef(null);

  const clearForm = (e) => {
    e.preventDefault();
    setDisableButton(false);
    dispatch(treeDataActions.setTreeData({ treeData: [] }));
    formik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      platform: "",
      platformType: "",
      system: "",
      systemType: "",
      nomenclature: ""
    },
    //validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      const { platform, platformType, system, systemType, nomenclature } = values;
      console.log(selectedInputs);
      const platformId = uuid();
      const systemId = uuid();
      debugger;
      const treeNodes = [
        {
          name: system,
          nomenclature: nomenclature,
          id: systemId,
          eqType: systemType,
          parentName: selectedInputs["shipName"],
          parentId: null,
          parent: null,
          children: [],
          lmu: 1,
          command: selectedInputs["command"],
          department: selectedInputs["department"],
          shipCategory: selectedInputs["shipCategory"],
          shipClass: selectedInputs["shipClass"],
          shipName: selectedInputs["shipName"],
        },
      ];
      const updateEqStore = {
        equipmentName: system,
        equipmentCode: systemType,
      };
      const filteredData = {
        equipmentName: [system],
        equipmentCode: [systemType],
      };
      dispatch(treeDataActions.addElement({ data: treeNodes }));
      dispatch(
        userActions.onAddingEquipmentName({
          selectedData: updateEqStore,
          filteredData: filteredData,
        })
      );
      setDisableButton(true);
    },
  });

  const saveData = () => {
    fetch("/upload_oem_data", {
      method: "POST",
      body: JSON.stringify({
        "data": rowDataTable
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
  }

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const rows = csvData.split('\n');
        const parsedData = [];

        // Assuming the first row contains column headers
        const headers = rows[0].split(',').map(header => header.trim());

        for (let i = 1; i < rows.length; i++) {
          const rowObject = {
            name: "",
            id: "",
            eqType: "",
            parentName: selectedInputs["shipName"],
            parentId: null,
            parent: null,
            children: [],
            lmu: 1,
            command: selectedInputs["command"],
            department: selectedInputs["department"],
            shipCategory: selectedInputs["shipCategory"],
            shipClass: selectedInputs["shipClass"],
            shipName: selectedInputs["shipName"],
            nomenclature: "",
            failure_modes: [],
            failure_mode_ids: []
          }
          const rowData = rows[i].split(',');
          rowObject.id = rowData[0]
          rowObject.name = rowData[1]
          rowObject.failure_modes = rowData[6]
          rowObject.failure_mode_ids = rowData[7]
          rowObject.eqType = ""
          parsedData.push(rowObject)
          if (rowObject.name !== undefined) {
            setRowDataTable([
              ...rowDataTable,
              rowObject
            ])
          }
        }
      };

      reader.readAsText(file);
    }
  };


  const onAddNewChildField = () => {
    setChildInputFields((prevstate) => {
      // const stateLen = prevstate.length;
      // // return [...prevstate, stateLen + 1];
      return [...prevstate, { childName: "", childPartId: "", nomenclature: "" }];
    });
  };
  const onDeleteChildField = (index) => {
    const childCopy = [...childInputFields];
    childCopy.splice(index, 1);
    setChildInputFields(childCopy);
  };
  const parentOnChange = (e, value) => {
    debugger;
    setParentFieldValue(value);
  };
  const updateChildTree = (e) => {
    e.preventDefault();
    //Make tree object
    const treeNodes = childInputFields.map((x) => {
      const cUuid = uuid();
      return {
        name: x.childName,
        children: [],
        id: cUuid,
        eqType: x.childPartId,
        nomenclature: x.nomenclature,
        parentName: parentFiledValue.name,
        parentId: parentFiledValue.id,
        parent: parentFiledValue.id,
        lmu: 1,
        command: selectedInputs["command"],
        department: selectedInputs["department"],
        shipCategory: selectedInputs["shipCategory"],
        shipClass: selectedInputs["shipClass"],
        shipName: selectedInputs["shipName"],
      };
    });
    dispatch(
      treeDataActions.addChildElement({
        children: treeNodes,
        parentId: parentFiledValue.id,
      })
    );
    setParentFieldValue({
      title: "",
      name: "",
      children: [],
      id: "",
      eqType: "",
      parentName: "",
      parentId: "",
      lmu: 1,
    });
    // Autocomplete zero
    setChildInputFields([]);
  };

  function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj; // Return non-objects as-is
    }

    if (Array.isArray(obj)) {
      return obj.map(deepCopy); // Recursively copy array elements
    }

    const copy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]); // Recursively copy object properties
      }
    }

    return copy;
  }

  const addNewRow = () => {
    const newRow = deepCopy(rowDataTable[0]);
    setRowDataTable([
      ...rowDataTable,
      newRow
    ])
  }
  const handleChildChange = (index, e) => {
    let newArr = [...childInputFields];
    newArr[index][e.target.name] = e.target.value;
    setChildInputFields(newArr);
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const TabViewRendrer = () => {
    switch (tab) {
      case 0:
        return (
          <>
            <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
              <div className={classes.formrow1}>
                <div className={classes.field1}>
                  <LabelToolTip label="Equipment Name" info="Info" />
                  <CustomTextInput
                    className={classes.fullWidth}
                    id="system"
                    name="system"
                    value={formik.values.system}
                    onChange={formik.handleChange}
                    disabled={disableButton}
                  ></CustomTextInput>
                </div>
                <div className={classes.field1}>
                  <LabelToolTip label="CMMS ID" info="Info" />
                  <CustomTextInput
                    className={classes.fullWidth}
                    id="systemType"
                    name="systemType"
                    value={formik.values.systemType}
                    onChange={formik.handleChange}
                    disabled={disableButton}
                  ></CustomTextInput>
                </div>
                <div className={classes.field1}>
                  <LabelToolTip label="Nomenclature" info="Info" />
                  <CustomTextInput
                    className={classes.fullWidth}
                    id="nomenclature"
                    name="nomenclature"
                    value={formik.values.nomenclature}
                    onChange={formik.handleChange}
                    disabled={disableButton}
                  ></CustomTextInput>
                </div>
              </div>
              <div className={classes.parent}>
                <div style={{ marginTop: "20px", marginRight: "2%" }}>
                  <Button
                    className={classesButton.root}
                    variant="contained"
                    color="primary"
                    type="reset"
                    onClick={clearForm}
                  >
                    Clear
                  </Button>
                  {!disableButton && (
                    <Button variant="contained" color="primary" type="submit">
                      Create
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </>
        )
      case 1:
        return (
          <>
            <div className={classes.formrow2}>
              {/* //onSubmit={updateChildTree} ref={childForm} */}

              {/* This is the end */}
              <form onSubmit={updateChildTree}>
                <div style={{ width: "400px", margin: "20px" }}>
                  <LabelToolTip label="Parent Component" />
                  <AutoSelect
                    fields={fData}
                    onChange={parentOnChange}
                    value={parentFiledValue}
                  ></AutoSelect>
                </div>
                <div className={classes.child} style={{ margin: "20px" }}>
                  <Grid container>
                    <Grid container item spacing={4}>
                      <Grid item xs={3}>
                        <LabelToolTip label="Child Component Name" />
                      </Grid>
                      <Grid item xs={3}>
                        <LabelToolTip label="CMMS ID" />
                      </Grid>
                      <Grid item xs={3}>
                        <LabelToolTip label="Nomenclature" />
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </Grid>
                    {childInputFields.map((child, item) => {
                      return (
                        <Grid container item key={item} spacing={4}>
                          <Grid item xs={3} style={{ marginTop: "20px" }}>
                            <CustomTextInput
                              className={classes.fullWidth}
                              name="childName"
                              // id="childName"
                              value={child.childName}
                              onChange={(e) => handleChildChange(item, e)}
                            />
                          </Grid>
                          <Grid item xs={3} style={{ marginTop: "20px" }}>
                            <CustomTextInput
                              className={classes.fullWidth}
                              name="childPartId"
                              // id="partId"
                              value={child.childPartId}
                              onChange={(e) => handleChildChange(item, e)}
                            />
                          </Grid>
                          <Grid item xs={3} style={{ marginTop: "20px" }}>
                            <CustomTextInput
                              className={classes.fullWidth}
                              name="nomenclature"
                              // id="partId"
                              value={child.nomenclature}
                              onChange={(e) => handleChildChange(item, e)}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            style={{
                              display: "flex",
                              paddingLeft: "-300px",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "24px 0",
                              padding: 0,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                padding: "5px",
                                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
                                borderRadius: "50%",
                              }}
                            >
                              <DeleteIcon
                                fontSize="medium"
                                onClick={() => {
                                  onDeleteChildField(item);
                                }}
                              />
                            </span>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
                <div
                  style={{
                    float: "right",
                    marginTop: "30px",
                    marginBottom: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    //onClick={updateChildTree}
                    type="submit"
                    disabled={!(childInputFields.length > 0)}
                  >
                    Update All
                  </Button>
                  <Button
                    style={{ marginLeft: "20px" }}
                    variant="contained"
                    color="primary"
                    onClick={onAddNewChildField}
                  >
                    Add
                  </Button>
                </div>
              </form>
            </div>
          </>
        )
      case 2:
        return (
          <>
            {
              rowDataTable.length > 0 ? (
                <>
                  <div className={classes.formrow3}>
                    <Table
                      columnDefs={DCcolumnDefs}
                      rowData={rowDataTable}
                      tableUpdate={updateFinalRowData}
                      height={250}
                    />
                  </div>
                  <div style={{display: "flex", justifyContent: "flex-end",  gap: "15px" }}>
                    <Button
                        className={classes.buttons}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "50px", width: "120px"}}
                        onClick={addNewRow}
                      >
                        Add Row</Button>
                      <Button
                        className={classes.buttons}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "50px", width: "100px" }}
                        onClick={saveData}
                      >
                        submit</Button>
                    </div>
                </>
              ) : (
                <div style={{height: "300px", display: "flex", justifyContent: "center", alignItems: "center"}} className={classes.importBtnContainer}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                  <Button
                    className={classes.buttons}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "50px" }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Import File
                  </Button>
                </div>
              )
            }
          </>
        )
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          className={classes.tabView}
        >
          <Tab label="Create Equipment" />
          <Tab label="Add Child Equipments" />
          <Tab label="Import OEM Data" />
        </Tabs>
        {TabViewRendrer()}
      </div>
      <div className={classes.tree}>
        <div className={classes.treeChild}>
          {/* <FullscreenIcon style={{ float: "right", marginRight: "25px" }} /> */}
          <TreeComponent height="400px"></TreeComponent>
          {/* <div></div> */}
        </div>
      </div>
    </div>
  );
}

export default EqptStructuring;
