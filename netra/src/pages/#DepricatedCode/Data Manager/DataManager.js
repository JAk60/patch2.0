import React, { useEffect, useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import NewModule from "../../components/module/NewModule";
import StageSlider from "../../components/slider/NewSlider";
import { Button } from "@material-ui/core";
import {
  Switch,
  Route,
  useHistory,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";
import styles from "./DataManager.module.css";
import { makeStyles } from "@material-ui/styles";
import OperationalData from "./operationalData/operationalData";
import MaintenanceData from "./maintenanceData/maintenanceData";
import ImportData from "./importData/importData";
import ParameterEstimation from "./parameterEstimation/parameterEstimation";
import HistoricalData from "./historicalData/historicalData";
import UserSelection from "../../ui/userSelection/userSelection";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import { isAllOf } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import RepairableOverhaul from "./repairableOverhaul/repairableOverhaul";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const ManagerStyles = makeStyles({
  buttons: {
    marginLeft: 10,
    marginTop: 15,
    minWidth: 150,
  },
});

function DataManager(props) {
  const { innerWidth: width, innerHeight: height } = window;
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const location = useLocation();
  const [Stage, setStage] = useState(0);
  const [isLoadEqt, setIsLoadEqt] = useState(false);
  const ManagerClasses = ManagerStyles();
  const history = useHistory();
  const [tableRows, setTableRows] = useState([]);
  const [dataType, setDataType] = useState("");
  const dispatch = useDispatch();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.treeData
  );
  const NextStage = () => {
    if (Stage === 0) {
      setStage(1);
      history.push("/data_manager/maintenance_data");
    }
    if (Stage === 1) {
      setStage(2);
      history.push("/data_manager/parameter_estimation");
    }
    if (Stage === 2) {
      setStage(3);
      history.push("/data_manager/historical_data");
    }
  };
  const PreviousStage = () => {
    if (Stage === 1) {
      setStage(0);
      history.push("/data_manager");
    }
    if (Stage === 2) {
      setStage(1);
      history.push("/data_manager/maintenance_data");
    }
    if (Stage === 3) {
      setStage(2);
      history.push("/data_manager/parameter_estimation");
    }
  };

  const nextModule = (settings) => {
    // if (settings.ReliabilityDashboard) {
    //   props.history.push("/rDashboard");
    // }
    props.history.push("/rDashboard");
  };

  const [locationKeys, setLocationKeys] = useState([]);
  useEffect(() => {
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
  }, [locationKeys]);
  let marks = [
    {
      value: 20,
      label: "Operational Data",
    },
    {
      value: 50,
      label: "Maintenance Data",
    },
    {
      value: 90,
      label: "Parameter Estimation",
    },
  ];

  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentNomenclature = currentSelection["nomenclature"];
  const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature);

  const matchingId = matchingItems[0]?.id;
  const handleOnLoadSystem = () => {
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
        // alert("Hurray");
        debugger;
        if (location.pathname === "/data_manager") {
          history.push("/data_manager");
        } else if (location.pathname === "/data_manager/maintenance_data") {
          history.push("/data_manager/maintenance_data");
        } else if (location.pathname === "/data_manager/parameter_estimation") {
          history.push("/data_manager/parameter_estimation");
        } else {
          const equipment = d.treeD.filter((x) => x.parentId === null)[0];
          if (equipment.repairType === "Replaceable") {
            history.push("/data_manager/historical_data");
          } else {
            // <Redirect to="/data_manager/historical_data/repairable_overhaul"></Redirect>;
            history.push("/data_manager/historical_data/repairable_overhaul");
          }
        }
        // if (
        //   location.pathname !== "/data_manager" ||
        //   location.pathname !== "/data_manager/maintenance_data" ||
        //   location !== "/data_manager/parameter_estimation"
        // ) {

        // }
        dispatch(treeDataActions.setTreeData({ treeData: d.treeD }));
      });
    setSnackBarMessage({
      severity: "success",
      message: "Loaded Equipment Successfully",
      showSnackBar: true,
    });
  };



  const handleSaveSupport = (data) => {
    fetch("/save_historical_data", {
      method: "POST",
      body: JSON.stringify({
        data: data,
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
        if (data.code) {
          setSnackBarMessage({
            severity: "success",
            message: "Data Saved Successfully",
            showSnackBar: true,
          });
        } else {
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


  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };
  const handleSave = () => {
    debugger;
    let data = [];
    if (dataType === "oem") {
      data = tableRows.map((x) => {
        const life_estimate1 = Object.keys(x).sort()[1];
        const life_estimate2 = Object.keys(x).sort()[2];
        return {
          component_id: x.id,
          id: uuid(),
          life_estimate1,
          life_estimate2,
          life_estimate1_val: x[life_estimate1],
          life_estimate2_val: x[life_estimate2],
        };
      });
    } else if (dataType === "fdp") {
      data = tableRows.map((x) => {
        return {
          component_id: x.id,
          id: uuid(),
          installationDate: x.installationDate,
          removalDate: x.removalDate,
          actual_failure: x.AFS,
        };
      });
      //End of FDP
    } else if (dataType === "oemE") {
      data = tableRows.map((x) => {
        const life_estimate1 = Object.keys(x).sort()[1];
        return {
          component_id: x.id,
          id: uuid(),
          life_estimate1,
          maxLife: x.MaxLife,
          minLife: x.MinLife,
          life_estimate1_val: x[life_estimate1],
          mostLikely: x.MostLikely,
          componentFailure: x.componentFailure,
          time_wo_failure: x.time_wo_failure,
        };
      });
    } else if (dataType === "expert") {
      data = tableRows.map((x) => {
        return {
          component_id: x.id,
          id: uuid(),
          maxLife: x.MaxLife,
          minLife: x.MinLife,
          mostLikely: x.MostLikely,
          componentFailure: x.componentFailure,
          time_wo_failure: x.time_wo_failure,
        };
      });
    } else if (dataType === "prob") {
      data = tableRows.map((x) => {
        return {
          component_id: x.id,
          id: uuid(),
          failureProb: x.FailureProbability,
          time: x.Time,
        };
      });
    } else if (dataType === "nprd") {
      data = tableRows.map((x) => {
        return {
          component_id: x.id,
          id: uuid(),
          failureRate: x.FailureRate,
          beta: x.Beta,
        };
      });
    } else if (dataType === "import_replacable") {
      data = tableRows.map((x) => {
        if (x.ScaleParameter !== "" && x.ShapeParameter !== "") {
          return {
            component_id: x.id,
            id: uuid(),
            eta: x.ScaleParameter,
            beta: x.ShapeParameter,
          };
        }
      });
      console.log("");
    } else if (dataType === "insertOpData") {
      data = tableRows.map((x) => {
        return {
          id: x.id,
          oid: uuid(),
          Date: x.Date,
          AverageRunning: x.AverageRunning,
        };
      });
    } else if (dataType === "maintData") {
      data = tableRows;
    } else if (dataType === "overhauls") {
      const main_data = tableRows["mainTable"];
      const sub_data = tableRows["subTable"];
      console.log("This is from Overhauls");
      console.log(main_data);
      console.log(sub_data);
      let parent = "";
      let subSystem = [];
      try {
        parent = systemConfigurationTreeData.filter(
          (x) => x.parentId === null
        )[0].id;
        subSystem = systemConfigurationTreeData.filter(
          (x) => x.parentId === null || x.parentId === parent
        );

        const subFinalData = sub_data.map((x) => {
          return {
            id: uuid(),
            overhaulNum: x.overhaulNum,
            runAge: x.runAge,
            numMaint: x.numMaint,
            component_id: parent,
          };
        });

        const mainFinalData = main_data.map((x) => {
          if (x.subSystem) {
            const subSystemId = subSystem.filter(
              (sS) => sS.nomenclature === x.subSystem
            )[0].id;
            return {
              id: uuid(),
              overhaulId: x.overhaulId,
              date: x.Date,
              maintenanceType: x.maintenanceType,
              totalRunAge: x.totalRunAge,
              subSystemId: subSystemId,
            };
          }
        });
        data = [{ mainData: mainFinalData, subData: subFinalData }];
      } catch {
        console.log("Error");
      }
    } else if(dataType === "overhaul_age"){
      const main_data = tableRows["mainTable"];
      const sub_data = tableRows["subTable"];
      const subFinalData = sub_data.map((x) => {
        return {
          id: uuid(),
          runAge: x.runAge,
          nomenclature: x.nomenclature,
          ship_name: x.shipName,
          equipment_name: x.equipmentName

        }
      })
      data = [{ mainData: main_data, subData: subFinalData }];
    }
      else if (dataType === "interval") {
      data = tableRows.map((x) => {
        return {
          component_id: x.id,
          id: uuid(),
          installationStartDate: x.installationStartDate,
          installationEndDate: x.installationEndDate,
          removalStartDate: x.removalStartDate,
          removalEndDate: x.removalEndDate,
          interval_failure: x.IFS,
        };
      });
    }
    debugger;
    data = data.filter((x) => x !== undefined);
    handleSaveSupport({ data, dataType: dataType });
  };



  const handleTableUpdatedRows = (allRows, dataType) => {
    setTableRows(allRows);
    debugger
    if (location.pathname == '/data_manager/historical_data/repairable_overhaul') {
      setDataType(dataType);
    }
    else if (location.pathname == '/data_manager/maintenance_data') {
      setDataType(dataType);
    }
    else {
      setDataType(dataType)
    }
  };
  const handleHistoricalDataDropdownChange = (dataType) => {
    setDataType(dataType);
  };
  const handleUpdateList = () => {
    setSnackBarMessage({
      severity: "success",
      message: "List Updated Successfully",
      showSnackBar: true,
    });
  }
  const userSelectionClassName =
  location.pathname === "/data_manager/historical_data/repairable_overhaul"
    ? styles.flex3
    : styles.flex;
  return (
    <React.Fragment>
      <Navigation />
      {/* <NewModule /> */}
      {/* {location.pathname !== "/data_manager/historical_data/repairable_overhaul" && (
        <StageSlider marks={marks} default={marks[Stage]["value"]} />
      )} */}
      <Route
        path={[
          "/data_manager/maintenance_data",
          "/data_manager/",
          "/data_manager/parameter_estimation",
        ]}
      >
        <div className={userSelectionClassName}>
          <UserSelection />
          <div>
            <Route path="/data_manager">
              <Route path={"/data_manager/"}>
                <Button
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                  onClick={handleOnLoadSystem}
                >
                  Load Equipment
                </Button>
              </Route>
              {/* <Route exact path={"/data_manager/parameter_estimation"}>
                <Button
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                  onClick={() => handleUpdateList()}
                >
                  Update List
                </Button>
              </Route> */}
              <Route
                exact
                path={[
                  "/data_manager/maintenance_data",
                  "/data_manager",
                  "/data_manager/parameter_estimation",
                ]}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                  onClick={() => PreviousStage()}
                >
                  Back
                </Button>
              </Route>
              <Route
                exact
                path={[
                  "/data_manager/historical_data",
                  "/data_manager/historical_data/failure_datapoint",
                  "/data_manager/historical_data/oem",
                  "/data_manager/historical_data/oem_expert",
                  "/data_manager/historical_data/expert_judgement",
                  "/data_manager/historical_data/probability_failure",
                  "/data_manager/historical_data/nprd",
                  "/data_manager/historical_data/import_data",
                  "/data_manager/historical_data/repairable_overhaul",
                ]}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                  component={Link}
                  to="/data_manager/parameter_estimation"
                >
                  Back to Parameter Estimation
                </Button>
              </Route>
              <Button
                variant="contained"
                color="primary"
                className={ManagerClasses.buttons}
                onClick={handleSave}
              >
                Save
              </Button>
              <Route
                exact
                path={[
                  "/data_manager",
                  "/data_manager/maintenance_data",
                  "/data_manager/import_data",
                  "/data_manager/historical_data/nprd",
                ]}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                  onClick={() => NextStage()}
                >
                  Next Stage
                </Button>
              </Route>
              <Route exact path="/data_manager/parameter_estimation">
                <Button
                  onClick={() => nextModule(props.settings)}
                  variant="contained"
                  color="primary"
                  className={ManagerClasses.buttons}
                >
                  Next Module
                </Button>
              </Route>
            </Route>
          </div>
        </div>
      </Route>

      <Switch>
        <Route path="/data_manager" exact={true}>
          <div className={styles.managerTable}>
            <OperationalData tableUpdate={handleTableUpdatedRows} />
          </div>
        </Route>
        <Route path="/data_manager/maintenance_data" exact={true}>
          <div className={styles.managerTable}>
            <MaintenanceData tableUpdate={handleTableUpdatedRows} />
          </div>
        </Route>
        <Route path="/data_manager/historical_data/:subRoute*" exact={true}>
          <div className={styles.historicalTable}>
            <HistoricalData
              tableUpdate={handleTableUpdatedRows}
              handleDropdown={handleHistoricalDataDropdownChange}
            />
          </div>
        </Route>
        <Route path="/data_manager/parameter_estimation" exact={true}>
          <div className={styles.managerTable}>
            <ParameterEstimation
              list={systemConfigurationTreeData.filter((x) => x.lmu === 1 || x.parent_id == null)}
              rope={true}
            />
          </div>
        </Route>
        {/* <Route
          path="/data_manager/historical_data/repairable_overhaul"
          exact={true}
        >
          <div className={styles.managerTable}>
            <RepairableOverhaul />
          </div>
        </Route> */}
      </Switch>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </React.Fragment>
  );
}

export default DataManager;