import React from "react";
import Navigation from "../../components/navigation/Navigation";
import StageSlider from "../../components/slider/NewSlider";
import { Button } from "@material-ui/core";
import Table from "../../ui/Table/Table";
import styles from "./Phasemanager.module.css";
import { useState } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import NewModule from "../../components/module/NewModule";
import PhaseManagerHome from "./Home/Home";
import AddPhase from "./Add/AddPhase";
import { useDispatch, useSelector } from "react-redux";
import { phaseActions } from "../../store/PhaseStore";
import LifeMultiplier from "./LifeMultiplier/LifeMultiplier";
import DCMultiplier from "./DCMultiplier/dcMultiplier";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import UserSelection from "../../ui/userSelection/userSelection";
import { treeDataActions } from "../../store/TreeDataStore";
import { v4 as uuid } from "uuid";
const PhaseStyles = makeStyles({
  formControl: {
    // margin: '2rem',
    minWidth: "20%",
  },
  Submit: {
    // margin: '2rem',
    height: 40,
  },
  Pbuttons: {
    margin: 5,
    minWidth: 170,
    float: "right",
  },
});
const PhaseManager = (props) => {
  const dispatch = useDispatch();
  const systemData = useSelector((state) => state.treeData.treeData);

  const currentSelectedSystem = useSelector(
    (state) => state.userSelection.currentSelection.equipmentName
  );

  const [gridApi, setGridApi] = useState(null);

  const [finalTableData, setFinalData] = useState([]);

  const setFinalTableData = (d) => {
    setFinalData(d);
    if (finalTableData.length > 0) {
      console.log("Hi");
    }
  };

  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );

  const location = useLocation();
  console.log("This is Phase Manager Redux Call");
  console.log(systemData);
  const [Stage, setStage] = useState(0);
  const PhaseClasses = PhaseStyles();
  const [paramName, setParamName] = useState("");
  const [MType, setMType] = useState("Quantative");
  const [Unit, setUnit] = useState("");
  const [Status, setStatus] = useState("");
  const [desc, setDesc] = useState("");
  const [LBound, setLBound] = useState("");
  const [UBound, setUBound] = useState("");
  const [PRange, setPrange] = useState("");

  const handleParamNameChange = (e) => {
    setParamName(e.target.value);
  };
  const handleMTypeChange = (e) => {
    setMType(e.target.value);
  };
  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };
  const handleLBoundChange = (e) => {
    setLBound(e.target.value);
  };
  const handleUBoundChange = (e) => {
    setUBound(e.target.value);
  };
  const handlePRangeChange = (e) => {
    setPrange(e.target.value);
  };
  //
  const AddRange = () => {
    props.history.push("/phase_manager/add");
  };
  const NextStage = () => {
    if (Stage === 0) {
      setStage(1);
      props.history.push("/phase_manager/life_multiplier");
    }
    if (Stage === 1) {
      setStage(2);
      props.history.push("/phase_manager/dcmultiplier");
    }
  };

  let marks = [
    {
      value: 30,
      label: "Modify Phase",
    },
    {
      value: 60,
      label: "Life Multiplier",
    },
    {
      value: 90,
      label: "Duty Cycle Multiplier(System)",
    },
  ];
  const addPhaseTodBList = () => {
    if (paramName.trim() !== "" && PRange.trim() !== "") {
      let newRows = [
        {
          PhaseName: paramName,
          MeasurementType: MType,
          LowerBound: LBound,
          UpperBound: UBound,
          Status: Status,
          PhaseRange: PRange,
          Unit: Unit,
          Description: desc,
          id: uuid(),
        },
      ];
      let lowRow = {
        PhaseName: paramName,
        MeasurementType: MType,
        LowerBound: 0,
        UpperBound: LBound - 1,
        Status: Status,
        PhaseRange: "Low",
        Unit: Unit,
        Description: "This is system generated phase.",
        id: uuid(),
      };
      let upperRow = {
        PhaseName: paramName,
        MeasurementType: MType,
        LowerBound: +UBound + 1,
        UpperBound: 100,
        Status: Status,
        PhaseRange: "High",
        Unit: Unit,
        Description: "This is system generated phase.",
        id: uuid(),
      };
      newRows.push(lowRow);
      newRows.push(upperRow);
      debugger;
      dispatch(phaseActions.addPhase({ newPhase: newRows }));
      setParamName("");
      setLBound("");
      setUBound("");
      setStatus("");
      setPrange("");
      setUnit("");
      setDesc("");
      props.history.push("/phase_manager/");
    } else {
      alert("Please Enter Phase Name and Phase Range Name");
    }
  };

  const nextModule = (settings) => {
    if (settings.HEP) {
      props.history.push("/HEP");
    } else if (settings.DataManager) {
      props.history.push("/data_manager");
    } else if (settings.ReliabilityDashboard) {
      props.history.push("/rDashboard");
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
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };

  const onLoadTreeStructure = () => {
    fetch("/fetch_system", {
      method: "POST",
      body: JSON.stringify({
        system: currentSelection["equipmentName"],
        ship_name: currentSelection["shipName"],
        request_from: "phase",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        let system_data = d["system_data"];
        let phase_data = d["phase_data"];
        dispatch(treeDataActions.setTreeData({ treeData: system_data }));
        dispatch(phaseActions.loadPhase({ newPhase: phase_data }));
      });
  };

  const onSaveButtonClickHandler = () => {
    const currentLocation = location.pathname;
    let newTdata = [];
    let dType = "";
    if (currentLocation === "/phase_manager/") {
      const ComponentId = systemData.filter(
        (x) => x.name === currentSelectedSystem
      )[0].id;
      newTdata = finalTableData.map((x) => {
        return { ...x, ComponentId: ComponentId };
      });
      dType = "insertPhase";
    } else if (currentLocation === "/phase_manager/life_multiplier") {
      newTdata = finalTableData;
      dType = "insertLifeMultiplier";
    } else if (currentLocation === "/phase_manager/dcmultiplier") {
      newTdata = finalTableData;
      dType = "insertDCMultiplier";
    }
    debugger;
    //Else End
    if (newTdata.length > 0) {
      fetch("/save_phase", {
        method: "POST",
        body: JSON.stringify({
          flatData: newTdata,
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
            message: "Some Error Occured. " + error,
            showSnackBar: true,
          });
        });
    } else {
      setSnackBarMessage((prevState) => {
        const data = {
          ...prevState,
          message: "This is error",
          showSnackBar: true,
        };
        return data;
      });
    }
  };

  return (
    <>
      <Navigation />
      {/* <Module/> */}
      <NewModule />
      {/* <Slider marks={marks} default={marks[0]["value"]}/> */}
      <StageSlider marks={marks} default={marks[Stage]["value"]} />
      <Route
        exact
        path={[
          "/phase_manager/",
          "/phase_manager/life_multiplier",
          "/phase_manager/dcmultiplier",
        ]}
      >
        <div className={styles.flex1}>
          <UserSelection />

          <div>
            <Route path="/phase_manager" exact={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => AddRange()}
                className={PhaseClasses.Pbuttons}
              >
                Add More Range
              </Button>
            </Route>
            <Route path="/phase_manager/life_multiplier" exact={true}>
              <Button
                variant="contained"
                color="primary"
                className={PhaseClasses.Pbuttons}
              >
                Update
              </Button>
            </Route>

            <Route
              // exact
              path={["/phase_manager", "/phase_manager/life_multiplier"]}
            >
              <Button
                variant="contained"
                color="primary"
                className={PhaseClasses.Pbuttons}
                onClick={() => onSaveButtonClickHandler()}
              >
                Save
              </Button>
            </Route>
            <Route path={["/phase_manager"]}>
              <Button
                variant="contained"
                color="primary"
                className={PhaseClasses.Pbuttons}
                onClick={() => onLoadTreeStructure()}
              >
                Load Equipment
              </Button>
            </Route>
            <Route
              exact
              path={[
                "/phase_manager",
                "/phase_manager/life_multiplier",
                "/phase_manager/add",
              ]}
            >
              <Button
                variant="contained"
                color="primary"
                className={PhaseClasses.Pbuttons}
                onClick={() => NextStage()}
              >
                Next Stage
              </Button>
            </Route>
            <Route exact path="/phase_manager/dcmultiplier">
              <Button
                onClick={() => nextModule(props.settings)}
                variant="contained"
                color="primary"
                className={PhaseClasses.Pbuttons}
              >
                Next Module
              </Button>
            </Route>
          </div>
        </div>
      </Route>
      <Route path="/phase_manager/add" exact={true}>
        <div className={styles.addFlex}>
          <Button
            variant="contained"
            color="primary"
            className={PhaseClasses.Pbuttons}
            onClick={addPhaseTodBList}
          >
            Update Phase List
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={PhaseClasses.Pbuttons}
            onClick={() => NextStage()}
          >
            Next Stage
          </Button>
        </div>
      </Route>
      <Switch>
        <Route path="/phase_manager" exact={true}>
          <PhaseManagerHome
            gridApi={gridApi}
            setGridApi={setGridApi}
            tableUpdate={setFinalTableData}
          ></PhaseManagerHome>
        </Route>
        <Route path="/phase_manager/add" exact={true}>
          <AddPhase
            MType={MType}
            Status={Status}
            handleDescChange={handleDescChange}
            desc={desc}
            handleUBoundChange={handleUBoundChange}
            UBound={UBound}
            handleLBoundChange={handleLBoundChange}
            LBound={LBound}
            handlePRangeChange={handlePRangeChange}
            PRange={PRange}
            handleStatusChange={handleStatusChange}
            handleUnitChange={handleUnitChange}
            Unit={Unit}
            handleMTypeChange={handleMTypeChange}
            handleParamNameChange={handleParamNameChange}
            paramName={paramName}
          ></AddPhase>
        </Route>
        <Route path="/phase_manager/life_multiplier" exact={true}>
          <LifeMultiplier tableUpdate={setFinalTableData}></LifeMultiplier>
        </Route>
        <Route path="/phase_manager/dcmultiplier" exact={true}>
          <DCMultiplier tableUpdate={setFinalTableData}></DCMultiplier>
        </Route>
      </Switch>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};
export default PhaseManager;

// const save_fm = () => {
//   let final_fm_data = [];
//   finalTableData.map(x => {
//     if(x.fouthCol.trim() != ""){
//       fm_split = x.fouthCol.split(',')
//       fm_split.forEach(x => {
//         final_fm_data.push({
//           id: uuid(),
//           componentId,
//           x,
//         });
//       })

//     }else{

//     }
//     final_fm_data.push({
//       id: uuid(),
//       componentId,
//       failure_mode_value,
//     });
//   })
// }
