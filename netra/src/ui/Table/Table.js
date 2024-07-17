import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getDatePicker } from "./DataManagerTable";
import "./Table.css";
const Table = ({
	tableUpdate,
	rowData,
	columnDefs,
	height = 250,
	getRowStyle,
}) => {
	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);
	const location = useLocation();
	const onGridReady = (params) => {
		setGridApi(params.api);
		// props.setGrid(params.api);
		setGridColumnApi(params.columnApi);
		params.api.sizeColumnsToFit();
	};

	const onFirstDataRendered = (params) => {
		params.api.sizeColumnsToFit();
		const allRowData = [];
		params.api.forEachNode((node) => allRowData.push(node.data));
		// setGridApi('rowData', rowData);
		debugger;
		tableUpdate(allRowData);
	};
	const onGridSizeChanged = (params) => {
		params.api.sizeColumnsToFit();
	};
	console.log(rowData);
	console.log("Keys of the first dataset:", Object.keys(rowData[0]));
	const saveModifiedRows = (params) => {
		debugger;
		let currentlocation = location.pathname;

		const allRowData = [];
		gridApi.forEachNode((node) => allRowData.push(node.data));
		console.log(allRowData);

		if (
			currentlocation === "/system_con" ||
			currentlocation === "/system_config/redundancy_info" ||
			currentlocation === "/system_config/failure_mode" ||
			currentlocation === "/system_config/additional_info"
		) {
			tableUpdate(allRowData, params.data.id);
		} else {
			tableUpdate(allRowData);
		}
		console.log(allRowData);
		// add API call to save modified rows
	};

	return (
		<div
			className="ag-theme-alpine"
			style={{ height: height, width: "100%" }}
		>
			{/* <Typography variant="h1"> */}
			{location.pathname !== "/system_config" ? (
				<AgGridReact
					defaultColDef={{
						flex: 1,
						resizable: true,
						filter: true,
						sortable: true,
					}}
					rowData={rowData}
					// columnDefs={props.columnDefs}
					onGridReady={onGridReady}
					onFirstDataRendered={onFirstDataRendered}
					onGridSizeChanged={onGridSizeChanged}
					onCellValueChanged={saveModifiedRows}
					tooltipShowDelay="0"
					components={{
						datePicker: getDatePicker(),
					}}
					getRowStyle={getRowStyle}
				>
					{columnDefs}
				</AgGridReact>
			) : (
				<AgGridReact rowData={rowData} columnDefs={columnDefs} />
			)}
			{/* </Typography> */}
		</div>
	);
};

export default Table;
