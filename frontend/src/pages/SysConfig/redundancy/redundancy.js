import { Button } from "@material-ui/core";
import { AgGridColumn } from "ag-grid-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import Table from "../../../ui/Table/Table";
import RenderParallelComponent from "./RenderParallelComponent";

const RedundancyInfo = (props) => {
	const [gridApi, setGridApi] = useState(null);
	// let ParallelIds = [];
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});

	const setParallelIds = (d) => {
		// ParallelIds = d;
	};

	const systemData = useSelector((state) => state.treeData.treeData);

	const currentSelectedSystem = useSelector(
		(state) => state.userSelection.currentSelection.equipmentName
	);

	const onCellClicked = (params) => {
		console.log("Row clicked:", params.data);
	};

	const RIDemo = [
		<AgGridColumn field="eqId" hide={true} />,
		<AgGridColumn
			field="EquipmentName"
			headerName="Equipment"
			headerTooltip="Equipment"
			width="220"
			onCellClicked={onCellClicked}
		/>,
		<AgGridColumn
			field="EquipmentParentName"
			headerName="Parent Name"
			headerTooltip="Parent Name"
			width={300}
			onCellClicked={onCellClicked}
		/>,
		<AgGridColumn
			field="ParallelComponent"
			headerName="Parallel Component"
			headerTooltip="Parallel Component"
			cellEditorFramework={RenderParallelComponent}
			cellEditorParams={{
				setParallelIds: setParallelIds,
				label: "Select Parallel Equipments!",
				isMultiple: true,
			}}
			width="220"
			editable={true}
			onCellClicked={onCellClicked}
		/>,
		<AgGridColumn
			field="RedundancyType"
			headerName="Redundancy Type"
			headerTooltip="Redundancy Type"
			cellEditor="agSelectCellEditor"
			cellEditorParams={{
				values: ["Active Redundancy", "Inactive Redundancy"],
			}}
			width="220"
			editable={true}
			onCellClicked={onCellClicked}
		/>,
		<AgGridColumn
			field="K"
			headerName="K"
			headerTooltip="K"
			type="numericColumn"
			valueParser={(params) => Number(params.newValue)}
			valueFormatter={(params) =>
				params.value !== null ? params.value : ""
			}
			width={100}
			editable={true}
			onCellClicked={onCellClicked}
		/>,
	];

	const initialData = systemData
		.filter((element) => element.parentId !== null)
		.map((element) => {
			return {
				eqId: element.id,
				EquipmentName: element.nomenclature,
				componentId: element.id,
				systemName: currentSelectedSystem,
				id: uuid(),
				EquipmentParentName: element.parentName,
				ParallelComponent: "",
				RedundancyType: "Active Redundancy",
				K: 1, // Ensure this is a number
				parallelComponentIds: [],
				N: 0,
			};
		});

	const [tableData, setTableData] = useState(initialData);

	const updateTableData = (newData) => {
		const updatedData = newData.map((row) => ({
			...row,
			K: Number(row.K), // Ensure K is always a number
		}));
		console.log("Updating table data:", updatedData);
		setTableData(updatedData);
	};

	const SaveParallelInfo = () => {
		console.log("Saving parallel information:", tableData);
		fetch("/api/save_system", {
			method: "POST",
			body: JSON.stringify({
				flatData: tableData,
				dtype: 'insertRedundancy',
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
					message: "Error Occured in System Configuration, Please Try again" + error,
					showSnackBar: true,
				});
			});
	};
	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systems",
			showSnackBar: false,
		});
	};
	return (
		<div>
			<Table
				columnDefs={RIDemo}
				rowData={tableData}
				tableUpdate={updateTableData}
				setGrid={setGridApi}
				gridApi={gridApi}
			/>
			<Button
				style={{ background: "#1c1c4f", color: "white" }}
				variant="contained"
				onClick={SaveParallelInfo}
			>
				Save Parallel Information
			</Button>
			{SnackBarMessage.showSnackBar && (
				<CustomizedSnackbars
					message={SnackBarMessage}
					onHandleClose={onHandleSnackClose}
				/>
			)}
		</div>
	);
};

export default RedundancyInfo;
