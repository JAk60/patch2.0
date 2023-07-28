import React, { useEffect, useState } from "react";
import styles from "./CDashboard.module.css";
import { InputLabel, TextField, makeStyles, Button } from "@material-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
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
  const [paramData, setParamData] = useState([]);
  const [currMinMax, setCurrMinMax] = useState([]);


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
  let arr = [];
  let arr2 = [];
  for (let i = 0; i < 50; i++) {
    // const maxDate = Date.now();
    // const timestamp = Math.floor(Math.random() * maxDate);
    arr = [
      ...arr,
      {
        name: new Date(
          new Date(2021, 1, 1).getTime() +
            Math.random() *
              (new Date(2022, 1, 1).getTime() - new Date(2021, 1, 1).getTime())
        )
          .toISOString()
          .slice(0, 10),
        uv: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
      },
    ];

    arr2 = [
      ...arr2,
      {
        name: new Date(
          new Date(2021, 1, 1).getTime() +
            Math.random() *
              (new Date(2022, 1, 1).getTime() - new Date(2021, 1, 1).getTime())
        )
          .toISOString()
          .slice(0, 10),
        uv: Math.floor(Math.random() * (75 - 30 + 1)) + 30,
      },
    ];
  }
  const [showGraph, setShowGraph] = useState(false);

  const onSubmitHandler = () => {
    fetch("/fetch_cmdata", {
      method: "POST",
      body: JSON.stringify({
        EquipmentIds: selectedEqName.map((x) => x.id),
        ParameterNames: selectedParameterName.map((x) => x),
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
        const sortedParamData = data.map((param) => {
          return {
            ...param,
            data: param.data.sort((a, b) => new Date(a.date) - new Date(b.date)),
          };
        });
        setSnackBarMessage({
          severity: "success",
          message: data.message,
          showSnackBar: true,
        });
        setParamData(sortedParamData);
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


    function findMaxValue(dataArray) {
      if (!Array.isArray(dataArray)) {
        return null; // Return null if dataArray is not an array
      }
    
      let max = Number.MIN_SAFE_INTEGER; // Initialize max to the smallest possible number
    
      for (const obj of dataArray) {
        const value = parseInt(obj.value, 10); // Convert the value to a number
        if (!isNaN(value)) { // Check if the value is a valid number
          max = Math.max(max, value);
        }
      }
    
      return max;
    }
    
  // Snackbar
  console.log(paramData)
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
          <div className={styles.midSection}>
            {paramData.map((param) => {
              if (param.data.length === 0) {
                return null;
              }

              const crossingThreshold =
                (param.data[param.data.length - 1]?.value ?? 0) <
                  param.minThreshold ||
                (param.data[param.data.length - 1]?.value ?? 0) >
                  param.maxThreshold;

              const matchingMinMax = currMinMax?.find(
                (item) => item.name === param.parameterName
              )

              const minThreshold = parseInt(matchingMinMax?.min_value);
              const maxThreshold = parseInt(matchingMinMax?.max_value);

              return (
                <div className={styles.rchart}>
                  <div className={styles.content}>
                    <div>
                      {crossingThreshold}
                      {param.equipmentName} {param.componentName}
                      {param.parameterName}
                    </div>
                    <LineChart width={550} height={300} data={param.data}>
                      <XAxis
                        dataKey="date"
                        tick={false}
                        label={{
                          value: "Date",
                          position: "insideBottom",
                          dy: 10,
                        }}
                        height={45}
                      />
                      <YAxis
                        domain={[0, findMaxValue(paramData[0]?.data)]} // Set the Y-axis domain dynamically
                        label={{
                          value: `${param.parameterName} Data`,
                          angle: -90,
                          position: "center",
                          paddingRight: "20px",
                          dy: -10,
                        }}
                        width={80}
                      />
                      <CartesianGrid horizontal={false} vertical={false} />

                      <Line
                        layout="horizontal"
                        dataKey="value"
                        stroke={crossingThreshold ? "red" : "green"}
                      />

                      <ReferenceLine
                        y={minThreshold}
                        stroke="gray"
                        strokeDasharray="6 6"
                      />
                      <ReferenceLine
                        y={maxThreshold}
                        stroke="gray"
                        strokeDasharray="6 6"
                      />

                      <Tooltip />
                    </LineChart>
                  </div>
                </div>
              );
            })}
          </div>
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
