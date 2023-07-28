import React, { useEffect, useState } from "react";

import { InputLabel, TextField, makeStyles, Button } from "@material-ui/core";
import styles from "./CDashboard.module.css";
// import { arr,arr2 } from "./data";
import {
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Navigation from "../../components/navigation/Navigation";

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
  const [minMax, setMinMax] = useState([]);
  const [selectedEqName, setEquipmentName] = useState([]);
  const [paramOptions, setParamOptions] = useState([]);
  const [selectedShipName, setShipName] = useState([]);
  const [selectedParameterName, setParameterName] = useState([]);
  const [eqDataOption, setEqDataOption] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [currMinMax, setCurrMinMax] = useState([]);
 const PData=useSelector((state)=>state.userSelection.userSelection.params)
console.log(PData)
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
        setMinMax([...params]);
        const user_selection = data["user_selection"]["data"];
        const eqData = data["user_selection"]["eqData"];
        const eqIds = data["user_selection"]["uniq_eq_data"];
        setUniqueEqIds(eqIds);
        const shipName = user_selection.map((x) => x.shipName);
        setUserSelectionData(eqData);
        dispatch(userActions.populateParams({ params: params }));
        dispatch(
          userActions.onChangeLoad({ filteredData: { shipName: shipName } })
        );
      });
    }, []);
  // ...

  useEffect(() => {
    const filteredArray = minMax.filter((item) => {
      return selectedEqName.some(
        (selected) => item.equipment_id === selected.id
      );
    });

    const filteredNames = filteredArray.map((item) => item.name);
    setParamOptions(filteredNames); // Move this line here

    const CMinMax = (ele) => {
      const FminMax = filteredArray.filter((i) => i.name === ele);
      setCurrMinMax((prevMinMax) => [...prevMinMax, ...FminMax]);
    };

    selectedParameterName.forEach((e) => CMinMax(e));
  }, [selectedEqName]);


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

  // const onSubmitHandler = () => {
  //   fetch("/fetch_cmdata", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       EquipmentIds: selectedEqName.map((x) => x.id),
  //       ParameterNames: selectedParameterName.map((x) => x),
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const sortedParamData = data.map((param) => {
  //         return {
  //           ...param,
  //           data: param.data.sort((a, b) => new Date(a.date) - new Date(b.date)),
  //         };
  //       });
  //       setSnackBarMessage({
  //         severity: "success",
  //         message: data.message,
  //         showSnackBar: true,
  //       });
  //       setParamData(sortedParamData);
  //       setShowGraph(true);
  //     })
  //     .catch((error) => {
  //       setSnackBarMessage({
  //         severity: "error",
  //         message: "Some Error Occured. " + error,
  //         showSnackBar: true,
  //       });
  //     });
  //   };

    const onSubmitHandler = () => {
      fetch("/cgraph", {
        method: "POST",
        body: JSON.stringify({
          EquipmentIds: selectedEqName.map((x) => x.id),
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
          console.log(data)
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
          setGraphData(data['graphData']);
          setShowGraph(true);
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
  console.log("graphData",graphData)
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
    var filteredEqData = [];

    var xx = userSelectionData
      .filter((x) => x.shipName === e.target.value)
      .map((x) => {
        let id = uniqueEqIds.filter((y) => y.name === x.equipmentName);
        return id[0];
      });
    filteredEqData = [...filteredEqData, ...xx];

    setEqDataOption(filteredEqData);
    setShipName(e.target.value);
  };
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Navigation />
      <div className={styles.body}>
        <div className={styles.mprofile}>
          <div style={{ width: "300px" }}>
            <InputLabel
              style={{
                fontWeight: "bold",
                color: "black",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              Ship Name
            </InputLabel>
            <CustomSelect
              fields={customSelectData["shipName"]}
              onChange={changeShip}
              value={selectedShipName}
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
              Equipment Name
            </InputLabel>

            <Autocomplete
              classes={classes}
              multiple
              id="tags-standard"
              options={eqDataOption}
              getOptionLabel={(option) => option.name}
              value={selectedEqName}
              onChange={(e, value) => setEquipmentName(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
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
              Select Parameter
            </InputLabel>

            <Autocomplete
              classes={classes}
              multiple
              id="tags-standard"
              options={paramOptions}
              // getOptionLabel={(option) => option.name}
              value={selectedParameterName}
              onChange={(e, value) => setParameterName(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{ ...params.InputProps, disableUnderline: true }}
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
          <CGraph graphData={graphData} 
          selectedParameterNames={selectedParameterName}
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
  );
};
export default CDashboard;
