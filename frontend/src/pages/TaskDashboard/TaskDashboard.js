import {
 Button,
 Checkbox,
 CircularProgress,
 Dialog,
 DialogActions,
 DialogContent,
 IconButton,
 InputLabel,
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableRow,
 TextField,
 Typography,
 makeStyles,
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";

import MomentUtils from "@date-io/moment";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import { AgGridColumn } from "ag-grid-react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Navigation from "../../components/navigation/Navigation";
import { taskActions } from "../../store/taskStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import DataManagerTable from "../../ui/Table/DataManagerTable";
import AccessControl from "../Home/AccessControl";
import PaperTable from "./PaperTable";
import CollapsibleTable from "./ResTable";
import { taskTableColumns } from "./TaskGridColumns";
import RenderMultipleComponent from "./TaskRenderMultipleComponent";
import styles from "./tDashboard.module.css";


const useStyles = makeStyles((theme) => ({
 root: {
 paddingLeft: 10,
 background: "#fff",
 border: "1px solid #0263a1",
 borderRadius: "5px",
 width: "320px",
 minHeight: "40px",
 boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
 },
 inputRoot: { width: "100%" },
 uiContainer: {},
 closeButton: {
 display: "block",
 float: "right",
 marginTop: "10px",
 marginRight: "10px",
 },
 dialogPaper: {
 minWidth: 700,
 maxWidth: 860,
 borderRadius: 8,
 },
 modalTitleBar: {
 display: "flex",
 alignItems: "center",
 justifyContent: "space-between",
 padding: "14px 20px",
 backgroundColor: "#1976d2",
 },
 modalTitleText: {
 color: "#fff",
 fontWeight: 700,
 fontSize: 18,
 },
 modalCloseBtn: {
 color: "#fff",
 padding: 4,
 },
 tableHeaderRow: {
 backgroundColor: "#1976d2",
 "& th": {
 color: "#fff",
 fontWeight: 700,
 },
 },
}));

const TaskDashboard = () => {
 const classes = useStyles(); // ── called inside component, defined outside ──

 const precision = 10;
 const [gridApi, setGridApi] = useState(null);
 const [gridCompApi, setGridCompApi] = useState(null);
 const [gridTaskApi, setGriTaskdApi] = useState(null);
 const [missionProfileData, setMissionData] = useState([]);
 const rowState = [];
 const [rowCompState, setCompRows] = useState([]);
 const dispatch = useDispatch();
 const [phasedata, setPhaseData] = useState([]);
 const [missionDurations, setMissionDurations] = useState([]);
 const setParallelIds = (d) => { console.log(d); };
 const [taskOption, settaskOption] = useState([]);
 const [taskShipNameOption, settaskShipNameOption] = useState([]);
 const [recommedation, setRecommedation] = useState([]);
 const [totalReliability, setTotalReliability] = useState(null);
 const [showPaper, setShowPaper] = useState(false);
 const [showInputTables, setShowInputTables] = useState(true);
 const selectedTaskName = "";
 const [taskTableData, settaskTableData] = useState([]);
 const [taskMissionTableData, settaskMissionTableData] = useState([]);
 const [SnackBarMessage, setSnackBarMessage] = useState({
 severity: "error",
 message: "This is awesome",
 showSnackBar: false,
 });
 const [entireData, setentireData] = useState(null);
 const [isLoading, setIsLoading] = useState(false);
 const [nonOpsEquipment, setNonOpsEquipment] = useState([]);
 const [opsEquipment, setOpsEquipment] = useState([])
 // ── Ops Modal state ──
 const [opsModalOpen, setOpsModalOpen] = useState(false);
 const [tableData, setTableData] = useState([]);
 const [pendingChanges, setPendingChanges] = useState({});
 const [isSaving, setIsSaving] = useState(false);
 const [searchKeyword, setSearchKeyword] = useState("");
 const [equipmentLoading, setEquipmentLoading] = useState(false);

 const currentShip = useSelector((state) => state.taskData.currentShip);
 const currentTaskName = useSelector((state) => state.taskData.currentTaskName);

 // ── Fetch equipment ──
 const fetchData = async () => {
 setEquipmentLoading(true);
 try {
 const response = await fetch("/api/all_equipments_onship", {
 method: "POST",
 body: JSON.stringify({ shipName: currentShip }),
 headers: { "Content-Type": "application/json", Accept: "application/json" },
 });
 const data = await response.json();
 if (data.code === 1) {
 setTableData(data.equipments);
 } else {
 setSnackBarMessage({ severity: "error", message: data.message, showSnackBar: true });
 }
 } catch (error) {
 console.error("Error fetching data:", error);
 setSnackBarMessage({ severity: "error", message: "Error fetching data", showSnackBar: true });
 } finally {
 setEquipmentLoading(false);
 }
 };

 
 const handleops = (row, enable) => {
 setPendingChanges((prev) => ({
 ...prev,
 [row.nomenclature]: { ...row, is_ops: enable },
 }));
 setTableData((prev) =>
 prev.map((eq) =>
 eq.nomenclature === row.nomenclature ? { ...eq, is_ops: enable } : eq
 )
 );
 };

 // ── Save Changes — commit all pending changes to API ──
 const handleSaveChanges = async () => {
 const changes = Object.values(pendingChanges);
 if (changes.length === 0) {
 setSnackBarMessage({ severity: "error", message: "No changes to save.", showSnackBar: true });
 return;
 }
 setIsSaving(true);
 try {
 await Promise.all(
 changes.map((row) =>
 fetch("/api/set_equip_ops", {
 method: "POST",
 body: JSON.stringify({
 shipName: currentShip,
 nomenclature: row.nomenclature,
 enabled: row.is_ops,
 }),
 headers: { "Content-Type": "application/json", Accept: "application/json" },
 })
 )
 );
 setPendingChanges({});
 setSnackBarMessage({ severity: "success", message: "Changes saved successfully!", showSnackBar: true });
 fetchData();
 } catch (error) {
 console.error("Error saving changes:", error);
 setSnackBarMessage({ severity: "error", message: "Error saving changes.", showSnackBar: true });
 } finally {
 setIsSaving(false);
 }
 };

 // ── Open modal ──
 const handleOpenOpsModal = () => {
 if (!currentShip) {
 setSnackBarMessage({ severity: "error", message: "Please select a Ship first!", showSnackBar: true });
 return;
 }
 setSearchKeyword("");
 setTableData([]);
 setPendingChanges({});
 setOpsModalOpen(true);
 fetchData();
 };

 // ── Filtered equipment ──
 const filteredTableData = tableData
 .filter(
 (row, index, self) =>
 index === self.findIndex(
 (r) => r.component_name === row.component_name && r.nomenclature === row.nomenclature
 )
 )
 .filter((row) => {
 const searchString = searchKeyword.toLowerCase();
 const matchesComponentName = row.component_name.toLowerCase().includes(searchString);
 const matchesNomenclature = row.nomenclature.toLowerCase().includes(searchString);
 return matchesComponentName || (!matchesComponentName && matchesNomenclature);
 });

 const onCellValueChanged = (params) => {
 if (params.colDef.field === "duration") {
 const updatedDurations = missionDurations.map((duration, index) =>
 index === params.node.rowIndex ? params.newValue : duration
 );
 setMissionDurations(updatedDurations);
 }
 };

 const agHeaderStyle = { backgroundColor: "#1976d2", color: "#fff" };

 const ImportColumns = [
 <AgGridColumn
 field="missionType" headerName="Phase" headerTooltip="Phase"
 cellEditor="agSelectCellEditor" checkboxSelection={true}
 cellEditorParams={{ values: ["", "Harbour", "Entry Leaving Harbour", "Cruise", "Defense Station", "Action Station"] }}
 width="220" editable={true} headerStyle={agHeaderStyle}
 />,
 <AgGridColumn
 field="duration" headerName="Duration" headerTooltip="Duration"
 type="number" width={100} editable={true} onCellValueChanged={onCellValueChanged}
 headerStyle={agHeaderStyle}
 />,
 ];

 const compColumns = [
 <AgGridColumn
 field="missionType" headerName="Phase" headerTooltip="Phase"
 cellEditor="agSelectCellEditor" checkboxSelection={true}
 cellEditorParams={{ values: ["", "Harbour", "Entry Leaving Harbour", "Cruise", "Defense Station", "Action Station"] }}
 width="220" editable={true} headerStyle={agHeaderStyle}
 />,
 <AgGridColumn
 field="component"
 headerName="Select Component for Phase"
 headerTooltip="Select Component for Phase"
 cellEditorFramework={RenderMultipleComponent}
 cellEditorParams={{ setParallelIds, label: "Select Component for Phase", isMultiple: true, currentTask: selectedTaskName, opsEquipment: opsEquipment }}
 width="300" editable={true} headerStyle={agHeaderStyle}
 />,
 ];

 const AddRow = () => {
 const defaultRow = [{ id: uuidv4(), duration: 0, missionType: "" }];
 setMissionDurations((prev) => [...prev, defaultRow.duration]);
 gridApi.applyTransaction({ add: defaultRow });
 };

 const updateCompTable = () => {
 setIsLoading(true);
 let allRowData = [];
 gridApi.forEachNode((node) => allRowData.push(node.data));

 if (allRowData.length === 0) {
 setSnackBarMessage({ severity: "error", message: "Please add mission phases before recommending a solution.", showSnackBar: true });
 setIsLoading(false);
 return;
 }

 const mission_phases_data = allRowData.map((item) => ({ ...item, duration: parseFloat(item.duration) || 0 }));

 fetch("/api/phase_json", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ phases: mission_phases_data, shipName: currentShip, task_name: currentTaskName }),
 })
 .then((res) => res.json())
 .then((data) => {
 if (data.code) {
 const rec = data.recommedation;
 if (!rec) {
 setSnackBarMessage({ severity: "error", message: "Unexpected response from server. Missing recommendation data.", showSnackBar: true });
 setIsLoading(false);
 return;
 }
 if (data.ops_equipment) setNonOpsEquipment(data.Non_ops_equipment);
 const results = mission_phases_data.map((item) => {
 const recData = rec.results[item["id"]];
 return { ...item, components: recData && Array.isArray(recData.components) ? recData.components : [] };
 });
 setRecommedation(results);
 setTotalReliability(rec.rel.toFixed(precision));
 setNonOpsEquipment(data.Non_ops_equipment);
 setOpsEquipment(data.ops_equipment)
 setSnackBarMessage({ severity: "success", message: data.message, showSnackBar: true });
 setIsLoading(false);
 setShowPaper(!showPaper);
 } else {
 setSnackBarMessage({ severity: "error", message: data.message, showSnackBar: true });
 setIsLoading(false);
 }
 })
 .catch((error) => {
 setIsLoading(false);
 setSnackBarMessage({ severity: "error", message: "Network error: " + error.message, showSnackBar: true });
 });

 setCompRows(allRowData.map((d) => ({ missionType: d["missionType"], component: "", id: d["id"] })));
 };

 const saveTaskReset = () => {
 debugger;
 try {
 setShowPaper(false);
 let allRowData = [], allRowCData = [];
 gridApi.forEachNode((node) => allRowData.push(node.data));
 gridCompApi.forEachNode((node) => allRowCData.push(node.data));
const selectedComponents = [
  ...new Set(
    allRowCData.flatMap(row =>
      (row.components || []).map(c =>
        typeof c === "object"
          ? (c.label || c.name)
          : c
      )
    )
  )
];
 const mainData = allRowData.map((d, index) => ({
 id: d["id"], missionType: d["missionType"],
 duration: d["duration"], components: allRowCData[index]["components"],
 }));

 setPhaseData(mainData);
 localStorage.setItem(`${currentShip}_${currentTaskName}`, JSON.stringify({ shipName: currentShip, taskName: currentTaskName, data: mainData, cal_rel: totalReliability ,selected_components: selectedComponents}));

 gridApi.selectAll(); gridApi.applyTransaction({ remove: gridApi.getSelectedRows() });
 gridCompApi.selectAll(); gridCompApi.applyTransaction({ remove: gridCompApi.getSelectedRows() });

 setMissionData([]); setRecommedation([]); settaskTableData([]); settaskMissionTableData([]);
 setSnackBarMessage({ severity: "success", message: "Task added for comparison successfully!", showSnackBar: true });
 } catch (error) {
 setSnackBarMessage({ severity: "error", message: "Please Select data and Enter Mission Phase Data!!", showSnackBar: true });
 }
 };

 const deleteRows = () => {
 debugger;
 gridApi.applyTransaction({ remove: gridApi.getSelectedRows() });
 let allRowData = [];
 gridApi.forEachNode((node) => allRowData.push(node.data));
 setMissionData(allRowData);
 };

 const resetGrids = () => {
 if (gridApi) { gridApi.setRowData([]); gridApi.refreshCells(); }
 if (gridCompApi) { gridCompApi.setRowData([]); gridCompApi.refreshCells(); }
 };

 useEffect(() => {
 fetch("/api/task_dash_populate", { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json" } })
 .then((res) => res.json())
 .then((data) => {
 setentireData(data);
 settaskShipNameOption(data["ship_name"]);
 dispatch(taskActions.onLoad({ taskData: data }));
 });
 
 }, []);

 const onResetMissionHandler = () => {
 resetGrids(); setShowPaper(false); setRecommedation([]);
 Object.entries(localStorage).forEach(([key]) => {
 if (key !== "settings" && key !== "login" && key !== "userData") localStorage.removeItem(key);
 });
 setSnackBarMessage({ severity: "success", message: "Data Cleared", showSnackBar: true });
 settaskTableData([]); settaskMissionTableData([]);
 };

 const [isCalculating, setIsCalculating] = useState(false);

 const onSubmitHandler = () => {
 const fData = Object.entries(localStorage)
 .filter(([name]) => !["settings", "login", "userData"].includes(name))
 .map(([, val]) => JSON.parse(val));

 if (fData.length > 0) {
 setIsCalculating(true);
 fetch("/api/task_rel", { method: "POST", body: JSON.stringify(fData), headers: { "Content-Type": "application/json", Accept: "application/json" } })
 .then((res) => res.json())
 .then((d) => {
 let taskData = [], taskMissionData = [];
 d.forEach((tData) => {
 tData["data"].forEach((pTD) => {
 taskMissionData.push({ shipName: tData["shipName"], taskName: tData["taskName"], rel: parseFloat(pTD["rel"]).toFixed(precision), missionType: pTD["missionName"], ComponentMission: pTD["missionName"] });
 pTD["comp_rel"].forEach((cTD) => taskMissionData.push({ shipName: tData["shipName"], taskName: tData["taskName"], rel: parseFloat(cTD["rel"]).toFixed(precision), missionType: pTD["missionName"], ComponentMission: cTD["compName"] }));
 });
 taskData.push({ shipName: tData["shipName"], taskName: tData["taskName"], rel: parseFloat(tData["rel"]).toFixed(precision), cal_rel: parseFloat(tData["cal_rel"]).toFixed(precision) });
 });
 setIsCalculating(false); settaskTableData(taskData); settaskMissionTableData(taskMissionData);
 });
 } else {
 setSnackBarMessage({ severity: "error", message: "Please Select data and Enter Mission Phase Data!!", showSnackBar: true });
 }
 setShowInputTables(false);
 };

 const onHandleSnackClose = () => setSnackBarMessage((prev) => ({ ...prev, showSnackBar: false }));
 const updateFinalRowData = (d) => setMissionData(d);

 const shipNameChange = (event, value) => {
 debugger;
 const tt = entireData;
 if (tt && tt["task_ship_name"] && (Array.isArray(value) ? value.length > 0 && value[0]?.name : value?.name)) {
 const selectedShipName = Array.isArray(value) ? value[0].name : value.name;
 if (tt["task_ship_name"].hasOwnProperty(selectedShipName)) {
 settaskOption(tt["task_ship_name"][selectedShipName].map((s) => ({ name: s })));
 dispatch(taskActions.updateCurrentShip({ ship: selectedShipName }));
 }
 }
 };

 const TaskNameChange = (event, value) => {
 if (value && typeof value === "object" && value.name)
 dispatch(taskActions.updateCurrentTask({ task: value.name }));
 };

 return (
 <AccessControl allowedLevels={["L0", "L1", "L2", "L3", "L4", "L5"]}>
 <MuiPickersUtilsProvider utils={MomentUtils}>
 <Navigation />
 <div className={styles.body}>
 <div className={styles.mprofile}>
 <div style={{ display: "flex", justifyContent: "flex-start", gap: "10rem", width: "100%" }}>
 <div style={{ width: "250px" }}>
 <InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
 <Typography variant="h5">Ship Name</Typography>
 </InputLabel>
 <Autocomplete classes={classes} id="ship-select" options={taskShipNameOption} getOptionLabel={(o) => o.name} onChange={shipNameChange}
 renderInput={(params) => <TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} variant="standard" />}
 />
 </div>
 <div style={{ width: "300px" }}>
 <InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
 <Typography variant="h5">Task Name</Typography>
 </InputLabel>
 <Autocomplete classes={classes} id="task-select" options={taskOption} getOptionLabel={(o) => o.name} onChange={TaskNameChange}
 renderInput={(params) => <TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} variant="standard" />}
 />
 </div>
 </div>
 <Button variant="contained" color="primary" style={{ marginTop: "2rem" }} onClick={onResetMissionHandler}>
 Reset Screen
 </Button>
 </div>

 {!showInputTables && (
 <Button variant="contained" color="secondary" className={classes.closeButton} onClick={() => setShowInputTables(true)}>X</Button>
 )}

 <div className={classes.uiContainer}>
 {showInputTables && (
 <>
 <div className={styles.table}>
 <DataManagerTable columnDefs={ImportColumns} setGrid={setGridApi} gridApi={gridApi} rowData={rowState} tableUpdate={updateFinalRowData} tableSize={250} />
 </div>

 <div className={styles.tableFooter}>
 <Button variant="contained" startIcon={<AddIcon />} color="secondary" onClick={AddRow}>Add Row</Button>
 <Button variant="contained" startIcon={<DeleteIcon />} color="secondary" onClick={deleteRows}>Delete Rows</Button>
 <Button variant="contained" color="secondary" onClick={handleOpenOpsModal}>Ops / Non-Ops</Button>
 <Button variant="contained" color="secondary" onClick={updateCompTable}>Recommend Solution</Button>
 
 </div>

 <div>
 {isLoading ? (
 <CircularProgress size={24} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
 ) : showPaper ? (
 <PaperTable response={recommedation} rel={totalReliability} Non_ops_equipment={nonOpsEquipment} />
 ) : null}
 </div>

 <div className={styles.table}>
 <DataManagerTable columnDefs={compColumns} setGrid={setGridCompApi} gridApi={gridCompApi} rowData={rowCompState} tableUpdate={updateFinalRowData} tableSize={250} />
 </div>

 <div className={styles.tableFooter}>
 <Button variant="contained" startIcon={<AddIcon />} color="secondary" onClick={saveTaskReset}>Add this Task for Comparison</Button>
 <Button variant="contained" color="secondary" onClick={onSubmitHandler}>Calculate Reliability</Button>
 </div>
 </>
 )}

 {!showInputTables && (
 <>
 {isCalculating ? (
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "5rem", gap: "1rem" }}>
 <CircularProgress size={60} />
 <Typography variant="h6">Calculating Reliability...</Typography>
 </div>
 ) : taskTableData.length > 0 ? (
 <>
 <div className={styles.table}>
 <DataManagerTable columnDefs={taskTableColumns} setGrid={setGriTaskdApi} gridApi={gridTaskApi} rowData={taskTableData} tableUpdate={() => {}} tableSize={250} />
 </div>
 <div className={styles.table}>
 <CollapsibleTable tableData={taskMissionTableData} />
 </div>
 </>
 ) : (
 <div style={{ textAlign: "center", marginTop: "5rem" }}>
 <Typography variant="h6">No data available</Typography>
 </div>
 )}
 </>
 )}
 </div>

 <Dialog
 open={opsModalOpen}
 onClose={() => setOpsModalOpen(false)}
 classes={{ paper: classes.dialogPaper }}
 maxWidth="md"
 fullWidth
 >
 <div className={classes.modalTitleBar}>
 <Typography className={classes.modalTitleText}>
 Equipment — Ops / Non-Ops Status
 </Typography>
 <IconButton className={classes.modalCloseBtn} size="small" onClick={() => setOpsModalOpen(false)}>
 <CloseIcon />
 </IconButton>
 </div>

 <DialogContent>
 <TextField
 variant="outlined"
 size="small"
 fullWidth
 label="Search"
 value={searchKeyword}
 onChange={(e) => setSearchKeyword(e.target.value)}
 style={{ marginBottom: 12 }}
 />

 <div style={{ maxHeight: 420, overflowY: "auto" }}>
 {equipmentLoading ? (
 <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
 <CircularProgress size={36} />
 </div>
 ) : (
 <Table>
 <TableHead>
 <TableRow className={classes.tableHeaderRow}>
 <TableCell>Equipment Name</TableCell>
 <TableCell>Nomenclature</TableCell>
 <TableCell>Ops</TableCell>
 </TableRow>
 </TableHead>
 <TableBody>
 {filteredTableData.map((row) => (
 <TableRow key={row.nomenclature}>
 <TableCell>{row.component_name}</TableCell>
 <TableCell>{row.nomenclature}</TableCell>
 <TableCell>
 <Checkbox
 checked={!!row.is_ops}
 onChange={(e) => handleops(row, e.target.checked)}
 color="secondary"
 />
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 )}
 </div>
 </DialogContent>

 <DialogActions style={{ padding: "12px 20px", borderTop: "1px solid #e0e0e0" }}>
 <Button onClick={() => setOpsModalOpen(false)} variant="contained" color="secondary">
 Close
 </Button>
 <Button onClick={fetchData} variant="contained" color="secondary">
 Refresh
 </Button>
 <Button
 onClick={handleSaveChanges}
 variant="contained"
 color="secondary"
 disabled={isSaving || Object.keys(pendingChanges).length === 0}
 >
 {isSaving
 ? <CircularProgress size={20} style={{ color: "#fff" }} />
 : `Save Changes${Object.keys(pendingChanges).length > 0 ? ` (${Object.keys(pendingChanges).length})` : ""}`}
 </Button>
 </DialogActions>
 </Dialog>

 {SnackBarMessage.showSnackBar && (
 <CustomizedSnackbars message={SnackBarMessage} onHandleClose={onHandleSnackClose} />
 )}
 </div>
 </MuiPickersUtilsProvider>
 </AccessControl>
 );
};

export default TaskDashboard;