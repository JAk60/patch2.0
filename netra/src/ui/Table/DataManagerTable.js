import {
	Button,
	makeStyles,
	Slider,
	TextField
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React from "react";
import ReactDom from "react-dom";
import { useLocation } from "react-router-dom";
import "./Table.css";

const useStyles = makeStyles({
	slider: {
		padding: "22px 0px",
	},
	sliderTrack: {
		height: 5,
	},
});

export const getDatePicker = () => {
	// debugger;
	const fillZeros = (a) => {
		return Number(a) < 10 ? "0" + a : a;
	};
	const getFormattedDateOutput = (dateString) => {
		const dateParse = new Date(dateString);
		const dd = dateParse.getDate();
		const mm = dateParse.getMonth() + 1; //January is 0!
		const yyyy = dateParse.getFullYear();
		// console.log(dateString, dateParse);
		return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
	};
	function Datepicker() { }
	Datepicker.prototype.init = function (params) {
		this.textInput = React.createRef();
		const getFormattedDateMaterial = (dateString) => {
			const dateParse = new Date(
				dateString.split("/")[2] +
				"-" +
				dateString.split("/")[1] +
				"-" +
				dateString.split("/")[0]
			);
			const dd = dateParse.getDate();
			const mm = dateParse.getMonth() + 1; //January is 0!
			const yyyy = dateParse.getFullYear();
			console.log(dateString, dateParse);
			return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
		};
		const eInput = React.createElement(TextField, {
			type: "date",
			defaultValue: getFormattedDateMaterial(params.value),
			ref: this.textInput,
			style: { width: "95%" },
		});
		this.div = document.createElement("div");
		this.div.className = "ag-cell-parent-append";
		ReactDom.render(eInput, this.div);
	};
	Datepicker.prototype.getGui = function () {
		return this.div;
	};
	Datepicker.prototype.afterGuiAttached = function () {
		this.textInput.current.focus();
	};
	Datepicker.prototype.getValue = function () {
		return getFormattedDateOutput(
			this.textInput.current.querySelector("input").value
		);
	};
	Datepicker.prototype.destroy = function () { };
	Datepicker.prototype.isPopup = function () {
		return false;
	};
	return Datepicker;
};

const getMonthPicker = () => {
	const fillZeros = (a) => {
		return Number(a) < 10 ? "0" + a : a;
	};
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const getFormattedDateOutput = (dateString) => {
		const dateParse = new Date(dateString);
		const mm = dateParse.getMonth(); //January is 0!
		const yyyy = dateParse.getFullYear();
		// console.log(dateString, dateParse);
		return monthNames[mm] + "/" + yyyy;
	};
	function Monthpicker() { }
	Monthpicker.prototype.init = function (params) {
		this.textInput = React.createRef();
		const getFormattedDateMaterial = (dateString) => {
			const dateParse = new Date(
				dateString.split("/")[2] +
				"-" +
				dateString.split("/")[1] +
				"-" +
				dateString.split("/")[0]
			);
			const dd = dateParse.getDate();
			const mm = dateParse.getMonth() + 1; //January is 0!
			const yyyy = dateParse.getFullYear();
			console.log(dateString, dateParse);
			return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
		};
		const eInput = React.createElement(TextField, {
			type: "month",
			defaultValue: getFormattedDateMaterial(params.value),
			ref: this.textInput,
			style: { width: "95%" },
		});
		this.div = document.createElement("div");
		this.div.className = "ag-cell-parent-append";
		ReactDom.render(eInput, this.div);
	};
	Monthpicker.prototype.getGui = function () {
		return this.div;
	};
	Monthpicker.prototype.afterGuiAttached = function () {
		this.textInput.current.focus();
	};
	Monthpicker.prototype.getValue = function () {
		return getFormattedDateOutput(
			this.textInput.current.querySelector("input").value
		);
	};
	Monthpicker.prototype.destroy = function () { };
	Monthpicker.prototype.isPopup = function () {
		return false;
	};
	return Monthpicker;
};

const DataManagerTable = (props) => {
	console.log("props", props.rowData);
	const location = useLocation();
	const tableHeight = props.tableSize ? props.tableSize : 400;

	const Sliderclasses = useStyles();
	const onGridReady = (params) => {
		props.setGrid(params.api);
		props.setGrid(params.api);

		params.api.sizeColumnsToFit();
	};

	const onFirstDataRendered = (params) => {
		debugger;
		params.api.sizeColumnsToFit();
		try {
			const allRowData = [];
			props.gridApi.forEachNode((node) => allRowData.push(node.data));
			props.tableUpdate(allRowData);
			console.log("hiii", allRowData);

			// Set row data directly to the grid if it's the second AgGridReact component
			if (location.pathname === "/system_con") {
				params.api.setRowData(allRowData);
			}
		} catch (err) {
			console.log(err);
		}
	};
	const onGridSizeChanged = (params) => {
		params.api.sizeColumnsToFit();
	};

	const maintenanceDataCheck = (params) => {
		console.log(params);
		const colId = params.column.getId();

		if (colId === "MaintenanceType") {
			if (params.node.data.MaintenanceType === "Replaced") {
				params.node.setDataValue("ReplaceType", null);
			} else {
				params.node.setDataValue("ReplaceType", "NA");
			}
		}
		if (colId === "ReplaceType") {
			if (params.node.data.ReplaceType === "Cannibalised") {
				params.node.setDataValue("CannibalisedAge", null);
			} else {
				params.node.setDataValue("CannibalisedAge", "NA");
			}
		}
	};

	const saveModifiedRows = (params) => {
		console.log(params);
		maintenanceDataCheck(params);
		let currentlocation = location.pathname;
		try {
			let selectedId = "";
			if (currentlocation === "/maintenance_data") {
				if (params.column.colId === "LMU") {
					selectedId = params.data.id;
					const allRowData = [];
					props.gridApi.forEachNode((node) =>
						allRowData.push(node.data)
					);
					props.tableUpdate(allRowData, selectedId);
				} else {
					const allRowData = [];
					props.gridApi.forEachNode((node) =>
						allRowData.push(node.data)
					);
					console.log(allRowData);
					
					props.tableUpdate(allRowData);
				}
			} else if (currentlocation === "/system_config/failure_mode") {
				let selectedId = "";
				selectedId = params.data.id;
				const allRowData = [];
				props.gridApi.forEachNode((node) => allRowData.push(node.data));
				props.tableUpdate(allRowData, selectedId);
			} else {
				const allRowData = [];
				props.gridApi.forEachNode((node) => allRowData.push(node.data));
				props.tableUpdate(allRowData);
			}
		} catch (err) {
			console.log(err);
		}
		// add API call to save modified rows
	};

	const deleteButton = () => {
		return (
			<div>
				<IconButton>
					<DeleteIcon />
				</IconButton>
			</div>
		);
	};
	const updateButton = (props) => {
		return (
			<div>
				<Button
					variant="contained"
					color="primary"
					onClick={() => props.onClick()}
				>
					{" "}
					Update Password
				</Button>{" "}
			</div>
		);
	};

	const redirectButton = () => {
		return (
			<div>
				<Button
					variant="contained"
					color="primary"
					style={{ marginTop: "20px" }}
				>
					Redirect
				</Button>
			</div>
		);
	};

	const slider = () => {
		const marks = [
			{
				value: 15,
				label: "Configure New System",
			},
			{
				value: 40,
				label: "Phase Definition",
			},
			{
				value: 65,
				label: "Extrinsic Factor Definition ",
			},
			{
				value: 90,
				label: "Data Manager",
			},
		];
		return (
			<div>
				<Slider
					classes={{
						container: Sliderclasses.slider,
						track: Sliderclasses.sliderTrack,
					}}
					style={{ marginTop: "15px" }}
					defaultValue={40}
					marks={marks}
				/>
			</div>
		);
	};
	return (
		<div
			className="ag-theme-alpine"
			style={{ height: tableHeight, width: "94%", margin: "1rem 4%" }}
		>
			{location.pathname !== "/system_config" ? (
				<AgGridReact
					defaultColDef={{
						flex: 1,
						resizable: true,
						filter: true,
						sortable: true,
					}}
					rowData={props.rowData}
					tooltipShowDelay="0"
					onGridReady={onGridReady}
					onFirstDataRendered={onFirstDataRendered}
					onGridSizeChanged={onGridSizeChanged}
					onCellValueChanged={saveModifiedRows}
					rowSelection={"multiple"}
					// rowMultiSelectWithClick={true}
					{...(props.rowHeight ? { rowHeight: props.rowHeight } : {})}
					frameworkComponents={{
						updateButton: updateButton,
						redirectButton: redirectButton,
						slider: slider,
					}}
					components={{
						datePicker: getDatePicker(),
						monthPicker: getMonthPicker(),
						deleteButton: deleteButton(),
					}}
					onCellClicked={props.onCellClicked}
				>
					{props.columnDefs}
				</AgGridReact>
			) : (
				<AgGridReact
					columnDefs={props.columnDefs}
					rowData={props.rowData}
					onFirstDataRendered={onFirstDataRendered}
					onCellValueChanged={saveModifiedRows}
				/>
			)}
		</div>
	);
};

export default DataManagerTable;
