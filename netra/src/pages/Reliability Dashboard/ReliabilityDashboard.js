import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Navigation";
import styles from "./rDashboard.module.css";
import { Button, Switch, InputLabel, Input, TextField } from "@material-ui/core";
import BarGraph from "./BarGraph";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
//import LensIcon from '@material-ui/icons/Lens';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
// import CreateProfile from "./CreateProfile";
import { data, subSystemLevelData, events, mainData } from "./DashboardData";
import ReliabilityChart from "./ReliabilityChart";
import EventCalendar from "./EventCalendar";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import ReactCardFlip from "react-card-flip";
import MissionSlider from "./MissionSlider";
import { SelectWithLimit } from "../../ui/Form/SelectWithLimit";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import Loader from "react-loader-spinner";

const MissionData = (props) => {
  return (
    <div className={styles.missionData} style={props.style}>
      <div className={styles.target}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-target"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#374c93"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="9" />
        </svg>{" "}
        Target: {props.mission.target}%
      </div>
      <div className={styles.actual}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-shield-check"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#f8f8f8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 12l2 2l4 -4" />
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
        </svg>
        Actual:
        {props.mission.actual.map((data) => {
          return (
            <>
              <div>
                {data.name} {data.rel.toFixed(2)}%
              </div>
            </>
          );
        })}
      </div>
      <div style={{ textAlign: "center" }}>
        <div className={styles.probabilityHead}>Probability of Achieving</div>
        <div className={styles.probability}>
          {props.mission.actual.map((data) => {
            return (
              <>
                <div>
                  {data.name}{" "}
                  {data.prob.toFixed(2) == 100
                    ? ">99%"
                    : `${data.prob.toFixed(2)}%`}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReliabilityDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [missionData, setMissionData] = useState([]);
  const [tempMissionData, setTempMissionData] = useState([]);

  const [missionInfo, setMissionInfo] = useState([]);

  const [cardData, setCardData] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const [endDate, setEndDate] = useState(new Date());

  const [eventInfo, setEventInfo] = useState(null);

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleEventCheck = () => {
    let start = moment(startDate).subtract(1, "day");
    let end = moment(endDate).add(1, "day");
    let total = (end - start) / (1000 * 3600 * 24) - 1;
    console.log(total);
    let days = { working: 0, down: 0, maintenance: 0, total: total };
    events.forEach((event) => {
      if (event.start < end && event.end > start) {
        if (event.start >= start && event.end <= end) {
          let diff =
            (moment(event.end) - moment(event.start)) / (1000 * 3600 * 24);
          console.log(diff);
          days[event.status] += Math.floor(diff);
        } else if (event.start >= start && event.end >= end) {
          let diff = (moment(end) - moment(event.start)) / (1000 * 3600 * 24);
          console.log(diff);

          days[event.status] += Math.floor(diff);
        } else if (event.start <= start && event.end <= end) {
          let diff = (moment(event.end) - moment(start)) / (1000 * 3600 * 24);
          console.log(diff);

          days[event.status] += Math.floor(diff);
        } else if (event.start <= start && event.end >= end) {
          let diff = (moment(end) - moment(start)) / (1000 * 3600 * 24);
          console.log(diff);

          days[event.status] += Math.floor(diff);
        }
      }
    });
    setEventInfo(days);
    setCardFlipped(!isCardFlipped);
  };

  const [showSubsystem, setSubSystem] = useState(false);

  const [isCardFlipped, setCardFlipped] = useState(false);

  const [currentMission, setMission] = useState(0);
  const [eqDataOption, setEqDataOption] = useState([]);

  const [selectedEqName, setEquipmentName] = useState(null);
  const [selectedShipName, setShipName] = useState(null);
  const [selectedMissionName, setMissionName] = useState(null);

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

  const [userSelectionData, setUserSelectionData] = useState([]);
  const dispatch = useDispatch();
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const SelectedEq_ID = useSelector(
    (state) => state.treeData.treeData
  );
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


  // useEffect(() => {
  //   fetch("/fetch_user_selection", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const shipName = data.map((x) => x.shipName);
  //       debugger;
  //       setUserSelectionData(data);
  //       dispatch(
  //         userActions.onChangeLoad({ filteredData: { shipName: shipName } })
  //       );
  //     });
  // }, [setUserSelectionData]);

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

  console.log(selectedEqName)

  const handleChange = (event) => {
    setMissionName(event.target.value);
  };
    const onSubmitHandler = () => {
      debugger;
      setGraphData([]);
      setSubSystem(false);
      setLoading(true);
      const data = {
        missions: [selectedMissionName],
        equipments: selectedEqName,
        shipClass: selectedShipName,
        tempMissions: tempMissionData,
      };
      console.log(data.equipments);
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

          if (data.missions.length == 1) {
            if (data.shipClass.length == 1) {
              //for Single Ship and Single Mission
              let newGraphData = [];
              let newSubSystem = [];
              let newCardData = [];
              data.missions.forEach((mission, mid) => {
                let missionData = d[mid]["Temp Mission"];
                newCardData[mid] = {
                  ...newCardData[mid],
                  name: mission,
                  target: 90,
                };
                newGraphData = [
                  ...newGraphData,
                  {
                    name: "Target Reliability",
                    Reliability: 90,
                  },
                ];
                // missionInfo.forEach((element) => {
                //   if (element.missionName === mission) {
                    
                //   }
                // });
                //console.log(missionData)
                data.shipClass.forEach((ship) => {
                  let shipData = missionData[ship];
                  console.log(shipData);
                  let actual = [];
                  data.equipments.forEach((eqpt, eid) => {
                    let eqptData = shipData[eid][eqpt.name];

                    actual[eid] = {
                      name: eqpt.name,
                      rel: 100 * eqptData.rel,
                      prob: 100 * eqptData.prob_ac,
                    };

                    newCardData[mid].actual = actual;

                    console.log(newCardData);
                    //console.log(eqptData);
                    newGraphData = [
                      ...newGraphData,
                      { name: `${eqpt.name}`, Reliability: 100 * eqptData.rel },
                    ];
                    eqptData.child.forEach((child, cid) => {
                      newSubSystem[cid] = {
                        ...newSubSystem[cid],
                        name: child.name,
                        [eqpt.name]: 100 * child.rel,
                      };
                    });
                  });
                });
              });

              debugger;
              setGraphData(newGraphData);
              setSubSystemData(newSubSystem);
              setCardData(newCardData);
              setLoading(false);
            } else {
              //for many Ship Classes and Single Mission
              let newGraphData = [];
              let newSubSystem = [];
              let newCardData = [];
              data.missions.forEach((mission, mid) => {
                let missionData = d[mid][mission];
                missionInfo.forEach((element) => {
                  if (element.missionName === mission) {
                    newCardData[mid] = {
                      ...newCardData[mid],
                      name: mission,
                      target: element.tar_rel,
                    };
                    newGraphData = [
                      ...newGraphData,
                      {
                        name: "Target Reliability",
                        Reliability: element.tar_rel,
                      },
                    ];
                  }
                });
                //console.log(missionData)
                data.shipClass.forEach((ship, sid) => {
                  let shipData = missionData[ship];
                  //console.log(shipData);
                  let actual = [];
                  data.equipments.forEach((eqpt, eid) => {
                    let eqptData = shipData[eid][eqpt.name];

                    actual[eid] = {
                      name: eqpt.name,
                      rel: 100 * eqptData.rel,
                      prob: 100 * eqptData.prob_ac,
                    };

                    newCardData[mid].actual = actual;

                    //console.log(eqptData);
                    newGraphData[sid] = {
                      ...newGraphData[sid],
                      name: ship,
                      [eqpt.name]: 100 * eqptData.rel,
                    };
                    eqptData.child.forEach((child, cid) => {
                      newSubSystem[cid] = {
                        ...newSubSystem[cid],
                        name: [`${ship} ${child.name}`],
                        [ship]: 100 * child.rel,
                      };
                    });
                  });
                });
              });
              debugger;
              setGraphData(newGraphData);
              setSubSystemData(newSubSystem);
              setCardData(newCardData);
              setLoading(false);
            }
          } else if (data.missions.length > 1) {
            //for many Missions
            let newGraphData = [];
            let newSubSystem = [];
            let newCardData = [];
            let targetRel = {};
            data.missions.forEach((mission, mid) => {
              let missionData = d[mid][mission];
              missionInfo.forEach((element) => {
                if (element.missionName === mission) {
                  newCardData[mid] = {
                    ...newCardData[mid],
                    name: mission,
                    target: element.tar_rel,
                  };
                  targetRel = {
                    ...targetRel,
                    name: "Target Reliability",
                    [mission]: element.tar_rel,
                  };
                }
              });
              //console.log(missionData)
              data.shipClass.forEach((ship) => {
                let shipData = missionData[ship];
                //console.log(shipData);
                let actual = [];
                data.equipments.forEach((eqpt, eid) => {
                  let eqptData = shipData[eid][eqpt.name];

                  actual[eid] = {
                    name: eqpt.name,
                    rel: 100 * eqptData.rel,
                    prob: 100 * eqptData.prob_ac,
                  };

                  newCardData[mid].actual = actual;

                  //console.log(eqptData);
                  newGraphData[eid] = {
                    ...newGraphData[eid],
                    name: eqpt.name,
                    [mission]: 100 * eqptData.rel,
                  };
                  eqptData.child.forEach((child, cid) => {
                    newSubSystem[cid] = {
                      ...newSubSystem[cid],
                      name: [`${eqpt.name} ${child.name}`],
                      [mission]: 100 * child.rel,
                    };
                  });
                });
              });
            });
            newGraphData = [targetRel, ...newGraphData];
            setGraphData(newGraphData);
            setSubSystemData(newSubSystem);
            setCardData(newCardData);
            setLoading(false);
            console.log(cardData);
          }
        });
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
            <SelectWithLimit
              limit={3}
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
              Equipment Name
            </InputLabel>
            <SelectWithLimit
              limit={3}
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
              Enter Mission Duration
            </InputLabel>
            <TextField id="outlined-basic"  variant="outlined" 
             type="number" selectType="missionDuration" value={selectedMissionName} onChange={handleChange} />
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
          {/* <CreateProfile saveTempMission={saveTempMission} /> */}
        </div>
        {loading && (
          <div className={styles.midSection}>
            <Loader
              type="Puff"
              color="#86a0ff"
              height={300}
              width={300}
              style={{ marginTop: 100 }}
            />
          </div>
        )}
        {graphData.length ? (
          <>
            <div className={styles.midSection}>
              <div className={styles.rchart}>
                <div className={styles.content}>
                  <div className={styles.relChart}>
                    {graphData && <ReliabilityChart data={graphData} />}
                  </div>
                  <div className={styles.compareMission}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <AddCircleOutlineIcon /> Compare with other missions
                    </div>
                    {cardData ? (
                      <div className={styles.missionbox}>
                        {/* <div className={styles.missionName}>Mission B</div> */}
                        <MissionSlider
                          missions={cardData}
                          currentMission={currentMission}
                          setMission={setMission}
                        />
                        <MissionData mission={cardData[currentMission]} />
                        <div className={styles.showSubsystem}>
                          Show Subsytem Level{" "}
                          <Switch
                            checked={showSubsystem}
                            disabled={!subSystemData.length}
                            onChange={() => {
                              setSubSystem(!showSubsystem);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.missionbox}>
                        Select Missions to compare
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.subSystemLevel}>
              {showSubsystem && (
                <div className={styles.subSystemContent}>
                  <div className={styles.subSystemLevelChart}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-adjustments"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="#0d1a45"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <circle cx="6" cy="10" r="2" />
                          <line x1="6" y1="4" x2="6" y2="8" />
                          <line x1="6" y1="12" x2="6" y2="20" />
                          <circle cx="12" cy="16" r="2" />
                          <line x1="12" y1="4" x2="12" y2="14" />
                          <line x1="12" y1="18" x2="12" y2="20" />
                          <circle cx="18" cy="7" r="2" />
                          <line x1="18" y1="4" x2="18" y2="5" />
                          <line x1="18" y1="9" x2="18" y2="20" />
                        </svg>
                        Sub System Level Indicator
                      </div>
                    </div>
                    <BarGraph data={subSystemData} />
                  </div>
                  <div style={{ width: "20%" }}>
                    <MissionData
                      mission={cardData[currentMission]}
                      style={{ height: 200 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </MuiPickersUtilsProvider>
  );
};
export default ReliabilityDashboard;
