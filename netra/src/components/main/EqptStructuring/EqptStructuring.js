import { Button, Grid, makeStyles } from "@material-ui/core";
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

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
});

function EqptStructuring() {
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
    },
    //validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      const { platform, platformType, system, systemType } = values;
      console.log(selectedInputs);
      const platformId = uuid();
      const systemId = uuid();
      debugger;
      const treeNodes = [
        {
          name: system,
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

  const onAddNewChildField = () => {
    setChildInputFields((prevstate) => {
      // const stateLen = prevstate.length;
      // // return [...prevstate, stateLen + 1];
      return [...prevstate, { childName: "", childPartId: "" }];
    });
  };
  const onDeleteChildField = (index) => {
    const childCopy = [...childInputFields];
    childCopy.splice(index, 1);
    setChildInputFields(childCopy);
  };
  const parentOnChange = (e, value) => {
    debugger
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
  const handleChildChange = (index, e) => {
    let newArr = [...childInputFields];
    newArr[index][e.target.name] = e.target.value;
    setChildInputFields(newArr);
  };

  return (
    <div className={classes.root}>
      <div className={classes.form}>
      <div className={classes.header}>Add New Equipment</div>
      <div>
        <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
          <div className={classes.formrow1}>
            <div className={classes.field1}>
              <LabelToolTip label="System Name" info="Info" />
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
              <LabelToolTip label="System Type" info="Info" />
              <CustomTextInput
                className={classes.fullWidth}
                id="systemType"
                name="systemType"
                value={formik.values.systemType}
                onChange={formik.handleChange}
                disabled={disableButton}
              ></CustomTextInput>
            </div>
          </div>
          <div className={classes.parent}>
            <div style={{ width: "400px" }}>
              <LabelToolTip label="Parent Component" />
              <AutoSelect
                fields={fData}
                onChange={parentOnChange}
                value={parentFiledValue}
              ></AutoSelect>
            </div>
            <div style={{ marginTop: "20px",marginRight:'2%' }}>
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
                  Update
                </Button>
              )}
            </div>
          </div>
        </form>
        </div>
        <div className={classes.formrow2}>
          {/* //onSubmit={updateChildTree} ref={childForm} */}

          {/* This is the end */}
          <form onSubmit={updateChildTree}>
            <div className={classes.child}>
              <Grid container>
                <Grid container item spacing={4}>
                  <Grid item xs={5}>
                    <LabelToolTip label="Child Component Name" />
                  </Grid>
                  <Grid item xs={5}>
                    <LabelToolTip label="Part Code" />
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
                {childInputFields.map((child, item) => {
                  return (
                    <Grid container item key={item} spacing={4}>
                      <Grid item xs={5} style={{ marginTop: "10px" }}>
                        <CustomTextInput
                          className={classes.fullWidth}
                          name="childName"
                          // id="childName"
                          value={child.childName}
                          onChange={(e) => handleChildChange(item, e)}
                        />
                      </Grid>
                      <Grid item xs={5} style={{ marginTop: "10px" }}>
                        <CustomTextInput
                          className={classes.fullWidth}
                          name="childPartId"
                          // id="partId"
                          value={child.childPartId}
                          onChange={(e) => handleChildChange(item, e)}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: "35px" }}>
                        <DeleteIcon
                          fontSize="medium"
                          onClick={() => {
                            onDeleteChildField(item);
                          }}
                        />
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
      </div>
      <div className={classes.tree}>
        <div className={classes.treeChild}>
          {/* <FullscreenIcon style={{ float: "right", marginRight: "25px" }} /> */}
          <TreeComponent height='400px'></TreeComponent>
          {/* <div></div> */}
        </div>
      </div>
    </div>
  );
}

export default EqptStructuring;