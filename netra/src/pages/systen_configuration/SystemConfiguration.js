import React, { useEffect, useState, useRef } from "react";
import styles from "./SystemConfiguration.module.css";
import Navigation from "../../components/navigation/Navigation";
import EqptStructuring from "../../components/main/EqptStructuring/EqptStructuring";
import NewModule from "../../components/module/NewModule";
import StageSlider from "../../components/slider/NewSlider";
import { useDispatch, useSelector } from "react-redux";
import { Button, unstable_createMuiStrictModeTheme } from "@material-ui/core";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import { Switch, Route, useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import UserSelection from "../../ui/userSelection/userSelection";
import RedundancyInfo from "./redundancy/redundancy";
import MaintenanceInfo from "./maintenanceInfo/maintenanceInfo";
import FailureMode from "./failureMode/failureMode";
import DutyCycle from "./dutyCycle/dutyCycle";
import AdditionalInfo from "./additionalInfo/additionalInfo";
import { useLocation } from "react-router";
import { treeDataActions } from "../../store/TreeDataStore";
import AccessControl from "../Home/AccessControl";
import { v4 as uuid } from "uuid";
const SystemStyles = makeStyles({
  formControl: {
    margin: "2rem",
    minWidth: 200,
  },
  Submit: {
    margin: "2rem",
  },
  buttons: {
    minWidth: 150,
    marginLeft: 10,
    marginTop: 15,
    float: "right",
  },
});

const SystemConfiguration = (props) => {
  const { innerWidth: width, innerHeight: height } = window;
  const location = useLocation();
  const dispatch = useDispatch();
  let finalTableData = [];
  const setFinalTableData = (d) => {
    finalTableData = d;
  };
  
 

  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.treeData
  );
  const systemConfigurationData = useSelector(
    (state) => state.treeData.sortTreeData
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  // const [showSnackBar, setShowSnackBar] = useState(false);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const [Stage, setStage] = useState(0);
  const SystemClasses = SystemStyles();
  const history = useHistory();
  const NextStage = () => {
    if (Stage === 0) {
      setStage(1);
      history.push("/system_config/redundancy_info");
    }
    if (Stage === 1) {
      setStage(2);
      history.push("/system_config/maintenance_info");
    }
    if (Stage === 2) {
      setStage(3);
      history.push("/system_config/failure_mode");
    }
    if (Stage === 3) {
      setStage(4);
      history.push("/system_config/duty_cycle");
    }
    if (Stage === 4) {
      setStage(5);
      history.push("/system_config/additional_info");
    }
  };
  const PreviousStage = (reset = false) => {
    if (Stage === 1 && reset === false) {
      setStage(0);
      history.push("/system_config");
    }
    if (Stage === 1 && reset === true) {
      setStage(0);
      history.push("/system_config");
    }
    if (Stage === 2) {
      setStage(1);
      history.push("/system_config/redundancy_info");
    }
    if (Stage === 3) {
      setStage(2);
      history.push("/system_config/maintenance_info");
    }
    if (Stage === 4) {
      setStage(3);
      history.push("/system_config/failure_mode");
    }
    if (Stage === 5) {
      setStage(4);
      history.push("/system_config/duty_cycle");
    }
  };

  const CheckStage = () => {
    if (Stage === 0) {
      history.push("/system_config");
    }
    if (Stage === 1) {
      history.push("/system_config/redundancy_info");
    }
    if (Stage === 2) {
      history.push("/system_config/maintenance_info");
    }
    if (Stage === 3) {
      history.push("/system_config/failure_mode");
    }
    if (Stage === 4) {
      history.push("/system_config/duty_cycle");
    }
  };

  const nextModule = (settings) => {
    if (settings.PhaseManager) {
      props.history.push("/phase_manager");
    } else if (settings.HEP) {
      props.history.push("/HEP");
    } else if (settings.DataManager) {
      props.history.push("/data_manager");
    } else if (settings.ReliabilityDashboard) {
      props.history.push("/rDashboard");
    }
  };

  const [locationKeys, setLocationKeys] = useState([]);
  useEffect(() => {
    if (location.pathname === "/system_config") {
      setStage(0);
    }
    return history.listen((location) => {
      if (history.action === "PUSH") {
        setLocationKeys([location.key]);
      }

      if (history.action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);
          NextStage();
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          PreviousStage();
        }
      }
    });
  }, [locationKeys, history]);
  let [marks, setMarks] = useState([
    {
      value: 15,
      label: "Equipment Structuring",
    },
    {
      value: 30,
      label: "Redundancy & Parallel Information",
    },
    {
      value: 45,
      label: "Maintenance Information",
    },
    {
      value: 60,
      label: "Failure Mode",
    },
    {
      value: 75,
      label: "Duty Cycle",
    },
    {
      value: 90,
      label: "Additional Equipment Info",
    },
  ]);

  if (width < 768) {
    marks = marks.map((item, index) => {
      return item["value"];
    });
  }
  //on Save button click to save tree and system config data to dB.
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systems",
      showSnackBar: false,
    });
  };

  const onSaveButtonClickHandler = () => {
    const currentLocation = location.pathname;
    if (currentLocation === "/system_config") {
      if (systemConfigurationTreeData.length > 0) {
        fetch("/save_system", {
          method: "POST",
          body: JSON.stringify({
            flatData: systemConfigurationTreeData,
            nestedData: systemConfigurationData,
            dtype: "insertSystem",
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
            setSnackBarMessage({
              severity: "success",
              message: data.message,
              showSnackBar: true,
            });
          })
          .catch((error) => {
            setSnackBarMessage({
              severity: "error",
              message: "Error Occured in System Configuration, Please Try again" + error,
              showSnackBar: true,
            });
          });
      } else {
        setSnackBarMessage((prevState) => {
          const data = {
            ...prevState,
            message: "Error Occured in System Configuration, Please Try again",
            showSnackBar: true,
          };
          return data;
        });
      }
    } else {
      let dType = null;
      if (currentLocation === "/system_config/redundancy_info") {
        dType = "insertRedundancy";
      } else if (currentLocation === "/system_config/maintenance_info") {
        dType = "insertMaintenanceInfo";
      } else if (currentLocation === "/system_config/additional_info") {
        dType = "additionalInfo";
      } else if (currentLocation === "/system_config/duty_cycle") {
        dType = "insertDutyCycle";
      } else if (currentLocation === "/system_config/failure_mode") {
        dType = "failure_mode";
        // let data_ = [];
        // debugger;
        // const failureData = finalTableData.map((row) => {
        //   let component_id = row.eqId;
        //   let rComponent_id = row.rEquipmentId;
        //   let fixFailureMode = row.fixFailureMode;
        //   let failureMode = row.FailureMode.split(",");
        //   if (fixFailureMode) {
        //     if (fixFailureMode.length > 0) {
        //       fixFailureMode.map((x) => {
        //         if (x.trim() !== "") {
        //           data_.push({
        //             component_id,
        //             rComponent_id,
        //             failure_mode: x.trim(),
        //             id: uuid(),
        //           });
        //         }
        //         return null;
        //       });
        //     }
        //   }
        //   if (failureMode.length > 0) {
        //     failureMode.map((x) => {
        //       if (x.trim() !== "") {
        //         data_.push({
        //           component_id,
        //           rComponent_id,
        //           failure_mode: x.trim(),
        //           id: uuid(),
        //         });
        //       }
        //       return null;
        //     });
        //   }
        //   return data_;
        // });
        // finalTableData = data_;
      }
      if (dType) {
        if (finalTableData.length > 0) {
          fetch("/save_system", {
            method: "POST",
            body: JSON.stringify({
              flatData: finalTableData,
              dtype: dType,
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
              setSnackBarMessage({
                severity: "success",
                message: data.message,
                showSnackBar: true,
              });
            })
            .catch((error) => {
              setSnackBarMessage({
                severity: "error",
                message: "Error Occured in System Configuration, Please Try again" + error,
                showSnackBar: true,
              });
            });
        } else {
          setSnackBarMessage((prevState) => {
            const data = {
              ...prevState,
              message: "Error Occured in System Configuration, Please Try again",
              showSnackBar: true,
            };
            return data;
          });
        }
      }
    }
    //End
  };

  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentNomenclature = currentSelection["nomenclature"];
  const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature);

  const matchingId = matchingItems[0]?.id;
  const onLoadTreeStructure = () => {
    const payload = {
      nomenclature: currentSelection["nomenclature"],
      ship_name: currentSelection["shipName"],
    };
  
    if (matchingId) {
      payload.component_id = matchingId;
    }
    console.log(payload)
    fetch("/fetch_system", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        let treeD = d["treeD"];
        let failureModes = d["failureMode"];
        console.log(failureModes)
        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
          }),
        );
        dispatch(
          treeDataActions.setFailureModes(failureModes)
        )
      });

      setSnackBarMessage({
        severity: "success",
        message: "System is Loaded",
        showSnackBar: true,
      });
  };

  return (
    <React.Fragment>
      <AccessControl allowedLevels={['L1', 'L5', 'L6']}>
      <Navigation />
      {/* <NewModule /> */}
      <StageSlider marks={marks} default={marks[Stage]["value"]} />
      <div className={styles.flex}>
        <div className={styles.user}>
          <UserSelection />
        </div>
        <div className={styles.buttons}>
          <Route path="/system_config">
            <Route path={["/system_config/"]}>
              <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={onLoadTreeStructure}
              >
                Load System
              </Button>
            </Route>
            <Route
              exact
              path={[
                "/system_config/redundancy_info",
                "/system_config/maintenance_info",
                "/system_config/failure_mode",
                "/system_config/duty_cycle",
                "/system_config/additional_info",
              ]}
            >
              <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={() => PreviousStage()}
              >
                Back
              </Button>
            </Route>
            {/* <Button
              variant="contained"
              color="primary"
              className={SystemClasses.buttons}
            >
              Replicate
            </Button> */}

            <Button
              variant="contained"
              color="primary"
              className={SystemClasses.buttons}
              onClick={onSaveButtonClickHandler}
            >
              Save
            </Button>
            <Route
              exact
              path={[
                "/system_config",
                "/system_config/redundancy_info",
                "/system_config/maintenance_info",
                "/system_config/failure_mode",
                "/system_config/duty_cycle",
              ]}
            >
              <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={() => NextStage()}
              >
                Next Stage
              </Button>
            </Route>
            <Route exact path="/system_config/additional_info">
              {/* <Button
                onClick={() => nextModule(props.settings)}
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
              >
                Next Module
              </Button> */}
            </Route>
            <Route exact path="/system_config/additional_info">
              <Button
              onClick={() => history.push("/data_manager")}
                component={Link}
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
              >
                Next Module
              </Button>
            </Route>
          </Route>
        </div>
      </div>
      <Switch>
        <Route path="/system_config" exact={true}>
          <EqptStructuring />
        </Route>
        <Route path="/system_config/redundancy_info" exact={true}>
          <RedundancyInfo tableUpdate={setFinalTableData}></RedundancyInfo>
        </Route>
        <Route path="/system_config/maintenance_info" exact={true}>
          <MaintenanceInfo tableUpdate={setFinalTableData}></MaintenanceInfo>
        </Route>
        <Route path="/system_config/failure_mode" exact={true}>
          <FailureMode
            tableUpdate={setFinalTableData}
            matchingId={matchingId}
          ></FailureMode>
        </Route>
        <Route path="/system_config/duty_cycle" exact={true}>
          <DutyCycle tableUpdate={setFinalTableData}></DutyCycle>
        </Route>
        <Route path="/system_config/additional_info" exact={true}>
          <AdditionalInfo tableUpdate={setFinalTableData}></AdditionalInfo>
        </Route>
      </Switch>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
      </AccessControl>
    </React.Fragment>
  );
};

export default SystemConfiguration;
