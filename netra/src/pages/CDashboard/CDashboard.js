import React, { useEffect, useState } from "react";

import {
  InputLabel,
  TextField,
  makeStyles,
  Button,
  Typography,
} from "@material-ui/core";
import styles from "./CDashboard.module.css";
// import { arr,arr2 } from "./data";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Navigation from "../../components/navigation/Navigation";
import AccessControl from "../Home/AccessControl";
import CustomSelect from "../../ui/Form/CustomSelect";
import { Autocomplete } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import CGraph from "./CGraph";

const CDashboard = () => {
  const dispatch = useDispatch();
  const [userSelectionData, setUserSelectionData] = useState([]);
  const [uniqueEqIds, setUniqueEqIds] = useState([]);
  const [selectedEqName, setEquipmentName] = useState([]);
  const [paramOptions, setParamOptions] = useState([]);
  const [selectedShipName, setShipName] = useState([]);
  const [selectedParameterName, setParameterName] = useState([]);
  const [eqDataOption, setEqDataOption] = useState([]);
  const [nomenclatureDataOption, setNomenclatureDataOption] = useState([]);
  const [nomenclatureData, setNomenclatureData] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const PData = useSelector(
    (state) => state.userSelection.userSelection.params
  );
  console.log(paramOptions);
  useEffect(() => {
    fetch("/cm_dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const params = data["parameters"];
        console.log("hello:", params);
        const filteredData = params.filter(item => nomenclatureData.includes(item.nomenclature));
        console.log(filteredData);
        setParamOptions(filteredData)
        debugger
        const user_selection = data["user_selection"]["data"];
        const eqData = data["user_selection"]["eqData"];
        const eqIds = data["user_selection"]["uniq_eq_data"];
        setUniqueEqIds(eqIds);
        let shipName = user_selection.map((x) => x.shipName);
        shipName = [...new Set(shipName)];
        setUserSelectionData(eqData);
        dispatch(userActions.populateParams({ params: params }));
        dispatch(
          userActions.onChangeLoad({ filteredData: { shipName: shipName } })
        );
      });
  }, [nomenclatureData]);
