import React, { useState, useEffect, useRef, useCallback } from "react";
// import styles from "./TaskDashboard.module.css";
import {  InputLabel, TextField,makeStyles,Button, Switch, Input} from "@material-ui/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,Label,ReferenceLine } from 'recharts';
// import { arr,arr2 } from "./data";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { AgGridColumn } from "ag-grid-react";
import MomentUtils from "@date-io/moment";
import Navigation from "../../components/navigation/Navigation";
import styles from "./tDashboard.module.css";
import moment from "moment";
import CustomSelect from "../../ui/Form/CustomSelect";
import ReliabilityChart from "../Reliability Dashboard/ReliabilityChart";
import MissionSlider from "../Reliability Dashboard/MissionSlider";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Autocomplete } from "@material-ui/lab";
import Loader from "react-loader-spinner";
import EventCalendar from "../Reliability Dashboard/EventCalendar";
import { data, subSystemLevelData, events, mainData } from "../Reliability Dashboard/DashboardData";
import ReactCardFlip from "react-card-flip";
import Table from "../../ui/Table/DataManagerTable";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
// import RenderParallelComponent from "../systen_configuration/redundancy/RenderParallelComponent";
import RenderMultipleComponent from "./TaskRenderMultipleComponent";
import { taskActions } from "../../store/taskStore";
import { useDispatch, useSelector } from "react-redux";
import AccessControl from "../Home/AccessControl";
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


