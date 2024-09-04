import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Navigation from "../../../components/navigation/Navigation";
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from "../../../ui/Form/AutoSelect";
import UserSelection from "../../../ui/userSelection/userSelection";
import styles from "../CreateMaintenance/CreateMaintenance.module.css";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import CustomSelect from "../../../ui/Form/CustomSelect";

const Critical_RCM = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const [fData, setfData] = useState([]);
  const [fDataCritical, setfDataCritical] = useState([]);
  const questionsOptions= ["Yes", "No"];
  const [questionsF, setquestionsF] = useState(null);
  const [questionsConditional, setquestionsConditional] = useState(null);
  const [questionsPreventive, setquestionsPreventive] = useState(null);
  const [questionsSensor, setquestionsSensor] = useState(null);
  const [questionsMission, setquestionsMission] = useState(null);

  const [questionsOperating, setquestionsOperating] = useState(null);
  const [questionsDowntime, setquestionsDowntime] = useState(null);
  const [questionIsItCose, setquestionIsItCose] = useState(null);

  // Missiona and Safety
  const [questionSensorSafetyMission, setquestionSensorSafetyMission] =
    useState(null);
  const [questionsPFS, setquestionsPFS] = useState(null);
  const [questionInspection, setquestionInspection] = useState(null);
  const [questionFeasible, setquestionFeasible] = useState(null);
  let AllData = useSelector((state) => state.treeData.treeData);

  const [finalRCMAns, setfinalRCMAns] = useState(null);

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
const [tData,setTdata]=useState([]);
  const onLoadTreeStructure = () => {
    debugger;
    fetch("/fetch_assembly_rcm", {
      method: "POST",
      body: JSON.stringify({
        nomenclature: currentSelection["nomenclature"],
        ship_name: currentSelection["shipName"],
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        debugger;
        let treeD = d["treeD"];
        let failureModes = d["failureMode"];
        setTdata(treeD)
        setfData(d["asm"]);
        console.log(d["asm"], "asm");
        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
            failureModes: failureModes,
          })
        );
  
        // Chain the second fetch call here
        return fetch("/save_assembly_rcm", {
          method: "POST",
          body: JSON.stringify({
            system: currentSelection["equipmentName"],
            ship_name: currentSelection["shipName"],
            asm_data: tData,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      })
      .then((res) => res.json())
      .then((d) => {
        // alert(d.message)
        setSnackBarMessage({
          severity: "success",
          message: d.message,
          showSnackBar: true,
        });
      });
  };
  
  console.log("fData", fData);
  const [selectedComponent, setComponent] = useState(null);
  const [selectedCriticalComponent, setCriticalComponent] = useState([]);
  const selectOnChange = (e, value) => {
    setComponent(value);
    debugger;
    let lmuData = [];
    let first_ele = AllData.filter((x) => x.id === value.component_id)[0];
    let pData = [first_ele];

    while (pData.length > 0) {
      let ele = pData.pop();
      let childs = AllData.filter((x) => x.parentId === ele.id);
      if (childs.length === 0) {
        lmuData.push(ele);
      } else {
        pData = [...pData, ...childs];
      }
    }
    console.log("lmuData", lmuData);
    setfDataCritical(lmuData);
  };

  const lmuSelectOnChange = (e, value) => {
    console.log(value);
    setCriticalComponent(value);
  };

  const reset_everything = () => {
    setfinalRCMAns(null);
    setquestionsConditional(null);
    setquestionIsItCose(null);
    setquestionsSensor(null);
    setquestionsPreventive(null);
  };
  const resert_below_conditional = () => {
    setfinalRCMAns(null);
    setquestionIsItCose(null);
    setquestionsSensor(null);
    setquestionsPreventive(null);
  };
  const resert_below_cost = () => {
    setfinalRCMAns(null);
    setquestionsSensor(null);
    setquestionsPreventive(null);
  };
  const resert_below_sensor = () => {
    setfinalRCMAns(null);
  };
  const reset_everything2 = () => {
    setfinalRCMAns(null);
    setquestionSensorSafetyMission(null);
    setquestionsPFS(null);
    setquestionInspection(null);
    setquestionsPreventive(null);
    setquestionFeasible(null);
    setquestionIsItCose(null);
  };
  const reset_below_sensor_s_m = () => {
    setfinalRCMAns(null);
    setquestionsPFS(null);
    setquestionInspection(null);
    setquestionsPreventive(null);
    setquestionFeasible(null);
    setquestionIsItCose(null);
  };
  const reset_below_PFS = () => {
    setfinalRCMAns(null);
    setquestionInspection(null);
    setquestionsPreventive(null);
    setquestionFeasible(null);
    setquestionIsItCose(null);
  };
  const reset_below_Inspection = () => {
    setfinalRCMAns(null);
    setquestionsPreventive(null);
    setquestionFeasible(null);
    setquestionIsItCose(null);
  };
  const reset_below_Feasible = () => {
    setfinalRCMAns(null);
    setquestionsPreventive(null);
    setquestionIsItCose(null);
  };
  const conditionMonitoring = (data, name) => {
    if (name === "Is Sensor based condition monitoring available?") {
      reset_below_sensor_s_m();
      setquestionSensorSafetyMission(data);
    } else if (name === "Is P-F interval sufficiently long?") {
      reset_below_PFS();
      setquestionsPFS(data);
    } else if (name === "Is Inspection Procedure available?") {
      reset_below_Inspection();
      setquestionInspection(data);
    } else if (name === "Is Feasible?") {
      reset_below_Feasible();
      setquestionFeasible(data);
      if (data === "Yes") {
        setfinalRCMAns("Inspection Based!!");
      }
    } else if (name === "Is Preventive Maintenance available?") {
      if (data === "No") {
        setquestionsPreventive(data);
        setfinalRCMAns("Design Improvement is Recommended!!");
      } else {
        setquestionsPreventive(data);
      }
    } else if (name === "Is the cost is high?") {
      if (data === "No") {
        setfinalRCMAns("Calendar time based preventive Maintenance!!");
      } else {
        setfinalRCMAns("Age based preventive Maintenance!!");
      }
    } else if (name === "Is Continous Monitoring feasible?") {
      if (data === "No") {
        setfinalRCMAns("Sensor based intermittent monitoring!!");
      } else {
        setfinalRCMAns("Sensor based continous monitoring!!");
      }
    }
  };

  const conditionMonitoringOpr = (data, name) => {
    if (name === "Is conditional Monitoring available?") {
      resert_below_conditional();
      setquestionsConditional(data);
    } else if (name === "Is it costly?") {
      resert_below_cost();
      setquestionIsItCose(data);
    } else if (name === "Is Preventive Maintenance available?") {
      if (questionsConditional === "No" || questionIsItCose === "Yes") {
        if (data === "No") {
          setquestionsPreventive(data);
          setfinalRCMAns("Design Improvement is Recommended!!");
        } else {
          setquestionsPreventive(data);
        }
      }
    } else if (name === "Is the cost is high?") {
      //cost loop
      if (data === "No") {
        setfinalRCMAns("Calendar time based preventive Maintenance!!");
      } else {
        setfinalRCMAns("Age based preventive Maintenance!!");
      }
    } else if (name === "Is Sensor based Monitoring available?") {
      resert_below_sensor();
      if (data === "No") {
        setfinalRCMAns("Inspection!!");
        setquestionsSensor(data);
      } else {
        setquestionsSensor(data);
      }
    } else if (name === "Is Continous Monitoring feasible?") {
      if (data === "No") {
        setfinalRCMAns("Sensor based intermittent monitoring!!");
      } else {
        setfinalRCMAns("Sensor based continous monitoring!!");
      }
    }
  };
  const handleDowntimeChange = (data, name) => {
    //hell
    if (name === "Is it critical for downtime?") {
      reset_everything();
      setquestionsDowntime(data);
    }
    if (questionsDowntime === "Yes") {
      conditionMonitoringOpr(data, name);
    } else {
      setfinalRCMAns(
        "Component is non-critical - Run to Failure is recommended!!"
      );
    }
    //Is it critical for downtime?
  };

  const handleOperationalChange = (data, name) => {
    if (name === "Is it critical for operating enviornment?") {
      reset_everything();
      setquestionsOperating(data);
    }
    if (questionsOperating === "Yes") {
      conditionMonitoringOpr(data, name);
    } else if (questionsOperating === "No") {
      handleDowntimeChange(data, name);
    }
  };
  const questionOnChange = (e) => {
    debugger;
    let data = e.target.value;
    let name = e.target.name;
    if (name === "Is is critical for safety?") {
      reset_everything2();
      setquestionsMission(null);
      setquestionsOperating(null);
      setquestionsDowntime(null);
      setquestionsF(data);
    }

    if (questionsF === "Yes") {
      // llof for condition
      conditionMonitoring(data, name);
    } // loop ends for safety yes
    else if (questionsF === "No") {
      if (name === "Is it Critical for Mission?") {
        reset_everything2();
        setquestionsMission(data);
      }
      if (questionsMission === "Yes") {
        conditionMonitoring(data, name);
      } else if (questionsMission === "No") {
        handleOperationalChange(data, name);
      }
      // if(name === 'Is conditional Monitoring available?'){
      //   //call condition monitoring block

      // }
    }
  };
  const handleDownload = () => {
    let system = currentSelection["nomenclature"].replace(/\s/g, "");
    let ship_name = currentSelection["shipName"].replace(/\s/g, "");
    const link = document.createElement("a");
    link.download = `${ship_name}-${system}.pdf`;
    // 👇️ set to relative path
    link.href = `/${ship_name}-${system}.pdf`;
    link.click();
    // link.target = '_blank';
    // link.onClick = loadClick;
    setSnackBarMessage({
      severity: "success",
      message: "Report Downloadded Successfully",
      showSnackBar: true,
    });
  };
  const addCriticalData = () => {
    fetch("/rcm_report", {
      method: "POST",
      body: JSON.stringify({
        nomenclature: currentSelection["nomenclature"],
        ship_name: currentSelection["shipName"],
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        console.log(d.res);
        setSnackBarMessage({
          severity: "success",
          message: "Report Generated Successfully",
          showSnackBar: true,
        });
      });
  };

  const handleOptimize = () => {
    history.push("/optimize");
  };

  const SaveAssemplyHandler = () => {
    if (selectedCriticalComponent.length > 0) {
      fetch("/save_rcm", {
        method: "POST",
        body: JSON.stringify({
          system: currentSelection["equipmentName"],
          ship_name: currentSelection["shipName"],
          assembly: selectedComponent,
          component: selectedCriticalComponent,
          rcm_val: finalRCMAns,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((d) => {
          console.log(d);
        });
    }
  };

  return (
    <>
      <Navigation />
      <div className={styles.userSelection}>
        <UserSelection />
        <Button
          className={styles.btn}
          onClick={onLoadTreeStructure}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.rightSectionCrit}>
          <div style={{ display: "flex", alignItems: "start",justifyContent: "space-evenly"}}>
            <div className={styles.selectComponent}>
              Select Assemblies to be included for RCM Analysis :
              <AutoSelect
                fields={fData}
                onChange={selectOnChange}
                value={selectedComponent}
              ></AutoSelect>
            </div>
            <div className={styles.selectComponent}>
              Select Component for criticality :
              <AutoSelect
                multiple="multiple"
                fields={fDataCritical}
                onChange={lmuSelectOnChange}
                value={selectedCriticalComponent}
              ></AutoSelect>
            </div>
            {/* <div className={styles.selectComponent}> */}
            
            {/* </div> */}
          </div>
          <div>
            <Button
              className={styles.nextbtn}
              onClick={handleOptimize}
              style={{ marginRight: "2rem" }}
              variant="contained"
              color="primary"
            >
              Optimize
            </Button>
            <Button
              className={styles.nextbtn}
              onClick={addCriticalData}
              style={{ marginRight: "2rem" }}
              variant="contained"
              color="primary"
            >
              Generate Report
            </Button>
            <Button
              className={styles.nextbtn}
              onClick={handleDownload}
              style={{ marginRight: "2rem" }}
              variant="contained"
              color="primary"
            >
              Download Report
            </Button>
            <Button
              className={styles.nextbtn}
              onClick={SaveAssemplyHandler}
              style={{ marginRight: "2rem" }}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>

          <div style={{ paddingTop: "1rem" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <CustomSelect
                style={{ width: "70rem" }}
                id="q1"
                name="Is is critical for safety?"
                label="Is is critical for safety?"
                fields={questionsOptions}
                onChange={questionOnChange}
                value={""}
              />
            </div>

            {questionsF === "No" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q7"
                  name="Is it Critical for Mission?"
                  label="Is it Critical for Mission?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {/* {questionsF === 'A' && <div style={{marginBottom: "1rem", width: "100%", display: 'flex', justifyContent: 'space-around'}}>
                  <CustomSelect
                style={{ width: '70rem'}}
                id="q8"
                name= "Is condition Monitoring available?"
                label="Is condition Monitoring available?"
                fields={questionsOptions}
                onChange={questionOnChange}
                value={''}

                />
              </div>} */}

            {questionsF === "No" && questionsMission === "No" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q9"
                  name="Is it critical for operating enviornment?"
                  label="Is it critical for operating enviornment?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {/* {questionsF === 'A' && <div style={{marginBottom: "1rem", width: "100%", display: 'flex', justifyContent: 'space-around'}}>
                  <CustomSelect
                style={{ width: '70rem'}}
                id="q10"
                name= "Is condition Monitoring available?"
                label = "Is condition Monitoring available?"
                fields={questionsOptions}
                onChange={questionOnChange}
                value={''}

                />
              </div>} */}

            {/* {questionsF === 'A' && <div style={{marginBottom: "1rem", width: "100%", display: 'flex', justifyContent: 'space-around'}}>
                  <CustomSelect
                style={{ width: '70rem'}}
                id="q11"
                name= "Is preventive Maintenance available?"
                label = "Is preventive Maintenance available?"
                fields={questionsOptions}
                onChange={questionOnChange}
                value={''}

                />
              </div>} */}

            {questionsF === "No" &&
              questionsMission === "No" &&
              questionsOperating === "No" && (
                <div
                  style={{
                    marginBottom: "1rem",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <CustomSelect
                    style={{ width: "70rem" }}
                    id="q12"
                    name="Is it critical for downtime?"
                    label="Is it critical for downtime?"
                    fields={questionsOptions}
                    onChange={questionOnChange}
                    value={""}
                  />
                </div>
              )}
            {/* this is for Sensor and Mission */}
            {(questionsF === "Yes" || questionsMission === "Yes") && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q12"
                  name="Is Sensor based condition monitoring available?"
                  label="Is Sensor based condition monitoring available?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {questionSensorSafetyMission === "Yes" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q12"
                  name="Is P-F interval sufficiently long?"
                  label="Is P-F interval sufficiently long?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {(questionSensorSafetyMission === "No" ||
              questionsPFS === "No") && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q12"
                  name="Is Inspection Procedure available?"
                  label="Is Inspection Procedure available?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {questionInspection === "Yes" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q12"
                  name="Is Feasible?"
                  label="Is Feasible?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {/* Above if for sensors and mission */}
            {/* (questionsF === 'Yes') || (questionsF === 'No' && questionsMission === 'Yes') || */}
            {((questionsF === "No" &&
              questionsMission === "No" &&
              questionsOperating === "Yes") ||
              (questionsF === "No" &&
                questionsMission === "No" &&
                questionsOperating === "No" &&
                questionsDowntime === "Yes")) && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q2"
                  name="Is conditional Monitoring available?"
                  label="Is conditional Monitoring available?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {((questionsOperating === "Yes" &&
              questionsConditional === "Yes") ||
              (questionsDowntime === "Yes" &&
                questionsConditional === "Yes")) && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q2"
                  name="Is it costly?"
                  label="Is it costly?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {(questionsConditional === "No" ||
              questionIsItCose === "Yes" ||
              questionFeasible === "No" ||
              questionInspection === "No") && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q3"
                  name="Is Preventive Maintenance available?"
                  label="Is Preventive Maintenance available?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {questionsConditional === "Yes" && questionIsItCose === "No" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q4"
                  name="Is Sensor based Monitoring available?"
                  label="Is Sensor based Monitoring available?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {questionsPreventive === "Yes" && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q5"
                  name="Is the cost is high?"
                  label="Is the cost is high?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}

            {((questionIsItCose === "No" && questionsSensor === "Yes") ||
              questionsPFS === "Yes") && (
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <CustomSelect
                  style={{ width: "70rem" }}
                  id="q6"
                  name="Is Continous Monitoring feasible?"
                  label="Is Continous Monitoring feasible?"
                  fields={questionsOptions}
                  onChange={questionOnChange}
                  value={""}
                />
              </div>
            )}
            <div>
              {finalRCMAns != null && (
                <div>
                  <div className={styles.horizontalTable}>
                    <div className={styles.horizontalTableCell}>
                      <Typography variant="h6">
                        <strong>Ship Name:</strong>{" "}
                        {currentSelection["shipName"]}
                      </Typography>
                    </div>
                    <div className={styles.horizontalTableCell}>
                      <Typography variant="h6">
                        <strong>Component Name:</strong>{" "}
                        {currentSelection["equipmentName"]}
                      </Typography>
                    </div>
                    <div className={styles.horizontalTableCell}>
                      <Typography variant="h6">
                        <strong>RCM Analysis:</strong> {finalRCMAns}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Route exact path='/maintenance_allocation/create/assignMaintenance'>
          <AssignType selectedComponent={selectedComponent}/>
      </Route> */}
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};
export default Critical_RCM;
