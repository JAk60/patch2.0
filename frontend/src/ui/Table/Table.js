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
	height = 400,
	getRowStyle,
}) => {
	const [gridApi, setGridApi] = useState(null);
	const location = useLocation();
	const onGridReady = (params) => {
		setGridApi(params.api);
		params.api.sizeColumnsToFit();
	};

	const onFirstDataRendered = (params) => {
		params.api.sizeColumnsToFit();
		const allRowData = [];
		params.api.forEachNode((node) => allRowData.push(node.data));
		debugger;
		tableUpdate(allRowData);
	};
	const onGridSizeChanged = (params) => {
		params.api.sizeColumnsToFit();
	};
	console.log(rowData);
	const saveModifiedRows = (params) => {
		debugger;
		let currentlocation = location.pathname;

		const allRowData = [];
		gridApi.forEachNode((node) => allRowData.push(node.data));
		if (
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
			<AgGridReact
				defaultColDef={{
					flex: 1,
					resizable: true,
					filter: true,
					sortable: true,
				}}
				rowData={rowData}
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
		</div>
	);
};

export default Table;
