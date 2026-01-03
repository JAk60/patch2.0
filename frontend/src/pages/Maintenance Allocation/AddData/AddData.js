import MomentUtils from "@date-io/moment";
import { Button, makeStyles } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { AgGridColumn } from "ag-grid-react";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import Navigation from "../../../components/navigation/Navigation";
import TreeComponent from "../../../components/sortableTree/SortableTree";
import { treeDataActions } from "../../../store/TreeDataStore";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import AutoSelect from "../../../ui/Form/AutoSelect";
import Table from "../../../ui/Table/Table";
import UserSelection from "../../../ui/userSelection/userSelection";
import styles from "./AddData.module.css";

const useStyles = makeStyles({
	buttons: {
		margin: 5,
		minWidth: 170,
		float: "right",
	},
	align: {
		marginBottom: 10,
	},
});

const headers = ["date", "parameterName", "value", "operatingHours"];

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

const AddData = (props) => {
	const dispatch = useDispatch();
	const fileInputRef = useRef(null);
const handleFileUpload = (file) => {
    if (file) {
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            console.log("Raw CSV Data:", csvData);
            
            const rows = csvData.split("\n");
            console.log("Total rows:", rows.length);

            // Get headers from CSV
            const headers = rows[0]
                .split(",")
                .map((header) => header.trim());
            console.log("CSV Headers:", headers);
            
            const parsedData = [];
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) {
                    console.log(`Row ${i} is empty, skipping`);
                    continue;
                }
                
                // Use regex to properly split CSV, handling quoted values
                const rowData = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
                    .map(val => val.trim().replace(/^"|"$/g, ''));
                
                console.log(`Row ${i} data:`, rowData);
                
                const rowObject = {
                    id: uuid(),
                    componentId: selectedComponent.id,
                    date: "",
                    parameterName: "",
                    paramId: "",
                    value: "",
                    operatingHours: "",
                };
                
                // Map CSV columns to rowObject based on header names
                headers.forEach((header, index) => {
                    const value = rowData[index] || "";
                    console.log(`Header: ${header}, Index: ${index}, Value: ${value}`);
                    
                    if (header === "parameterName") {
                        rowObject["parameterName"] = value;
                        // Find matching parameter ID
                        let parameter = paramData.find(
                            (d) => d.name === value
                        );
                        rowObject["paramId"] = parameter?.id || "";
                    } else if (header === "value") {
                        rowObject["value"] = value;
                    } else if (header === "date") {
                        rowObject["date"] = value;
                    } else if (header === "operatingHours") {
                        // Store as plain number, not formatted time
                        rowObject["operatingHours"] = value;
                    }
                });
                
                console.log("Created rowObject:", rowObject);
                parsedData.push(rowObject);
            }
            
            console.log("Final Parsed Data:", parsedData);
            setDataRows(parsedData);
            setLoading(false);
        };

        reader.readAsText(file);
    }
};

	const currentSelection = useSelector(
		(state) => state.userSelection.currentSelection
	);
	let fData = useSelector((state) => state.treeData.treeData);

	const sData = useSelector((state) => state.userSelection.componentsData);

	const currentNomenclature = currentSelection["nomenclature"];
	const matchingItems = sData.filter(
		(item) => item.nomenclature === currentNomenclature && item.ship_name === currentSelection["shipName"]
	);

	const matchingId = matchingItems[0]?.id;
	const onLoadTreeStructure = () => {
		const payload = {
			nomenclature: currentSelection["nomenclature"],
			ship_name: currentSelection["shipName"],
		};

		if (matchingId) {
			payload.component_id = matchingId;
		}
		console.log(payload);
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
				console.log(d);
				let treeD = d["treeD"];
				let failureModes = d["failureMode"];
				console.log(failureModes);
				dispatch(
					treeDataActions.setTreeData({
						treeData: treeD,
					})
				);
				dispatch(treeDataActions.setFailureModes(failureModes));
			});
	};

	const [isloading, setLoading] = useState(false);
	const [dataRows, setDataRows] = useState([]);
	const [selectedComponent, setComponent] = useState(null);
	const [paramData, setParamData] = useState([]);

	const selectOnChange = (e, value) => {
		setDataRows([]);
		if (value) {
			setLoading(true);
			fetch("/api/fetch_params", {
				method: "POST",
				body: JSON.stringify({
					ComponentId: value.id,
				}),
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then((res) => res.json())
				.then((d) => {
					setParamData(d);
				});
			setComponent(value);
			setLoading(false);
		}
	};

	const saveParamData = () => {
		fetch("/api/save_condition_monitoring", {
			method: "POST",
			body: JSON.stringify({
				flatData: dataRows,
				dtype: "insertParamData",
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.code) {
					setSnackBarMessage({
						severity: "success",
						message: data.message,
						showSnackBar: true,
					});
				} else {
					setSnackBarMessage({
						severity: "error",
						message: data.message,
						showSnackBar: true,
					});
				}
			});
	};

	const DataColumnDefs = [
	<AgGridColumn
		field="date"
		headerName="DateTime"
		headerTooltip="DateTime"
		editable={true}
		cellEditorFramework={(params) => (
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<DateTimePicker
					value={moment(
						params.value,
						"DD/MM/YYYY, HH:mm:ss"
					).toDate()}
					onChange={(date) => {
						const formattedDate = moment(date).format(
							"DD/MM/YYYY, HH:mm:ss"
						);
						const newValue = {
							...params.data,
							date: formattedDate,
						};
						const updatedDataRows = dataRows.map((row) => {
							if (row.id === newValue.id) {
								return newValue;
							}
							return row;
						});
						setDataRows(updatedDataRows);
					}}
					format="DD/MM/YYYY, HH:mm:ss"
				/>
			</MuiPickersUtilsProvider>
		)}
	/>,
	<AgGridColumn
		field="parameterName"
		headerName="Channel/Parameter Name"
		headerTooltip="Channel/Parameter Name"
		cellEditor="agSelectCellEditor"
		cellEditorParams={{
			values: paramData.map((data) => data.name),
		}}
		editable={true}
		onCellValueChanged={(params) => {
			let parameter = paramData.filter(
				(d) => d.name === params.data.parameterName
			);
			params.data.paramId = parameter[0]?.id;
		}}
	/>,
	<AgGridColumn
		field="value"
		headerName="Value"
		headerTooltip="Value"
		editable={true}
	/>,
<AgGridColumn
	headerName="Operating Hours"
	field="operatingHours"
	headerTooltip="Operating Hours"
	editable={true}
	valueFormatter={(params) => params.value}
	cellClass="ag-right-aligned-cell"
/>,
];

	const addRow = () => {
		let newRow = {
			componentId: selectedComponent.id,
			id: uuid(),
			date: "",
			parameterName: "",
			paramId: "",
			value: "",
			operatingHours: "",
		};
		setDataRows([...dataRows, newRow]);
	};

	const onDrop = useCallback((acceptedFiles) => {
		const formData = new FormData();
		formData.append("File", acceptedFiles[0]);
		fetch("/api/add_data", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log("Success:", result);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

	const classes = useStyles();
	console.log(dataRows, "flag");

	return (
		<>
			<Navigation />
			<div className={styles.userSelection}>
				<UserSelection />
				<div>
					<Button
						className={classes.buttons}
						onClick={onLoadTreeStructure}
						variant="contained"
						color="primary"
					>
						Submit
					</Button>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.tree}>
					<div className={styles.treeChild}>
						<TreeComponent ></TreeComponent>
					</div>
				</div>
				<div className={styles.rightSection}>
					<div className={styles.selectContainer}>
						<div className={styles.selectC}>
							Select Equipment
							<AutoSelect
								fields={fData}
								onChange={selectOnChange}
								value={selectedComponent}
							></AutoSelect>
						</div>
						<div className={styles.importBtnContainer}>
							<input
								type="file"
								accept=".csv"
								onChange={(e) =>
									handleFileUpload(e.target.files[0])
								}
								style={{ display: "none" }}
								ref={fileInputRef}
							/>
							<Button
								className={classes.buttons}
								variant="contained"
								color="primary"
								onClick={() => fileInputRef.current.click()}
							>
								Import File
							</Button>
							<div {...getRootProps()}>
								<input {...getInputProps()} />
							</div>
						</div>
						<div className={styles.importBtnContainer}>
							<Button
								variant="contained"
								color="primary"
								onClick={downloadBlankCSV}
							>
								Download Blank CSV
							</Button>
						</div>
					</div>

					{isloading ? (
						<Loader
							type="Puff"
							color="#86a0ff"
							height={300}
							width={300}
							style={{ marginTop: 100 }}
						/>
					) : (
						<div className={styles.table}>
							<Table
								columnDefs={DataColumnDefs}
								rowData={dataRows}
								tableUpdate={(rows) => {
									console.log(rows);
								}}
								height={300}
							/>
							<Button
								variant="contained"
								color="primary"
								onClick={addRow}
							>
								+ Add Row
							</Button>
							<Button
								className={classes.buttons}
								onClick={saveParamData}
								variant="contained"
								color="primary"
							>
								Save
							</Button>
						</div>
					)}
				</div>
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

export default AddData;
