import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Navigation";
import styles from "./rDashboard.module.css";
import {
  Button,
  Switch,
  InputLabel,
  Input,
  TextField,
  Typography,
} from "@material-ui/core";
import BarGraph from "./BarGraph";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { data, subSystemLevelData, events, mainData } from "./DashboardData";
import ReliabilityChart from "./ReliabilityChart";
import EventCalendar from "./EventCalendar";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { SelectWithLimit } from "../../ui/Form/SelectWithLimit";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import AccessControl from "../Home/AccessControl";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const ReliabilityDashboard = () => {
  const [missionData, setMissionData] = useState([]);
  const [tempMissionData, setTempMissionData] = useState([]);
  const [TooltipData,setTooltipData]= useState([])
  const [missionInfo, setMissionInfo] = useState([]);

  const [cardData, setCardData] = useState(null);

  const [showSubsystem, setSubSystem] = useState(false);

  const [currentMission, setMission] = useState(0);
  const [eqDataOption, setEqDataOption] = useState([]);

  const [selectedEqName, setEquipmentName] = useState(null);
  const [selectedShipName, setShipName] = useState([]);
  const [selectedMissionName, setMissionName] = useState([]);

  const [graphData, setGraphData] = useState([]);

  const [subSystemData, setSubSystemData] = useState([]);

  const saveTempMission = (mission) => {
    // console.log("H");
    console.log(mission);
    // console.log(missionData);
    if (!missionData.includes(mission.missionName)) {
      setMissionData((state) => {
        return [...state, mission.missionName];
      });
      setMissionInfo((state) => {
        return [...state, mission];
      });
      setTempMissionData((state) => {
        return [...state, mission];
      });
    }
  };

  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systems",
      showSnackBar: false,
    });
  };

  const [userSelectionData, setUserSelectionData] = useState([]);
  const dispatch = useDispatch();
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const SelectedEq_ID = useSelector((state) => state.treeData.treeData);
  useEffect(() => {
    fetch("/rel_dashboard", {
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
        debugger;
        const mission_data = data["mission_data"];
        setMissionInfo(mission_data);
        const user_selection = data["user_selection"]["data"];
        const eqData = data["user_selection"]["eqData"];
        const mNames = mission_data.map((x) => x["missionName"]);
        setMissionData(mNames);
        const shipName = user_selection.map((x) => x.shipName);
        setUserSelectionData(eqData);
        dispatch(
          userActions.onChangeLoad({ filteredData: { shipName: shipName } })
        );
      });
  }, [setUserSelectionData]);

  const getSelectedValues = (d, selectType) => {
    debugger;
    // console.log(selectedEqName, selectedShipName, selectedMissionName);
    if (selectType === "equipmentName") {
      setEquipmentName(d);
    }
    if (selectType === "shipName") {
      var filteredEqData = [];
      d.map((element) => {
        var xx = userSelectionData
          .filter((x) => x.shipName === element)
          .map((x) => {
            return { name: x.equipmentName, parent: element };
          });
        filteredEqData = [...filteredEqData, ...xx];
        return null;
      });
      setEqDataOption(filteredEqData);
      setShipName(d);
    }
    // if (selectType === "missionName") {
    //   setMissionName(d);
    // }
  };
  console.log("graphData", graphData);
  console.log("subSystemData", subSystemData);
  console.log("cardData", cardData);

  console.log(selectedEqName, selectedMissionName, selectedShipName);
  console.log(missionInfo);
  const handleChange = (event) => {
    setMissionName(event.target.value);
  };
  const onSubmitHandler = () => {
    setGraphData([]);
    setSubSystem(false);

    const data = {
      missions: [selectedMissionName], /// its duration not the mission
      equipments: selectedEqName,
      shipClass: selectedShipName,
      tempMissions: tempMissionData,
    };
    setTooltipData(data)
    
    setMission(0);
    fetch("/rel_estimate_EQ", {
      method: "POST",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        debugger;
        console.log(d);
        console.log(d[0]["Temp Mission"]);
        const reliabilityDataArray = [];
        // reliabilityDataArray.push({
        //   name: "Target Reliability",
        //   Reliability: 90.0,
        // })

        d.forEach((missionData) => {
          Object.keys(missionData["Temp Mission"]).forEach((ship) => {
            const shipData = missionData["Temp Mission"][ship];
            shipData.forEach((data) => {
              Object.keys(data).forEach((name) => {
                const relValue = data[name].rel;
                reliabilityDataArray.push({
                  name,
                  reliability: 100 * relValue,
                });
              });
            });
          });
        });

        console.log("---------------->>>>>", reliabilityDataArray);

        setGraphData(reliabilityDataArray);
        const cardD = [];

        d.forEach((missionData) => {
          const actualData = [];
          Object.keys(missionData["Temp Mission"]).forEach((ship) => {
            const shipDataArray = missionData["Temp Mission"][ship];
            shipDataArray.forEach((shipData) => {
              Object.keys(shipData).forEach((name) => {
                const relValue = 100 * shipData[name].rel;
                actualData.push({
                  name,
                  rel: relValue,
                  prob: 100 * shipData[name].prob_ac,
                });
              });
            });
          });

          cardD.push({
            name: selectedMissionName,
            target: 90, // Replace this with the actual target value if available
            actual: actualData,
          });
        });
        console.log("PPP____>>>>>>", cardD);
        setCardData(cardD);
      });
    setSnackBarMessage({
      severity: "success",
      message: "Reliblity Of Equipment Showed Successfully",
      showSnackBar: true,
    });
  };

  return (
    <AccessControl allowedLevels={["L1", "L2", "L3", "L4", "L5"]}>
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
                <Typography variant="h5">Ship Name</Typography>
              </InputLabel>
              <SelectWithLimit
                limit={100}
                options={customSelectData["shipName"]}
                getSelectedValues={getSelectedValues}
                selectType={"shipName"}
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
                <Typography variant="h5">Equipment Name</Typography>
              </InputLabel>
              <SelectWithLimit
                limit={100}
                options={eqDataOption}
                getSelectedValues={getSelectedValues}
                selectType={"equipmentName"}
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
                <Typography variant="h5">Equipment Nomainclature</Typography>
              </InputLabel>
              <SelectWithLimit
                limit={100}
                options={eqDataOption}
                getSelectedValues={getSelectedValues}
                selectType={"equipmentName"}
              />
            </div>
            {/* <CustomSelect
            label="Mission Selection"
            fields={['Mission A','Mission B','Mission C']}
            /> */}
            <div style={{ width: "300px" }}>
              <InputLabel
                style={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h5">Enter Mission Duration</Typography>
              </InputLabel>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="number"
                selectType="missionDuration"
                value={selectedMissionName}
                onChange={handleChange}
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
          {graphData.length ? (
            <>
              <div className={styles.midSection}>
                <div className={styles.rchart}>
                  <div className={styles.content}>
                    {graphData && (
                      <ReliabilityChart
                        data={graphData}
                        family={TooltipData}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}
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

export default ReliabilityDashboard;
