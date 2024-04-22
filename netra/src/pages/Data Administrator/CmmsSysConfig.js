import { TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
  },
  autocomplete: {
    margin: "1rem",
    minWidth: 250,
  },
  deleteButton: {
    margin: "1rem",
  },
});

export default function CmmsSysConfig() {
  const [allEquipmentData, setAllEquipmentData] = useState([]);
  const [shipsOptions, setShipOptions] = useState([]);
  const [departmentsOptions, setDepartmentOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [nomenclatureOptions, setNomenclatureOptions] = useState([]);
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/fetch_cmms_selection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = await response.json();
        console.log(data);

        // Extract unique ship names and departments
        const uniqueShips = [...new Set(data.map((item) => item.ship_name))];
        setShipOptions(uniqueShips);

        setAllEquipmentData(data);

        const components = data.map((item) => ({
          equipmentName: item.equipment,
          department: item.department,
          nomenclature: item.nomenclature,
        }));

        dispatch(
          userActions.onFirstLoad({
            filteredData: { shipName: uniqueShips },
            componentsData: components,
          })
        );
      } catch (error) {
        console.error("Error in fetching user selection data:", error);
      }
    };

    fetchData();
  }, []);

  const ShipChange = (e, value) => {
    setSelectedShip(value);
    setSelectedDepartment(""); // Reset department when ship changes
    const filteredDepartments = allEquipmentData
      .filter((equipment) => equipment.ship_name === value)
      .map((equipment) => equipment.department);
      console.log(filteredDepartments);
    setDepartmentOptions([...new Set(filteredDepartments)]);
    const data={shipName: value}
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const DepartmentChange = (e, value) => {
    setSelectedDepartment(value);
    const filteredEquipments = allEquipmentData
      .filter(
        (equipment) => equipment.ship_name === selectedShip && equipment.department === value
      )
      .map((equipment) => equipment.equipment);
    setEquipmentOptions([...new Set(filteredEquipments)]);
    const data={department: value}
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const EquipmentChange = (e, value) => {
    const selectedEquipment = value;
    const filteredNomenclature = allEquipmentData
      .filter(
        (equipment) =>
          equipment.ship_name === selectedShip &&
          equipment.department === selectedDepartment &&
          equipment.equipment === selectedEquipment
      )
      .map((equipment) => equipment.nomenclature);
    setNomenclatureOptions([...new Set(filteredNomenclature)]);
    const data={equipmentName: value}
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const NomenclatureChange = (e, values) => {
    const selectedNomenclatures = values || []; // Ensure it's an array
  
    if (selectedNomenclatures.includes("Select All")) {
      // If "Select All" is selected, set all nomenclatures except "Select All"
      const allNomenclatures = nomenclatureOptions.filter(option => option !== "Select All");
      const data = { nomenclature: allNomenclatures };
      dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    } else {
      let updatedNomenclatures = [...selectedNomenclatures];
  
      // Check if "Select All" is already selected
      const selectAllIndex = updatedNomenclatures.indexOf("Select All");
      if (selectAllIndex !== -1) {
        updatedNomenclatures.splice(selectAllIndex, 1); // Remove "Select All"
      }
  
      // If "Select All" was selected or all other options are selected, select all
      if (selectAllIndex !== -1 || updatedNomenclatures.length === nomenclatureOptions.length - 1) {
        updatedNomenclatures = nomenclatureOptions.filter(option => option !== "Select All");
      }
  
      const equipmentCodes = updatedNomenclatures.map((selectedNomenclature) => {
        // Filter the equipment data based on each selected nomenclature
        const filteredCmmsCode = allEquipmentData.find(
          (equipment) => equipment.nomenclature === selectedNomenclature
        );
  
        return filteredCmmsCode ? filteredCmmsCode.CMMSCode : null;
      });
  
      const data = { nomenclature: updatedNomenclatures };
      dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  
      const datac = { equipmentCode: equipmentCodes };
      dispatch(userActions.onChangeCurrentSelection({ selectedData: datac }));
    }
  };
  
  return (
    <>
      <Autocomplete
        className={classes.autocomplete}
        options={shipsOptions}
        getOptionLabel={(option) => option}
        onChange={ShipChange}
        renderInput={(params) => (
          <TextField {...params} label="Ship Name" variant="outlined" />
        )}
      />
      <Autocomplete
        className={classes.autocomplete}
        options={departmentsOptions}
        getOptionLabel={(option) => option}
        onChange={DepartmentChange}
        renderInput={(params) => (
          <TextField {...params} label="Department" variant="outlined" />
        )}
      />
      <Autocomplete
        className={classes.autocomplete}
        options={equipmentOptions}
        getOptionLabel={(option) => option}
        onChange={EquipmentChange}
        renderInput={(params) => (
          <TextField {...params} label="Equipment Name" variant="outlined" />
        )}
      />
      <Autocomplete
        multiple
        className={classes.autocomplete}
        options={["Select All", ...nomenclatureOptions]}
        getOptionLabel={(option) => option}
        onChange={NomenclatureChange}
        renderInput={(params) => (
          <TextField {...params} label="Nomenclature" variant="outlined" />
        )}
      />
    </>
  );
}
