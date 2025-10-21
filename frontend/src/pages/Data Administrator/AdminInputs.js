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
export default function AdminInputs() {
  const [allEquipmentData, setAllEquipmentData] = useState([]);
  const [shipsOptions, setShipOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [nomenclatureOptions, setNomenclatureOptions] = useState([]);
  const [selectedShip, setSelectedShip] = useState("")
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fetch_user_selection", {
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
        console.log(eqData);
        setAllEquipmentData(eqData);
        shipName = [...new Set(shipName)];
        setShipOptions(shipName);
        const components = data["uniq_eq_data"];
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
  console.log(shipsOptions);

  const ShipChange = (e, value) => {
    const currShip = value
    const filteredEqData = allEquipmentData.filter((equipment) => {
      return equipment.shipName === currShip;
    });
    setSelectedShip(value)

    // Remove duplicates based on equipmentName
    const uniqueFilteredEqData = Array.from(
      new Set(filteredEqData.map((equipment) => equipment.equipmentName))
    ).map((equipmentName) =>
      filteredEqData.find((equipment) => equipment.equipmentName === equipmentName)
    );
    const data = { shipName: value }
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    setEquipmentOptions(uniqueFilteredEqData);
    console.log("f", uniqueFilteredEqData);
  };


  const EquipmentChange = (e, value) => {
    const selectedEquipment = value?.equipmentName;
    const filteredNomenclature = allEquipmentData.filter((equipment) => {
      return equipment.equipmentName === selectedEquipment && equipment.shipName === selectedShip;
    });
    const data = { equipmentName: selectedEquipment }
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    setNomenclatureOptions(filteredNomenclature);
    console.log("filteredNomenclature", filteredNomenclature);
  };

  const NomenclatureChange = (e, value) => {
    const selectedNomenclature = value?.nomenclature
    const data = { nomenclature: selectedNomenclature }
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  }

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
        options={equipmentOptions}
        getOptionLabel={(option) => option.equipmentName}
        onChange={EquipmentChange}
        renderInput={(params) => (
          <TextField {...params} label="Equipment Name" variant="outlined" />
        )}
      />
      <Autocomplete
        className={classes.autocomplete}
        options={nomenclatureOptions}
        getOptionLabel={(option) => option.nomenclature}
        onChange={NomenclatureChange}
        renderInput={(params) => (
          <TextField {...params} label="Nomenclature" variant="outlined" />
        )}
      />
    </>
  );
}
