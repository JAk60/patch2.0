import {
	Button,
	CircularProgress,
	InputLabel,
	TextField,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";

import MomentUtils from "@date-io/moment";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import { AgGridColumn } from "ag-grid-react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Navigation from "../../components/navigation/Navigation";
import { taskActions } from "../../store/taskStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import Table from "../../ui/Table/DataManagerTable";
import AccessControl from "../Home/AccessControl";
import PaperTable from "./PaperTable";
import CollapsibleTable from "./ResTable";
import { taskTableColumns } from "./TaskGridColumns";
import RenderMultipleComponent from "./TaskRenderMultipleComponent";
import styles from "./tDashboard.module.css";

const TaskDashboard = () => {
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
		inputRoot: {
			width: "100%",
		},
		uiContainer: {},
		closeButton: {
			// Styles for the close button
			display: "block",
			float: "right",
			marginTop: "10px", // Add margin or adjust as needed
			marginRight: "10px", // Add margin or adjust as needed
		},
	});
	const precision = 10;
	const [gridApi, setGridApi] = useState(null);
	const [gridCompApi, setGridCompApi] = useState(null);
	const [gridTaskApi, setGriTaskdApi] = useState(null);
	const [missionProfileData, setMissionData] = useState([]);
	const rowState = []
	const [rowCompState, setCompRows] = useState([]);
	const dispatch = useDispatch();
	const [phasedata, setPhaseData] = useState([]);
	const [missionDurations, setMissionDurations] = useState([]);
	const setParallelIds = (d) => {
		console.log("This is shit!!");
		console.log(d);
	};
	console.log("phasedata", phasedata);
	console.log(rowCompState, "This is shit!!");
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

	const currentShip = useSelector((state) => state.taskData.currentShip);
	const currentTaskName = useSelector(
		(state) => state.taskData.currentTaskName
	);
	///point1

	const onCellValueChanged = (params) => {
		console.table(phasedata, "phase data");
		const { data } = params;
		const { missionType } = data;
		console.log(missionType);
		if (params.colDef.field === "duration") {
			const updatedDurations = missionDurations.map((duration, index) =>
				index === params.node.rowIndex ? params.newValue : duration
			);
			setMissionDurations(updatedDurations);
		}
	};
	const ImportColumns = [
		<AgGridColumn
			field="missionType"
			headerName="Phase"
			headerTooltip="Phase"
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
			onCellValueChanged={onCellValueChanged}
		/>,
	];

	const compColumns = [
		<AgGridColumn
			field="missionType"
			headerName="Phase"
			headerTooltip="Phase"
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
			headerName="Select Component for Phase"
			headerTooltip="Select Component for Phase"
			cellEditorFramework={RenderMultipleComponent}
			cellEditorParams={{
				setParallelIds: setParallelIds,
				label: "Select Component for Phase",
				isMultiple: true,
				currentTask: selectedTaskName,
			}}
			width="300"
			editable={true}
		/>,
	];

	const AddRow = () => {
		const defaultRow = [
			{
				id: uuidv4(),
				duration: 0,
				missionType: "",
			},
		];
		setMissionDurations((prevDurations) => [
			...prevDurations,
			defaultRow.duration,
		]);
		gridApi.applyTransaction({
			add: defaultRow,
		});
	};
	// console.log("missionDurations", missionProfileData);
	const updateCompTable = () => {
		setIsLoading(true);
		console.log(currentTaskName);
		const durationNums = missionDurations.map((str) => parseFloat(str));
		const mission_phases_data = missionProfileData.map((item, index) => ({
			...item,
			duration: durationNums[index],
		}));
		console.log(mission_phases_data);
		fetch("/phase_json", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				phases: mission_phases_data,
				// "duration": durationNums,
				task_name: currentTaskName,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				// Handle the response data here
				console.log(data);
				if (data.code) {
					const recommendation_array = data.recommedation.results;
					const results = mission_phases_data.map((item) => {
						if (recommendation_array.hasOwnProperty(item["id"])) {
							return {
								...item,
								// eslint-disable-next-line no-useless-computed-key
								["components"]:
									recommendation_array[item["id"]],
							};
						}
						return item
					});
					console.log(results);
					setSnackBarMessage({
						severity: "Success",
						message: data.message,
						showSnackBar: true,
					});
					const reliabilityValue = data.recommedation.rel;
					setTotalReliability(reliabilityValue.toFixed(precision));
					setRecommedation(results);
					setIsLoading(false);
					setShowPaper(!showPaper);
				} else {
					setSnackBarMessage({
						severity: "error",
						message: data.message,
						showSnackBar: true,
					});
				}
			})
			.catch((error) => {
				// Handle errors here
				setIsLoading(false);
				console.error("Error:", error);
			});

		let allRowData = [];
		gridApi.forEachNode((node) => allRowData.push(node.data));
		let newData = [];
		allRowData.forEach((d) => {
			newData.push({
				missionType: d["missionType"],
				component: "",
				id: d["id"],
			});
		});
		console.log(newData);
		setCompRows(newData);
		// debugger;
	};


	const saveTaskReset = () => {
		console.log(totalReliability, "tOTAL rekl");
		debugger;
		try {
			setShowPaper(false);
			let allRowData = [];
			gridApi.forEachNode((node) => allRowData.push(node.data));
			let allRowCData = [];
			gridCompApi.forEachNode((node) => allRowCData.push(node.data));

			//logic for saving it to local data
			let mainData = [];
			allRowData.forEach((d, index) => {
				mainData.push({
					id: allRowData[index]["id"],
					missionType: allRowData[index]["missionType"],
					duration: allRowData[index]["duration"],
					components: allRowCData[index]["components"],
				});
			});

			// Add a suffix to the task key
			const suffixedTaskName = currentTaskName + "_Netra";

			let localData = {
				shipName: currentShip,
				taskName: suffixedTaskName,
				data: mainData,
				cal_rel: totalReliability,
			};

			console.log(localData, "local Data");
			setPhaseData(mainData);

			// Use suffixed task name when storing in local storage
			localStorage.setItem(
				`${currentShip}_${suffixedTaskName}`,
				JSON.stringify(localData)
			);

			gridApi.selectAll();
			const selectedRows = gridApi.getSelectedRows();
			gridApi.applyTransaction({ remove: selectedRows });

			gridCompApi.selectAll();
			const selectedCompRows = gridCompApi.getSelectedRows();
			gridCompApi.applyTransaction({ remove: selectedCompRows });

			allRowData = [];
			setMissionData(allRowData);
			setRecommedation([]);
			settaskTableData([]);
			settaskMissionTableData([]);
			setSnackBarMessage({
				severity: "success",
				message: "Task added for comparison successfully!",
				showSnackBar: true,
			});
		} catch (error) {
			setSnackBarMessage({
				severity: "error",
				message: "Please Select data and Enter Mission Phase Data!!",
				showSnackBar: true,
			});
		}
	};

	console.log("missiondata", missionProfileData);
	const deleteRows = () => {
		debugger;
		const selectedRows = gridApi.getSelectedRows();
		gridApi.applyTransaction({ remove: selectedRows });
		let allRowData = [];
		gridApi.forEachNode((node) => allRowData.push(node.data));
		setMissionData(allRowData);
		// console.log(selectedRows);
	};

	const resetGrids = () => {
		// Reset the main grid
		if (gridApi) {
			gridApi.setRowData([]); // Clear the row data
			gridApi.refreshCells(); // Refresh the grid to clear any cell changes
		}

		// Reset the component grid
		if (gridCompApi) {
			gridCompApi.setRowData([]); // Clear the row data
			gridCompApi.refreshCells(); // Refresh the grid to clear any cell changes
		}

		// You can add similar logic for other grids if needed
	};
	console.log(taskMissionTableData, "taskMissionTableData");
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
				const task_ship_name = data["ship_name"];
				setentireData(data);
				settaskShipNameOption(task_ship_name);
				dispatch(taskActions.onLoad({ taskData: data }));
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const classes = dropDownStyle();

	const onResetMissionHandler = () => {
		resetGrids();
		setShowPaper(false);
		setRecommedation([]);
		let storedData = Object.entries(localStorage);
		storedData.forEach((ele) => {
			let key = ele[0];

			if (key !== "settings" && key !== "login" && key !== "userData") {
				localStorage.removeItem(key);
			}
			setSnackBarMessage({
				severity: "Success",
				message: "Data Cleared",
				showSnackBar: true,
			});

			settaskTableData([]);
			settaskMissionTableData([]);
		});
	};

	const onSubmitHandler = () => {
		let storedData = Object.entries(localStorage);
		console.log("Localy data", storedData);

		let fData = [];
		storedData.forEach((ele) => {
			let name = ele[0];

			// Check if the key has the specified suffix
			if (name.includes("_Netra")) {
				fData.push(JSON.parse(ele[1]));
			}
		});

		console.log(fData);

		if (fData.length > 0) {
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
					let taskData = [];
					let taskMissionData = [];

					d.forEach((tData) => {
						let perMData = tData["data"];

						perMData.forEach((pTD) => {
							taskMissionData.push({
								shipName: tData["shipName"],
								taskName: tData["taskName"],
								rel: parseFloat(pTD["rel"]).toFixed(precision),
								missionType: pTD["missionName"],
								ComponentMission: pTD["missionName"],
							});

							let componentRelData = pTD["comp_rel"];

							componentRelData.forEach((cTD) => {
								taskMissionData.push({
									shipName: tData["shipName"],
									taskName: tData["taskName"],
									rel: parseFloat(cTD["rel"]).toFixed(
										precision
									),
									missionType: pTD["missionName"],
									ComponentMission: cTD["compName"],
								});
							});
						});

						taskData.push({
							shipName: tData["shipName"],
							taskName: tData["taskName"],
							rel: parseFloat(tData["rel"]).toFixed(precision),
							cal_rel: parseFloat(tData["cal_rel"]).toFixed(
								precision
							),
						});
					});

					settaskTableData(taskData);
					settaskMissionTableData(taskMissionData);
				});
		} else {
			setSnackBarMessage({
				severity: "error",
				message: "Please Select data and Enter Mission Phase Data!!",
				showSnackBar: true,
			});
		}

		setShowInputTables(false);
	};

	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systemss",
			showSnackBar: false,
		});
	};
	const updateFinalRowData = (d) => {
		console.log(d);
		setMissionData(d);
	};

	const shipNameChange = (event, value) => {
		debugger;
		let tt = entireData;
		console.log(tt);
		console.log(value);
		if (
			tt &&
			tt["task_ship_name"] &&
			(Array.isArray(value) || typeof value === "object") &&
			(Array.isArray(value)
				? value.length > 0 && value[0]?.name
				: value?.name)
		) {
			const selectedShipName = Array.isArray(value)
				? value[0].name
				: value.name;
			console.log("Selected Ship Name:", selectedShipName);

			if (tt["task_ship_name"].hasOwnProperty(selectedShipName)) {
				const sNames = tt["task_ship_name"][selectedShipName];
				const fNames = sNames.map((s) => ({ name: s }));
				settaskOption(fNames);

				dispatch(
					taskActions.updateCurrentShip({ ship: selectedShipName })
				);
			} else {
				console.log(
					`No task_ship_name data found for ship: ${selectedShipName}`
				);
			}
		} else {
			console.log(
				"Invalid data or value array in shipNameChange function."
			);
		}
	};

	const TaskNameChange = (event, value) => {
		console.log(value);
		if (value && typeof value === "object" && value.name) {
			dispatch(taskActions.updateCurrentTask({ task: value.name }));
		}
	};

	console.log(taskOption);
	return (
		<AccessControl allowedLevels={["L1", "L2", "L3", "L4", "L5"]}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Navigation />
				<div className={styles.body}>
					<div className={styles.mprofile}>
						<div style={{
							display: "flex",
							justifyContent: "flex-start",
							gap: "10rem",
							width: "100%",
							//  background: "red"
						}}>
							<div style={{ width: "250px" }}>
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
								<Autocomplete
									classes={classes}
									id="tags-standard"
									options={taskShipNameOption}
									getOptionLabel={(option) => option.name}
									onChange={shipNameChange}
									renderInput={(params) => (
										<TextField
											{...params}
											InputProps={{
												...params.InputProps,
												disableUnderline: true,
											}}
											variant="standard"
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
									<Typography variant="h5">Task Name</Typography>
								</InputLabel>
								<Autocomplete
									classes={classes}
									id="tags-standard"
									options={taskOption}
									getOptionLabel={(option) => option.name}
									onChange={TaskNameChange}
									renderInput={(params) => (
										<TextField
											{...params}
											InputProps={{
												...params.InputProps,
												disableUnderline: true,
											}}
											variant="standard"
										/>
									)}
								/>
							</div>
						</div>
						<Button
							variant="contained"
							color="primary"
							style={{
								marginTop: "2rem",
							}}
							onClick={onResetMissionHandler}
						>
							Reset Screen
						</Button>
					</div>
					{!showInputTables && (
						<Button
							variant="contained"
							color="secondary"
							className={classes.closeButton}
							onClick={() => setShowInputTables(true)}
						>
							X
						</Button>
					)}
					<div className={classes.uiContainer}>
						{showInputTables && (
							<>
								<div className={styles.table}>
									<Table
										columnDefs={ImportColumns}
										setGrid={setGridApi}
										gridApi={gridApi}
										rowData={rowState}
										tableUpdate={updateFinalRowData}
										tableSize={250}
									/>
								</div>

								<div className={styles.tableFooter}>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										color="secondary"
										onClick={() => AddRow()}
									>
										Add Row
									</Button>
									<Button
										variant="contained"
										startIcon={<DeleteIcon />}
										color="secondary"
										onClick={() => deleteRows()}
									>
										Delete Rows
									</Button>
									<Button
										variant="contained"
										color="secondary"
										onClick={() => updateCompTable()}
									>
										Recommend Solution
									</Button>
								</div>

								<div>
									{isLoading ? (
										<CircularProgress size={24} style={{
											width: "100%",
											display: "flex",
											justifyContent: "center"
										}} />
									) : showPaper ? (
										<PaperTable
											response={recommedation}
											rel={totalReliability}
										/>
									) : null}
								</div>

								<div className={styles.table}>
									<Table
										columnDefs={compColumns}
										setGrid={setGridCompApi}
										gridApi={gridCompApi}
										rowData={rowCompState}
										tableUpdate={updateFinalRowData}
										tableSize={250}
									/>
								</div>

								<div className={styles.tableFooter}>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										color="secondary"
										onClick={() => saveTaskReset()}
									>
										Add this Task for Comparison
									</Button>

									<Button
										variant="contained"
										color="secondary"
										onClick={onSubmitHandler}
									>
										Calculate Reliability
									</Button>
								</div>
							</>
						)}

						{!showInputTables && (
							<div className={styles.table}>
								{taskTableData.length > 0 && (
									<Table
										columnDefs={taskTableColumns}
										setGrid={setGriTaskdApi}
										gridApi={gridTaskApi}
										rowData={taskTableData}
										tableUpdate={() => { }}
										tableSize={250}
									/>
								)}
							</div>
						)}

						{!showInputTables && (
							<div className={styles.table}>
								{taskTableData.length > 0 && (
									<CollapsibleTable
										tableData={taskMissionTableData}
									/>
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
				</div>
			</MuiPickersUtilsProvider>
		</AccessControl>
	);
};
export default TaskDashboard;