const TaskDashboard = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridCompApi, setGridCompApi] = useState(null);
  const [gridTaskApi, setGriTaskdApi] = useState(null);
  const [gridMissionApi, setgridMissionApi] = useState(null);
  const [missionProfileData, setMissionData] = useState([]);
  const [rowState, setRows] = useState([]);
  const [rowCompState, setCompRows] = useState([]);
  const dispatch = useDispatch();
  let ParallelIds = [];
  const setParallelIds = (d) => {
    console.log("This is shit!!")
    console.log(d)
    ParallelIds = d;
  };
  
  const [shipOption, setshipOption] = useState([]);
  const [taskOption, settaskOption] = useState([]);
  const [missionOption, setmissionOption] = useState([]);
  const [taskShipNameOption, settaskShipNameOption] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTaskShip, setselectedTaskShip] = useState("");
  const [selectedTaskName, setselectedTaskName] = useState("");
  const [selectedShipName, setselectedShipName] = useState("");

  // Reliability Dashboard
  const [showSubsystem, setSubSystem] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [isCardFlipped, setCardFlipped] = useState(false);

  const [currentMission, setMission] = useState(0);
  const [eqDataOption, setEqDataOption] = useState([]);

  const [taskTableData, settaskTableData] = useState([]);
  const [taskMissionTableData, settaskMissionTableData] = useState([]);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const [selectedEqName, setEquipmentName] = useState(null);
  const [entireData, setentireData] = useState(null);
  // const [selectedShipName, setShipName] = useState(null);
  const [selectedMissionName, setMissionName] = useState(null);

  const [graphData, setGraphData] = useState([]);

  const [missionPhaseGraphData, setMissionPhaseGraphData] = useState([]);
  const currentShip = useSelector((state) => state.taskData.currentShip);
  const currentTaskName = useSelector((state) => state.taskData.currentTaskName);
  const [subSystemData, setSubSystemData] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);
  const [cardData, setCardData] = useState(null);
  const missionName = useRef()
  const thReliab = useRef()
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const [endDate, setEndDate] = useState(new Date());
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const ImportColumns = [
    <AgGridColumn
      field="missionType"
      headerName="Mission Type"
      headerTooltip="Mission Type"
      cellEditor="agSelectCellEditor"
      checkboxSelection={true}
      cellEditorParams={{
        values: [
          "",
          "Harbour",
          "Entry Leaving Harbour",
          "Cruise",
          "Defense Station",
          "Action Station",
        ],
      }}
      width="220"
      editable={true}
    />,
    <AgGridColumn
    field="duration"
    headerName="Duration"
    headerTooltip="Duration"
    type="number"
    width={100}
    editable={true}
  />,
  ];

  const compColumns = [
    <AgGridColumn
      field="missionType"
      headerName="Mission Type"
      headerTooltip="Mission Type"
      cellEditor="agSelectCellEditor"
      checkboxSelection={true}
      cellEditorParams={{
        values: [
          "",
          "Harbour",
          "Entry Leaving Harbour",
          "Cruise",
          "Defense Station",
          "Action Station",
        ],
      }}
      width="220"
      editable={true}
    />,
    <AgGridColumn
      field="component"
      headerName="Select Component for Mission"
      headerTooltip="Select Component for Mission"
      // cellEditor="agSelectCellEditor"
      cellEditorFramework={RenderMultipleComponent}
      cellEditorParams={{
        setParallelIds: setParallelIds,
        label: "Select Component for Mission",
        isMultiple: true,
        currentTask: selectedTaskName
      }}
      //onCellClicked={onCellChanged}
      width="220"
      editable={true}
    />
  ];
  // <AgGridColumn
  //     field="component"
  //     headerName="Select Component for Mission"
  //     headerTooltip="Select Component for Mission"
  //     // cellEditor="agSelectCellEditor"
  //     cellEditorFramework={RenderMultipleComponent}
  //     cellEditorParams={{
  //       setParallelIds: setParallelIds,
  //       label: "Select Component for Mission",
  //       isMultiple: true,
  //       currentTask: selectedTaskName
  //     }}
  //     //onCellClicked={onCellChanged}
  //     width="220"
  //     editable={true}
  //   />

  const taskTableColumns = [
    <AgGridColumn
    field="shipName"
    headerName="Ship Name"
    headerTooltip="Ship Name"
    width={100}
    editable={true}
  />,
    <AgGridColumn
    field="taskName"
    headerName="Task Name"
    headerTooltip="Task Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="rel"
    headerName="Reliability"
    headerTooltip="Reliability"
    type="number"
    width={100}
    editable={true}
  />
  ];
  const taskMissionTableColumns = [
    <AgGridColumn
    field="shipName"
    headerName="Ship Name"
    headerTooltip="Ship Name"
    width={100}
    editable={true}
  />,
    <AgGridColumn
    field="taskName"
    headerName="Task Name"
    headerTooltip="Task Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="missionType"
    headerName="Mission Type"
    headerTooltip="Mission Type"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="ComponentMission"
    headerName="Component/Mission Type"
    headerTooltip="Component/Mission Type"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="rel"
    headerName="Reliability"
    headerTooltip="Reliability"
    type="number"
    width={100}
    editable={true}
  />
  ];


  const AddRow = () => {
    const defaultRow = [
      {
        id: uuidv4(),
        duration: 0,
        missionType: "",
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
  };
const updateCompTable = () => {
  let allRowData = [];
  gridApi.forEachNode((node) => allRowData.push(node.data));
  let newData = []
  allRowData.forEach((d) => {
    newData.push({"missionType": d["missionType"], "component": "", "id": d["id"]})
  })
  setCompRows(newData)
  // debugger;
}

  const saveTaskReset = () => {
    debugger;
    let allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    let allRowCData = [];
    gridCompApi.forEachNode((node) => allRowCData.push(node.data));
    //logic for saving it to local data
    let mainData = []
    allRowData.forEach((d, index) => {
      mainData.push({"id": allRowData[index]["id"], "missionType": allRowData[index]["missionType"], 
      "duration": allRowData[index]["duration"], "components": allRowCData[index]["components"]})
    })
    let localData = {'shipName': currentShip, "taskName": currentTaskName, "data": mainData} 
    console.log(localData)
    localStorage.setItem(`${currentShip}_${currentTaskName}`, JSON.stringify(localData));
    gridApi.selectAll();
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });

    // let allCompRows = []
    gridCompApi.selectAll();
    const selectedCompRows = gridCompApi.getSelectedRows();
    gridCompApi.applyTransaction({ remove: selectedCompRows });
    allRowData = [];
    // gridApi.forEachNode((node) => allRowData.push(node.data));
    setMissionData(allRowData)
  }
  const deleteRows = () => {
    debugger;
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    let allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    setMissionData(allRowData)
    // console.log(selectedRows);
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


  useEffect(() => {
    fetch("/task_dash_populate", {
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
        const mission_data = data["missionData"];
        const taskNames = data["tasks"]
        const taskData = data["tasks_data"]
        const task_ship_name = data["ship_name"]
        setmissionOption(mission_data);
        setentireData(data)
        // settaskOption(taskNames);      
        settaskShipNameOption(task_ship_name)
        dispatch(taskActions.onLoad({'taskData': data}))
      });
  }, []);


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
    inputRoot:{
      width: '100%'
    },
  });
  const classes=dropDownStyle();
  let arr=[]
  let arr2=[]
  for(let i=0;i<50;i++){
    // const maxDate = Date.now();
    // const timestamp = Math.floor(Math.random() * maxDate);
    arr=[...arr,{name:new Date(new Date(2021, 1, 1).getTime() + Math.random() * (new Date(2022, 1, 1).getTime() - new Date(2021, 1, 1).getTime())).toISOString().slice(0,10),uv:Math.floor(Math.random() * (80 - 30 + 1)) + 30}]

    arr2=[...arr2,{name:new Date(new Date(2021, 1, 1).getTime() + Math.random() * (new Date(2022, 1, 1).getTime() - new Date(2021, 1, 1).getTime())).toISOString().slice(0,10),uv:Math.floor(Math.random() * (75 - 30 + 1)) + 30}]
  }
  const [showGraph,setShowGraph]=useState(false);

  const onResetMissionHandler = () => {
    localStorage.clear();

  }

  const onSubmitHandler = () => { 
    // setMission(0);
    let storedData = Object.entries(localStorage)
    // storedData.pop()
    let fData = []
    storedData.forEach(ele => {
      debugger;
      let name = ele[0]
      // let elemData = JSON.parse(ele[0])
      if(name != "settings"){
        fData.push(JSON.parse(ele[1]))
      }
    })
    if(fData.length > 0){
      const data = {"taskName": currentTaskName, "shipName": currentShip,
       "selectedMission": missionName.current.value, "missionProfileData": missionProfileData}
      fetch("/task_rel", {
        method: "POST",
        body: JSON.stringify(fData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((d) => {
          debugger;
          let taskData = [];
          let taskMissionData = [];
          d.forEach((tData) => {
            let perMData = tData["data"]
            perMData.forEach((pTD) => {
              taskMissionData.push({"shipName": tData["shipName"], "taskName": tData["taskName"], 
              "rel": Math.round(pTD["rel"]*100)/100, "missionType": pTD["missionName"], "ComponentMission": pTD["missionName"]})
              let componentRelData = pTD["comp_rel"]
              componentRelData.forEach((cTD) => {
                taskMissionData.push({"shipName": tData["shipName"], "taskName": tData["taskName"], 
              "rel": Math.round(cTD["rel"]*100)/100, "missionType": pTD["missionName"], "ComponentMission": cTD["compName"]})
              })
            })
            taskData.push({"shipName": tData["shipName"], "taskName": tData["taskName"], "rel": Math.round(tData["rel"]*100)/100})
          });
          settaskTableData(taskData)
          settaskMissionTableData(taskMissionData)
        });
    }else{
      // alert("Please add Mission Definition!!")
      setSnackBarMessage({
        severity: "error",
        message: "Please Select data and Enter Mission Phase Data!!",
        showSnackBar: true,
      });      
    }
    
  };

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };
  const updateFinalRowData = (d) => {
    setMissionData(d);
  };

  const shipNameChange = (event, value) => {
    debugger;
    let tt = entireData;
    let sNames = tt["task_ship_name"][value[0]["name"]]
    let fNames = []
    sNames.forEach(s => fNames.push({"name": s}))
    settaskOption(fNames)
    // setselectedTaskShip(value)
    dispatch(taskActions.updateCurrentShip({'ship': value[0].name}))
  }
  const TaskNameChange = (event, value) => {
    dispatch(taskActions.updateCurrentTask({'task': value[0].name}))
  }
  const minThreshold=45
  const maxThreshold=60
  return (
    <AccessControl allowedLevels={['L1', 'L2', 'L3','L4','L5']}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Navigation />
      <div className={styles.body}>
        <div className={styles.mprofile}>
          {/* <div style={{ width: "300px" }}>
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
            <CustomSelect fields={['a','b','c','d','e']}/>
              
           
            
          </div> */}
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

            <Autocomplete
            classes={classes}
              multiple
              id="tags-standard"
              options={taskShipNameOption}
              getOptionLabel={(option) => option.name}
              onChange = {shipNameChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{...params.InputProps, disableUnderline: true}}
                  variant="standard"
                  // label="Multiple values"
                  // placeholder="Favorites"
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
              Task Name
            </InputLabel>

            <Autocomplete
            classes={classes}
              multiple
              id="tags-standard"
              options={taskOption}
              getOptionLabel={(option) => option.name}
              onChange = {TaskNameChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{...params.InputProps, disableUnderline: true}}
                  variant="standard"
                  // label="Multiple values"
                  // placeholder="Favorites"
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
               Mission Name
            </InputLabel>

            {/* <TextField ref={missionName}   id="outlined-basic" variant="outlined" /> */}
            <input
            className={styles.missionName}
                    ref={missionName}
                    // onChange={onHandleChange}
                  ></input>
            
          </div>

          {/* <div style={{ width: "300px" }}>
            <InputLabel
              style={{
                fontWeight: "bold",
                color: "black",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
               Threshold Reliability
            </InputLabel>
            <input
            className={styles.missionName}
                    ref={thReliab}
                  
                  ></input>
            
          </div> */}

          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: "2rem",
            }}
            onClick={onResetMissionHandler} 
          >
            Reset Temp. Missions
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: "2rem",
            }}
            onClick={onSubmitHandler} 
          >
            Calculate Reliability
          </Button>
         
          
        </div>
        
        <div>
          <div className={styles.table}>
          <Table
        columnDefs={ImportColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
        tableSize= {180}
      />
          </div>
      <div className={styles.tableFooter}>
      <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              onClick={() => updateCompTable()}
            >
              Update Mission Component Reliability
            </Button>
            <Button
            style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              onClick={() => AddRow()}
            >
              Add Row
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              onClick={() => deleteRows()}
            >
              Delete Rows
            </Button>
          </div>
      <div className={styles.table}>
      <Table
        columnDefs={compColumns}
        setGrid={setGridCompApi}
        gridApi={gridCompApi}
        rowData={rowCompState}
        tableUpdate={updateFinalRowData}
        tableSize= {180}
      />
      </div>
      <div className={styles.tableFooter}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              style={{ marginRight: 10 }}
              onClick={() => saveTaskReset()}
            >
              Save this Task for Comparison
            </Button>
          </div>
        {/* <div style={{ width: "300px" }}>
        <TextField id="outlined-basic" label="Mission Name" 
        variant="outlined" defaultValue="Temp Mission" />
          </div>
        <div style={{ width: "300px" }}>
        <TextField id="outlined-basic" label="Harbour Duration"
         variant="outlined" defaultValue="0" type="number"   />
          </div>
          <div style={{ width: "300px" }}>
          <TextField id="outlined-basic" label="Entry Leaving Harbour Duration"
           variant="outlined" defaultValue="0" type="number" />
          </div>
          <div style={{ width: "300px" }}>
          <TextField id="outlined-basic" label="Cruise Duration"
           variant="outlined" defaultValue="0" type="number" />
          </div>
          <div style={{ width: "300px" }}>
          <TextField id="outlined-basic" label="Defence Duration"
           variant="outlined" defaultValue="0" type="number" />
          </div>
          <div style={{ width: "300px" }}>
          <TextField id="outlined-basic" label="Action Duration" 
          variant="outlined" defaultValue="0" type="number" />
          </div> */}
        
        </div>

        <div className={styles.table}>
          {taskTableData.length > 0 && 
          <Table columnDefs={taskTableColumns}
          setGrid={setGriTaskdApi}
          gridApi={gridTaskApi}
          rowData={taskTableData}
          tableUpdate={() => {}}
          tableSize= {180}>
            </Table>}
        </div>

        <div className={styles.table}>
          {taskTableData.length > 0 && 
          <Table columnDefs={taskMissionTableColumns}
          setGrid={setgridMissionApi}
          gridApi={gridMissionApi}
          rowData={taskMissionTableData}
          tableUpdate={() => {}}
          tableSize= {290}></Table>}
        </div>
        
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
export default TaskDashboard;