console.log(selectedEqName,
  selectedParameterName);
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const dropDownStyle = makeStyles({
    root: {
      paddingLeft: 10,
      background: "#fff",
      border: "1px solid #0263a1",
      borderRadius: "5px",
      width: "320px",
      minHeight: "40px",
      boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
    },
    inputRoot: {
      width: "100%",
    },
  });
  const classes = dropDownStyle();
  const [showGraph, setShowGraph] = useState(false);

  const uniqueEquipmentIds = [...new Set(paramOptions.map(item => item.equipment_id))];
  const onSubmitHandler = () => {
    console.log(uniqueEquipmentIds);
    debugger
    fetch("/cgraph", {
      method: "POST",
      body: JSON.stringify({
        equipment_id: uniqueEquipmentIds,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if(data.code){
          setSnackBarMessage({
            severity: "success",
            message: "Sensor Graph Showed Successfully",
            showSnackBar: true,
          });
          setGraphData(data.response["graphData"]);
          setShowGraph(true);
        }
        else{
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        }
      })
      .catch((error) => {
        setSnackBarMessage({
          severity: "error",
          message: "Some Error Occured. " + error,
          showSnackBar: true,
        });
      });
  };

  // Snackbar
  console.log("graphData", graphData);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };

  const changeShip = (e) => {
    const filteredEqData = userSelectionData
      .filter((x) => x.shipName === e.target.value)
      .map((x) => {
        const id = uniqueEqIds.find((y) => y.nomenclature === x.nomenclature);
        return id ? id : null; // Return null if id is not found
      })
      .filter((id) => id !== null); // Remove null values
    const uniqueEqNames = [...new Set(filteredEqData.map((item) => item.name))];
    // const uniqueNomNames = [...new Set(filteredEqData.map(item => item.nomenclature))];
    // console.log(uniqueNomNames);
    const filteredNomenclatures = filteredEqData
      .filter((item) => selectedEqName.includes(item.name))
      .map((item) => item.nomenclature);
    console.log(selectedEqName);
    console.log(filteredNomenclatures);
    console.log(filteredEqData);
    setEqDataOption(uniqueEqNames);
    setShipName(e.target.value);
  };

  useEffect(() => {
    debugger
    const filteredEqData = userSelectionData
      .filter((x) => x.shipName === selectedShipName)
      .map((x) => {
        const id = uniqueEqIds.find((y) => y.nomenclature === x.nomenclature);
        return id ? id : null; // Return null if id is not found
      })
      .filter((id) => id !== null); // Remove null values
    console.log(filteredEqData);
    let filteredNomenclatures = filteredEqData
      .filter((item) => selectedEqName.includes(item.name))
      .map((item) => item.nomenclature);
    filteredNomenclatures = [...new Set(filteredNomenclatures)];
    setNomenclatureDataOption(filteredNomenclatures);
  }, [selectedEqName, selectedShipName]);

  // const onEqchange = (e, value) => {
  //   debugger;
  //   // const filteredEqData = userSelectionData
  //   //       .filter((x) => x.shipName === selectedShipName)
  //   //       .map((x) => {
  //   //           const id = uniqueEqIds.find((y) => y.name === x.equipmentName);
  //   //           return id ? id : null; // Return null if id is not found
  //   //       })
  //   //       .filter(id => id !== null); // Remove null values
  //   //   // const uniqueNomNames = [...new Set(filteredEqData.map(item => item.nomenclature))];
  //   //   // console.log(uniqueNomNames);
  //   //   const filteredNomenclatures = filteredEqData
  //   //   .filter(item => selectedEqName.includes(item.name))
  //   //   .map(item => item.nomenclature);
  //   //   console.log(selectedEqName);
  //   //   console.log(filteredNomenclatures);
  //   //   setNomenclatureDataOption(filteredNomenclatures)
  //   //   console.log(filteredEqData);
  //   setEquipmentName(value);
  // };
  return (
    <AccessControl allowedLevels={["L1", "L2", "L5"]}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Navigation />
        <div className={styles.body}>
          <div className={styles.mprofile}>
            <div >
              <InputLabel
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <Typography variant="h5">Ship Name</Typography>
              </InputLabel>
              <CustomSelect
                fields={customSelectData["shipName"]}
                onChange={changeShip}
                value={selectedShipName}
              />
            </div>
            <div >
              <InputLabel
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <Typography variant="h5">Equipment Name</Typography>
              </InputLabel>

              <Autocomplete
                classes={classes}
                multiple
                id="tags-standard"
                options={eqDataOption}
                getOptionLabel={(option) => option}
                value={selectedEqName}
                onChange={(e, value) => setEquipmentName(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>
            <div style={{ width: "300px" }}>
              <InputLabel
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h5">Select Nomaenclature</Typography>
              </InputLabel>

              <Autocomplete
                classes={classes}
                multiple
                id="tags-standard"
                options={nomenclatureDataOption}
                getOptionLabel={(option) => option}
                value={nomenclatureData}
                onChange={(e, value) => setNomenclatureData(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>

            <div style={{ width: "300px" }}>
              <InputLabel
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h5">Select Parameter</Typography>
              </InputLabel>

              <Autocomplete
                classes={classes}
                multiple
                id="tags-standard"
                options={paramOptions}
                getOptionLabel={(option) => option.name}
                groupBy={(option) => option.nomenclature}
                value={selectedParameterName}
                onChange={(e, value) => setParameterName(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              style={{
                marginTop: "2rem",
              }}
              onClick={onSubmitHandler}
            >
              Submit
            </Button>
          </div>

          {showGraph && (
            <CGraph
              graphData={graphData}
              selectedParameterNames={selectedParameterName}
              nomenclatureData={nomenclatureData}
            />
          )}
        </div>
        {SnackBarMessage.showSnackBar && (
          <CustomizedSnackbars
            message={SnackBarMessage}
            onHandleClose={onHandleSnackClose}
          />
        )}
      </MuiPickersUtilsProvider>
    </AccessControl>
  );
};
export default CDashboard;
