/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  makeStyles
} from "@material-ui/core";
import { AgGridColumn } from "ag-grid-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Navigation from "../../../components/navigation/Navigation";
import { treeDataActions } from "../../../store/TreeDataStore";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import Table from "../../../ui/Table/Table";
import UserSelection from "../../../ui/userSelection/userSelection";
import styles from "./CreateMaintenance.module.css";
import { saveSensor } from "./SaveHandler";

const useStyles = makeStyles({
  buttons: {
    margin: 5,
    minWidth: 170,
    float: "right",
  },
  align: {
    marginBottom: 10,
  },
  debugPanel: {
    position: 'fixed',
    top: 10,
    right: 10,
    backgroundColor: '#1e1e1e',
    color: '#00ff00',
    padding: 15,
    borderRadius: 5,
    fontSize: 11,
    fontFamily: 'monospace',
    maxWidth: 400,
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 9999,
    border: '2px solid #00ff00',
    boxShadow: '0 0 10px rgba(0,255,0,0.3)'
  },
  debugTitle: {
    color: '#ffff00',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid #00ff00',
    paddingBottom: 5
  },
  debugSection: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #333'
  },
  debugLabel: {
    color: '#00aaff',
    fontWeight: 'bold'
  },
  debugValue: {
    color: '#00ff00',
    marginLeft: 10
  },
  debugError: {
    color: '#ff0000',
    fontWeight: 'bold'
  },
  debugSuccess: {
    color: '#00ff00',
    fontWeight: 'bold'
  },
  closeDebug: {
    float: 'right',
    cursor: 'pointer',
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: 16
  }
});

const headers = [
  "name",
  "unit",
  "min",
  "max",
  "P",
  "F",
  "frequency",
];

