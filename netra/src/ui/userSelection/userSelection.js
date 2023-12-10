import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { userActions } from "../../store/ApplicationVariable";
import CustomSelect from "../Form/CustomSelect";

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
  const dispatch = useDispatch();
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(props.hello, "im coming through rul");

        const response = await fetch("/fetch_user_selection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          // Handle the error here if needed
          console.error("Error fetching user selection data");
          return;
        }

        const data = await response.json();
        const userData = data["data"];
        const eqData = data["eqData"];
        let shipName = userData.map((x) => x.shipName);

        shipName = [...new Set(shipName)];
        const components = data["uniq_eq_data"];
        setUserSelectionData(userData);
        setUserSelectionEqData(eqData);
        dispatch(
          userActions.onFirstLoad({
            filteredData: { shipName: shipName },
            componentsData: components,
          })
        );
      } catch (error) {
        console.error("Error in fetching user selection data:", error);
      }
    };

    fetchData(); // Call the asynchronous function
  }, []); // Empty dependency array to run only on mount

  const handleShipNameChange = (e) => {
    const shipName = e.currentTarget.innerText;
    const filteredData = userSelectionData.filter(
      (x) => x.shipName === shipName
    );

    const uniqueCategories = [
      ...new Set(filteredData.map((x) => x.shipCategory)),
    ];
    const uniqueClasses = [...new Set(filteredData.map((x) => x.shipClass))];
    const uniqueCommands = [...new Set(filteredData.map((x) => x.command))];
    const uniqueDepartments = [
      ...new Set(filteredData.map((x) => x.department)),
    ];

    const d = {
      shipCategory: uniqueCategories,
      shipClass: uniqueClasses,
      command: uniqueCommands,
      department: uniqueDepartments,
    };

    dispatch(
      userActions.onChangeLoad({
        filteredData: d,
        currentShipName: { shipName: shipName },
      })
    );
  };

  const onShipCategoryChange = (e) => {
    let data = e.target.value;
    data = { shipCategory: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onShipClassChange = (e) => {
    let data = e.target.value;
    data = { shipClass: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onCommandChange = (e) => {
    let data = e.target.value;
    data = { command: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const onDepartmentChange = (e) => {
    let data = e.target.value;
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

    let normData = userSelectionEqData
      .filter(
        (x) =>
          x.command === currentSelection.command &&
          x.department === data &&
          x.shipName === currentSelection.shipName &&
          x.shipCategory === currentSelection.shipCategory &&
          x.shipName === currentSelection.shipName &&
          x.shipClass === currentSelection.shipClass
      )
      .map((x) => x.nomenclature);
    normData = [...new Set(normData)];
    eqData = [...new Set(eqData)];
    data = { department: data };
    eqData = { equipmentName: eqData };
    normData = { nomenclature: normData };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    dispatch(userActions.populateEqName({ filteredData: eqData }));
    dispatch(userActions.populateNom({ filteredData: normData }));
  };

  const onEquipmentChange = (e) => {
    let data = e.target.value;
    let normData = userSelectionEqData
      .filter(
        (x) =>
          x.command === currentSelection.command &&
          x.department === currentSelection.department &&
          x.shipName === currentSelection.shipName &&
          x.shipCategory === currentSelection.shipCategory &&
          x.shipName === currentSelection.shipName &&
          x.shipClass === currentSelection.shipClass &&
          x.equipmentName == data
      )
      .map((x) => x.nomenclature);

    console.log("nomenclature", normData);
    normData = [...new Set(normData)];
    console.log("nomenclature", normData);
    data = { equipmentName: data };
    normData = { nomenclature: normData };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    dispatch(userActions.populateNom({ filteredData: normData }));
  };

  const onNomenclatureChange = (e) => {
    let data = e.target.value;
    data = { nomenclature: data };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  // const onEquipmentCodeChange = (e) => {
  //   // let data = e.currentTarget.innerText;
  //   // data = { equipmentCode: data };
  //   // dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  //   let data = e.currentTarget.innerText;
  //   let eqData = userSelectionEqData
  //     .filter(
  //       (x) =>
  //         x.command === currentSelection.command &&
  //         x.department === data &&
  //         x.shipName === currentSelection.shipName &&
  //         x.shipCategory === currentSelection.shipCategory &&
  //         x.shipName === currentSelection.shipName &&
  //         x.shipClass === currentSelection.shipClass &&
  //         x.equipmentName === currentSelection.equipmentName
  //     )
  //     .map((x) => x.equipmentName);
  //   data = { department: data };
  //   eqData = { equipmentName: eqData };
  //   dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  //   dispatch(userActions.populateEqName({ filteredData: eqData }));
  // // };
  const SelectClasses = SelectStyles();
  let colwidth = 4;
  props.alignment === "vertical" ? (colwidth = 12) : (colwidth = 3);

  return (
    <Grid container spacing={3}>
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
            id="command"
            label="Command"
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
            id="department"
            label="Department"
            fields={customSelectData["department"]}
            onChange={onDepartmentChange}
            value={currentSelection["department"]}
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
              id="nomenclature"
              label="Nomenclature"
              fields={customSelectData["nomenclature"]}
              onChange={onNomenclatureChange}
              value={currentSelection["nomenclature"]}
            />
          </div>
        </Grid>
      </Route>
    </Grid>
  );
}
export default UserSelection;
