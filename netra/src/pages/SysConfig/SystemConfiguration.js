import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Route, Switch, useHistory } from "react-router-dom";
import EqptStructuring from "../../components/main/EqptStructuring/EqptStructuring";
import { treeDataActions } from "../../store/TreeDataStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import UserSelection from "../../ui/userSelection/userSelection";
import AccessControl from "../Home/AccessControl";
import styles from "./SystemConfiguration.module.css";
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
      value: 10,
      label: "Equipment Structuring",
    },
    {
      value: 32,
      label: "Redundancy & Parallel Information",
    },
    {
      value: 54,
      label: "Maintenance Information",
    },
    {
      value: 68,
      label: "Failure Mode",
    },
    {
      value: 78,
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
    if (currentLocation === "/system_con") {
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
  // console.log(sData)S
  const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature && item.ship_name === currentSelection["shipName"])
  
  console.log(matchingItems)

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
    <>
      <AccessControl allowedLevels={['L1', 'L5', 'L6']}>
        {/* <Navigation /> */}
        {/* <NewModule /> */}
        {/* <StageSlider marks={marks} default={marks[Stage]["value"]} /> */}
        <div className={styles.flex}>
          <div className={styles.user}>
            <UserSelection />
          <div className={styles.buttons}>
            
                <Button
                  variant="contained"
                  color="primary"
                  className={SystemClasses.buttons}
                  onClick={onLoadTreeStructure}
                >
                  Load Equipment
                </Button>
      
              <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={onSaveButtonClickHandler}
              >
                Save
              </Button>             
          </div>
          </div>
        </div>
        <Switch>
          <Route path="/system_con" exact={true}>
            <EqptStructuring tableUpdate={setFinalTableData}/>
          </Route>
          {/* <Route path="/system_config/redundancy_info" exact={true}>
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
          </Route> */}
        </Switch>
        {SnackBarMessage.showSnackBar && (
          <CustomizedSnackbars
            message={SnackBarMessage}
            onHandleClose={onHandleSnackClose}
          />
        )}
      </AccessControl>
    </>
  );
};

export default SystemConfiguration;
