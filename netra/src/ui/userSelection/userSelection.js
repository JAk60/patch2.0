import React, { useState, useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { components } from "./userSelectionData";
import CustomSelect from "../Form/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import { Route } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const SelectStyles = makeStyles({
  spacing: {
    marginLeft: "10px",
  },
});

function UserSelection(props) {
  UserSelection.defaultProps = {
    alignment: "horizontal",
    inputWidth: "200px",
  };

  const [userSelectionData, setUserSelectionData] = useState([]);
  const [userSelectionEqData, setUserSelectionEqData] = useState([]);
  const [nomenclature, setNomenclature] = useState(""); // Added state for nomenclature dropdown
  const dispatch = useDispatch();
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );

  useEffect(() => {
    fetch("/fetch_user_selection", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const userData = data["data"];
        const eqData = data["eqData"];
        const shipName = userData.map((x) => x.shipName);
        const components = data["uniq_eq_data"];
        setUserSelectionData(userData);
        setUserSelectionEqData(eqData);
        dispatch(
          userActions.onFirstLoad({
            filteredData: { shipName: shipName },
            componentsData: components,
          })
        );
      });
  }, []);

  const handleShipNameChange = (e) => {
    const shipName = e.currentTarget.innerText;
    const category = userSelectionData
      .filter((x) => x.shipName === shipName)
      .map((x) => x.shipCategory);
    const shipClass = userSelectionData
      .filter((x) => x.shipName === shipName)
      .map((x) => x.shipClass);
    const command = userSelectionData
      .filter((x) => x.shipName === shipName)
      .map((x) => x.command);
    const dept = userSelectionData
      .filter((x) => x.shipName === shipName)
      .map((x) => x.department);
    const d = {
      shipCategory: category,
      shipClass: shipClass,
      command: command,
      department: dept,
    };
    dispatch(
      userActions.onChangeLoad({
        filteredData: d,
        currentShipName: { shipName: shipName },
      })
    );
  };

  const onShipCategoryChange = (e) => {
    let data = e.currentTarget.innerText;
    data = { shipCategory: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onShipClassChange = (e) => {
    let data = e.currentTarget.innerText;
    data = { shipClass: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onCommandChange = (e) => {
    let data = e.currentTarget.innerText;
    data = { command: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onDepartmentChange = (e) => {
    let data = e.currentTarget.innerText;
    let eqData = userSelectionEqData
      .filter(
        (x) =>
          x.command === currentSelection.command &&
          x.department === data &&
          x.shipName === currentSelection.shipName &&
          x.shipCategory === currentSelection.shipCategory &&
          x.shipName === currentSelection.shipName &&
          x.shipClass === currentSelection.shipClass
      )
      .map((x) => x.equipmentName);
    data = { department: data };
    eqData = { equipmentName: eqData };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    dispatch(userActions.populateEqName({ filteredData: eqData }));
  };

  const onEquipmentChange = (e) => {
    let data = e.currentTarget.innerText;
    data = { equipmentName: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onEquipmentCodeChange = (e) => {
    let data = e.currentTarget.innerText;
    data = { equipmentCode: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onNomenclatureChange = (e) => {
    const selectedNomenclature = e.currentTarget.innerText;
    setNomenclature(selectedNomenclature);
  };

  const SelectClasses = SelectStyles();
  let colwidth = 4;
  props.alignment === "vertical" ? (colwidth = 12) : (colwidth = 3);

  return (
    <Grid container spacing={3}>
      <Grid item xs={colwidth}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: props.inputWidth }}
            id="command"
            label="Command Name"
            fields={customSelectData["command"]}
            onChange={onCommandChange}
            value={currentSelection["command"]}
          />
        </div>
      </Grid>
      <Grid item xs={colwidth}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: props.inputWidth }}
            id="ship-category"
            label="Ship Category"
            fields={customSelectData["shipCategory"]}
            onChange={onShipCategoryChange}
            value={currentSelection["shipCategory"]}
          />
        </div>
      </Grid>
      <Grid item xs={colwidth}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: props.inputWidth }}
            id="ship-class"
            label="Ship Class"
            fields={customSelectData["shipClass"]}
            onChange={onShipClassChange}
            value={currentSelection["shipClass"]}
          />
        </div>
      </Grid>
      <Grid item xs={colwidth}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: props.inputWidth }}
            id="department"
            label="Department"
            fields={customSelectData["department"]}
            onChange={onDepartmentChange}
            value={currentSelection["department"]}
          />
        </div>
      </Grid>
      <Grid item xs={colwidth}>
        <div className={SelectClasses.spacing}>
          <CustomSelect
            style={{ width: props.inputWidth }}
            id="ship-name"
            label="Ship Name"
            fields={customSelectData["shipName"]}
            onChange={handleShipNameChange}
            value={currentSelection["shipName"]}
          />
        </div>
      </Grid>
      <Route
        path={[
          "/system_config/redundancy_info",
          "/system_config/maintenance_info",
          "/system_config/failure_mode",
          "/system_config/duty_cycle",
          "/system_config/",
          "/data_manager/",
          "/phase_manager/",
          "/HEP/",
          "/maintenance_allocation/",
          "/add_system_doc/",
          "/rul",
          "/optimize",
        ]}
      >
        <Grid item xs={colwidth}>
          <div className={SelectClasses.spacing}>
            <CustomSelect
              style={{ width: props.inputWidth }}
              id="equipment-name"
              label="Equipment Name"
              fields={customSelectData["equipmentName"]}
              onChange={onEquipmentChange}
              value={currentSelection["equipmentName"]}
            />
          </div>
        </Grid>
      </Route>
      <Route path={[
        "/system_config/redundancy_info",
        "/system_config/maintenance_info",
        "/system_config/failure_mode",
        "/system_config/duty_cycle",
        "/system_config/",
        "/data_manager/",
        "/phase_manager/",
        "/HEP/",
        "/maintenance_allocation/",
        "/add_system_doc/",
        "/rul",
        "/optimize",
      ]}>
        <Grid item xs={colwidth}>
          <div className={SelectClasses.spacing}>
            <CustomSelect
              style={{ width: props.inputWidth }}
              id="nomenclature"
              label="Nomenclature"
              fields={customSelectData["nomenclature"]}
              onChange={onNomenclatureChange}
              value={nomenclature}
            />
          </div>
        </Grid>
      </Route>
    </Grid>
  );
}

export default UserSelection;