function downloadBlankCSV() {
  const csvContent = headers.join(",");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "blank_data.csv";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

const AssignType = (props) => {
  const [type, setType] = useState("");
  const [ageBasedUnit, setAgeBasedUnit] = useState(null);
  const [Rtype, setRtype] = useState("Repairable");
  const [calendarBasedUnit, setCalendarBasedUnit] = useState(null);
  const condition = "sensorBased";
  const [failureMode, setFailureMode] = useState(null);
  const [pRows, setpRows] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const fileInputRef = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();

  // Redux selectors
  const CurrentSelected = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const sData = useSelector((state) => state.userSelection.componentsData);
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const systemData = useSelector((state) => state.treeData.treeData);
  const failureModes = useSelector((state) => state.treeData.failureModes);

  // Extract current nomenclature
  const currentNomenclature = CurrentSelected["nomenclature"];
  const currentShipName = CurrentSelected["shipName"];

  // Filter matching items
  const matchingItems = sData.filter(
    (item) => item.nomenclature === currentNomenclature &&
              item.ship_name === currentShipName
  );
  
  const matchingId = matchingItems[0]?.id;

  // Get eqptId
  const eqptIdResult = systemData.filter(
    (data) => data.name === currentSelection.equipmentName
  );
  
  const eqptId = eqptIdResult[0]?.id;

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const rows = csvData.split("\n");

        const headers = rows[0].split(",").map((header) => header.trim());
        const parsedData = [];

        for (let i = 1; i < rows.length; i++) {
          const rowData = rows[i].split(",");
          if (rowData.length === headers.length) {
            const rowObject = {};
            for (let j = 0; j < headers.length; j++) {
              let value = rowData[j].trim();
              rowObject[headers[j]] = value;
            }
            rowObject["id"] = uuid();
            rowObject["EquipmentId"] = eqptId;
            rowObject["ComponentId"] = eqptId;
            
            parsedData.push(rowObject);
          }
        }

        setpRows(parsedData);
      };

      reader.readAsText(file);
    }
  };

  const handleMtypeChange = (e) => {
    setType(e.target.value);
  };

  // Snackbar
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

  const [monitoringType, setMonitoringType] = useState("intermittent");
  const [numPara, setNumPara] = useState(0);

  const addPRows = (n) => {
    let newRows = [];
    while (n > 0) {
      const newRow = {
        EquipmentId: eqptId,
        ComponentId: eqptId,
        id: uuid(),
        name: "",
        unit: "",
        min: "",
        max: "",
        frequency: "",
      };
      
      newRows = [...newRows, newRow];
      n--;
    }
    
    setpRows(newRows);
  };

  const parameterColumnDefs = [
    <AgGridColumn
      field="name"
      headerName="Channel/Parameter Name"
      headerTooltip="Channel/Parameter Name"
      editable={true}
    />,
    <AgGridColumn
      field="unit"
      headerName="Unit"
      headerTooltip="Unit"
      editable={true}
    />,
    <AgGridColumn
      field="min"
      headerName="Minimum Value"
      headerTooltip="Minimum Value"
      editable={true}
    />,
    <AgGridColumn
      field="max"
      headerName="Maximum Value"
      headerTooltip="Maximum Value"
      editable={true}
    />,
    <AgGridColumn
      field="P"
      headerName="P"
      headerTooltip="P"
      editable={true}
    />,
    <AgGridColumn
      field="F"
      headerName="F"
      headerTooltip="F"
      editable={true}
    />,
    monitoringType === "intermittent" ? (
      <AgGridColumn
        field="frequency"
        headerName="Frequency"
        headerTooltip="Frequency"
        editable={true}
      />
    ) : null,
  ];

  const updateParameterRowData = (allRows) => {
    // existing logic
  };

  const [lvlwiseRows, setLvlwiseRows] = useState([]);
  const [sbAlarmRows, setSbAlarmRows] = useState([]);
  const [sbAlarmAtts, setSbAlarmAtts] = useState([]);
  
  const handleSave = () => {
    if (type === "conditionBased") {
      if (condition === "sensorBased") {
        let newRows = pRows.map((row) => {
          return { ...row, FailureModeId: failureMode };
        });
        
        let validAlarms = sbAlarmRows
          .filter((data) => {
            return !data.invalid;
          })
          .map((row) => row.id);
          
        saveSensor(
          {
            sData: newRows,
            lData: lvlwiseRows,
            aData: sbAlarmRows.filter((row) => {
              return !row.invalid;
            }),
            alarmAtts: sbAlarmAtts.filter((attrow) => {
              return validAlarms.includes(attrow.AlarmId);
            }),
          },
          setSnackBarMessage
        );
      }
    }
  };

  const handleSubmit = () => {
    const payload = {
      nomenclature: CurrentSelected["nomenclature"],
      ship_name: CurrentSelected["shipName"],
    };

    if (matchingId) {
      payload.component_id = matchingId;
    }
    
    fetch("/api/fetch_system", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        let treeD = d["treeD"];
        let failureModes = d["failureMode"];
        
        if (treeD) {
          setRtype(treeD[0]?.repairType);
        }
        
        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
          })
        );
        dispatch(treeDataActions.setFailureModes(failureModes));
      });
      
    setSelectedEquipment(currentNomenclature);
  };

  return (
    <>
      <Navigation />
      
      {/* DEBUG PANEL */}
      {showDebug && (
        <div className={classes.debugPanel}>
          <div className={classes.debugTitle}>
            🐛 DEBUG PANEL
            <span className={classes.closeDebug} onClick={() => setShowDebug(false)}>✖</span>
          </div>
          
          <div className={classes.debugSection}>
            <div className={classes.debugLabel}>Current Selection:</div>
            <div>nomenclature: <span className={classes.debugValue}>{currentNomenclature || 'null'}</span></div>
            <div>shipName: <span className={classes.debugValue}>{currentShipName || 'null'}</span></div>
            <div>equipmentName: <span className={classes.debugValue}>{currentSelection.equipmentName || 'null'}</span></div>
          </div>
          
          <div className={classes.debugSection}>
            <div className={classes.debugLabel}>Matching from sData:</div>
            <div>Found items: <span className={classes.debugValue}>{matchingItems.length}</span></div>
            {matchingItems[0] && (
              <>
                <div>name: <span className={classes.debugValue}>{matchingItems[0].name}</span></div>
                <div>nomenclature: <span className={classes.debugValue}>{matchingItems[0].nomenclature}</span></div>
                <div>ship_name: <span className={classes.debugValue}>{matchingItems[0].ship_name}</span></div>
              </>
            )}
            <div>matchingId: <span className={classes.debugValue}>{matchingId || 'undefined'}</span></div>
          </div>
          
          <div className={classes.debugSection}>
            <div className={classes.debugLabel}>Matching from systemData:</div>
            <div>Found items: <span className={classes.debugValue}>{eqptIdResult.length}</span></div>
            {eqptIdResult[0] && (
              <>
                <div>name: <span className={classes.debugValue}>{eqptIdResult[0].name}</span></div>
                <div>id: <span className={classes.debugValue}>{eqptIdResult[0].id}</span></div>
              </>
            )}
            <div>eqptId: <span className={classes.debugValue}>{eqptId || 'undefined'}</span></div>
          </div>
          
          <div className={classes.debugSection}>
            <div className={classes.debugLabel}>⚠️ COMPARISON:</div>
            <div>matchingId: <span className={classes.debugValue}>{matchingId}</span></div>
            <div>eqptId: <span className={classes.debugValue}>{eqptId}</span></div>
            <div>
              Same? {matchingId === eqptId ? 
                <span className={classes.debugSuccess}>✓ YES</span> : 
                <span className={classes.debugError}>✗ NO - THEY ARE DIFFERENT!</span>
              }
            </div>
          </div>
          
          <div className={classes.debugSection}>
            <div className={classes.debugLabel}>Using in rows:</div>
            <div>EquipmentId: <span className={classes.debugValue}>{eqptId}</span></div>
            <div>ComponentId: <span className={classes.debugValue}>{eqptId}</span></div>
          </div>
          
          {pRows.length > 0 && (
            <div className={classes.debugSection}>
              <div className={classes.debugLabel}>Current pRows[0]:</div>
              <div>EquipmentId: <span className={classes.debugValue}>{pRows[0].EquipmentId}</span></div>
              <div>ComponentId: <span className={classes.debugValue}>{pRows[0].ComponentId}</span></div>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.userSelection}>
        <UserSelection />
        <Button
          className={styles.btn}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </div>
      
      <div className={styles.assignDiv}>
        <div className={styles.assignContent}>
          <div className={styles.flex}>
            <h3>Selected Component: {selectedEquipment}</h3>
            <RadioGroup
              row
              name="maintenance-type"
              value={type}
              onChange={handleMtypeChange}
              className={styles.mtypeRadio}
            >
              <FormControlLabel
                value="runToFailure"
                control={<Radio />}
                label="Run to Failure"
              />
              {Rtype === "Repairable" || (
                <FormControlLabel
                  value="ageBased"
                  control={<Radio />}
                  label="Age Based Maintenance"
                />
              )}
              {Rtype === "Repairable" || (
                <FormControlLabel
                  value="calendarBased"
                  control={<Radio />}
                  label="Calendar Based Maintenance"
                />
              )}
              <FormControlLabel
                value="conditionBased"
                control={<Radio />}
                label="Condition Based Maintenance"
              />
            </RadioGroup>
          </div>
        </div>
        
        {type === "conditionBased" && (
          <div className={styles.MTypeContent}>
            <div className={styles.formField}>
              <label htmlFor="failure-mode">Failure Mode to be inspected</label>
              <Select
                disableUnderline
                labelId="failure-mode-label"
                id="failure-mode"
                value={failureMode}
                onChange={(e) => setFailureMode(e.target.value)}
                className={styles.input}
              >
                {failureModes?.map((ele) => {
                  return (
                    <MenuItem key={ele.failure_mode} value={ele.failure_mode}>
                      {ele.failure_mode}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            
            {condition === "sensorBased" && (
              <>
                <RadioGroup
                  row
                  name="monitoring-type"
                  value={monitoringType}
                  onChange={(e) => setMonitoringType(e.target.value)}
                  className={styles.sensorRadio}
                >
                  <div>
                    <FormControlLabel
                      labelPlacement="start"
                      value="intermittent"
                      control={<Radio />}
                      label="Intermittent Monitoring"
                    />
                  </div>
                  <FormControlLabel
                    labelPlacement="start"
                    value="continuous"
                    control={<Radio />}
                    label="Continuous Monitoring"
                  />
                </RadioGroup>
                
                <div className={styles.parameters}>
                  <div className={styles.formField}>
                    <label htmlFor="parameters">Number of parameters</label>
                    <input
                      className={styles.input}
                      value={numPara}
                      onChange={(e) => setNumPara(e.target.value)}
                      type="number"
                      id="parameters"
                      name="parameters"
                    />
                    <Button
                      onClick={() => addPRows(numPara)}
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: 10 }}
                    >
                      Generate Rows
                    </Button>
                  </div>
                  
                  <div className={styles.formField}>
                    <label htmlFor="parameters">Define parameters</label>
                    <Table
                      columnDefs={parameterColumnDefs}
                      rowData={pRows}
                      tableUpdate={updateParameterRowData}
                      height={200}
                    />
                  </div>
                  
                  <div className={styles.FooterClass}>
                    <div className={styles.importBtnContainer}>
                      <Link to="/maintenance_allocation/add_data">
                        <Button variant="contained" color="primary">
                          Add Sensor Data
                        </Button>
                      </Link>
                    </div>
                    
                    <div className={styles.importBtnContainer}>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                      />
                      <Button
                        className={classes.buttons}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "50px" }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        Import File
                      </Button>
                    </div>
                    
                    <div className={styles.importBtnContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={downloadBlankCSV}
                        style={{ marginTop: "50px" }}
                      >
                        Download Blank CSV
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        style={{ margin: "50px 0 0 10px" }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};

export default AssignType;