import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import classes from "./EqptStructuring.module.css";
import LabelToolTip from "./LabelToolTip/LabelToolTip";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridColumn } from "ag-grid-react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { userActions } from "../../../store/ApplicationVariable";
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from "../../../ui/Form/AutoSelect";
import CustomTextInput from "../../../ui/Form/CustomTextInput";
import Table from "../../../ui/Table/Table";
import TreeComponent from "../../sortableTree/SortableTree";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";

const useStyles = makeStyles({
	root: {
		margin: "0 2.5em",
	},
	tabView: {},
});

function EqptStructuring(props) {
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});
	const [tab, setTab] = useState(0);
	const dispatch = useDispatch();
	let fData = useSelector((state) => state.treeData.treeData);
	const selectedInputs = useSelector(
		(state) => state.userSelection.currentSelection
	);
	const [disableButton, setDisableButton] = useState(false);
	const classesButton = useStyles();
	const [childInputFields, setChildInputFields] = useState([]);
	const [parentFiledValue, setParentFieldValue] = useState({
		title: "",
		name: "",
		children: [],
		id: "",
		eqType: "",
		parentName: "",
		parentId: "",
		lmu: 1,
	});

	const [rowDataTable, setRowDataTable] = useState([]);

	const DCcolumnDefs = [
		<AgGridColumn
			field="name"
			headerName="Component Name"
			width={500}
			editable={true}
		/>,
		<AgGridColumn
			field="nomenclature"
			headerName="Nomenclature"
			type="number"
			width={500}
			editable={true}
		/>,
		<AgGridColumn
			field="eqType"
			headerName="CMMS ID"
			type="number"
			width={500}
			editable={true}
		/>,
	];
	const updateFinalRowData = (allRows) => {
		props.tableUpdate(allRows);
	};

	const fileInputRef = useRef(null);

	const clearForm = (e) => {
		console.log("---------------->>", e.target.value);
		e.preventDefault();
		setDisableButton(false);
		dispatch(treeDataActions.setTreeData({ treeData: [] }));
		formik.resetForm();
	};
	const formik = useFormik({
		initialValues: {
			platform: "",
			platformType: "",
			system: "",
			systemType: "",
			nomenclature: "",
		},
		//validationSchema: validationSchema,
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			const { system, systemType, nomenclature } = values;
			console.log(values);
			console.log(selectedInputs);
			const platformValuesEmpty =
				selectedInputs.shipName === "" &&
				selectedInputs.department === "";

			const selectedInputsValuesEmpty =
				system === "" && systemType === "" && nomenclature === "";

			if (platformValuesEmpty && selectedInputsValuesEmpty) {
				return setSnackBarMessage({
					severity: "error",
					message: "Please fill in all the required details",
					showSnackBar: true,
				});
			}
			const systemId = uuid();
			const treeNodes = [
				{
					name: system,
					nomenclature: nomenclature,
					id: systemId,
					eqType: systemType,
					parentName: selectedInputs["shipName"],
					parentId: null,
					parent: null,
					children: [],
					lmu: 1,
					command: selectedInputs["command"],
					department: selectedInputs["department"],
					shipCategory: selectedInputs["shipCategory"],
					shipClass: selectedInputs["shipClass"],
					shipName: selectedInputs["shipName"],
				},
			];
			const updateEqStore = {
				equipmentName: system,
				equipmentCode: systemType,
			};
			const filteredData = {
				equipmentName: [system],
				equipmentCode: [systemType],
			};
			dispatch(treeDataActions.addElement({ data: treeNodes }));
			dispatch(
				userActions.onAddingEquipmentName({
					selectedData: updateEqStore,
					filteredData: filteredData,
				})
			);
			setDisableButton(true);
		},
	});

	const saveData = () => {
		fetch("/api/upload_oem_data", {
			method: "POST",
			body: JSON.stringify({
				data: rowDataTable,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => console.log(res));
	};

	const handleFileUpload = (file) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const csvData = event.target.result;
				const rows = csvData.split("\n");
				const parsedData = [];

				for (let i = 1; i < rows.length; i++) {
					const rowObject = {
						name: "",
						id: "",
						eqType: "",
						parentName: selectedInputs["shipName"],
						parentId: null,
						parent: null,
						children: [],
						lmu: 1,
						command: selectedInputs["command"],
						department: selectedInputs["department"],
						shipCategory: selectedInputs["shipCategory"],
						shipClass: selectedInputs["shipClass"],
						shipName: selectedInputs["shipName"],
						nomenclature: "",
						failure_modes: [],
						failure_mode_ids: [],
					};
					const rowData = rows[i].split(",");
					rowObject.id = rowData[0];
					rowObject.name = rowData[1];
					rowObject.failure_modes = rowData[6];
					rowObject.failure_mode_ids = rowData[7];
					rowObject.eqType = "";
					parsedData.push(rowObject);
					if (rowObject.name !== undefined) {
						setRowDataTable([...rowDataTable, rowObject]);
					}
				}
			};

			reader.readAsText(file);
		}
	};

	const onAddNewChildField = () => {
		setChildInputFields((prevstate) => {
			// const stateLen = prevstate.length;
			// // return [...prevstate, stateLen + 1];
			return [
				...prevstate,
				{ childName: "", childPartId: "", nomenclature: "" },
			];
		});
	};
	const onDeleteChildField = (index) => {
		const childCopy = [...childInputFields];
		childCopy.splice(index, 1);
		setChildInputFields(childCopy);
	};
	const parentOnChange = (e, value) => {
		;
		setParentFieldValue(value);
	};
	const updateChildTree = (e) => {
		e.preventDefault();
		//Make tree object
		const treeNodes = childInputFields.map((x) => {
			const cUuid = uuid();
			return {
				name: x.childName,
				children: [],
				id: cUuid,
				eqType: x.childPartId,
				nomenclature: x.nomenclature,
				parentName: parentFiledValue.name,
				parentId: parentFiledValue.id,
				parent: parentFiledValue.id,
				lmu: 1,
				command: selectedInputs["command"],
				department: selectedInputs["department"],
				shipCategory: selectedInputs["shipCategory"],
				shipClass: selectedInputs["shipClass"],
				shipName: selectedInputs["shipName"],
			};
		});
		dispatch(
			treeDataActions.addChildElement({
				children: treeNodes,
				parentId: parentFiledValue.id,
			})
		);
		setParentFieldValue({
			title: "",
			name: "",
			children: [],
			id: "",
			eqType: "",
			parentName: "",
			parentId: "",
			lmu: 1,
		});
		// Autocomplete zero
		setChildInputFields([]);
	};

	function deepCopy(obj) {
		if (typeof obj !== "object" || obj === null) {
			return obj; // Return non-objects as-is
		}

		if (Array.isArray(obj)) {
			return obj.map(deepCopy); // Recursively copy array elements
		}

		const copy = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				copy[key] = deepCopy(obj[key]); // Recursively copy object properties
			}
		}

		return copy;
	}

	const addNewRow = () => {
		const newRow = deepCopy(rowDataTable[0]);
		setRowDataTable([...rowDataTable, newRow]);
	};
	const handleChildChange = (index, e) => {
		let newArr = [...childInputFields];
		newArr[index][e.target.name] = e.target.value;
		setChildInputFields(newArr);
	};

	const handleChange = (event, newValue) => {
		setTab(newValue);
	};

	const TabViewRendrer = () => {
		switch (tab) {
			case 0:
				return (
					<>
						<form
							style={{ width: "100%" }}
							onSubmit={formik.handleSubmit}
						>
							<div className={classes.formrow1}>
								<div className={classes.field1}>
									<LabelToolTip
										label="Equipment Name"
										info="Official name given to Equipment"
									/>
									<CustomTextInput
										className={classes.fullWidth}
										id="system"
										name="system"
										value={formik.values.system}
										onChange={formik.handleChange}
										disabled={disableButton}
									></CustomTextInput>
								</div>
								<div className={classes.field1}>
									<LabelToolTip
										label="CMMS ID"
										info="EquipmentCode of the equipment in CMMS"
									/>
									<CustomTextInput
										className={classes.fullWidth}
										id="systemType"
										name="systemType"
										value={formik.values.systemType}
										onChange={formik.handleChange}
										disabled={disableButton}
									></CustomTextInput>
								</div>
								<div className={classes.field1}>
									<LabelToolTip
										label="Nomenclature"
										info="Nomenclature for equipment, typically a formal or standardized name."
									/>
									<CustomTextInput
										className={classes.fullWidth}
										id="nomenclature"
										name="nomenclature"
										value={formik.values.nomenclature}
										onChange={formik.handleChange}
										disabled={disableButton}
									></CustomTextInput>
								</div>
							</div>
							<div className={classes.parent}>
								<div
									style={{
										marginTop: "20px",
										marginRight: "2%",
									}}
								>
									<Button
										className={classesButton.root}
										variant="contained"
										color="primary"
										type="reset"
										onClick={clearForm}
									>
										Clear
									</Button>
									{!disableButton && (
										<Button
											variant="contained"
											color="primary"
											type="submit"
										>
											Create
										</Button>
									)}
								</div>
							</div>
						</form>
					</>
				);
			case 1:
				return (
					<>
						<div className={classes.formrow2}>
							{/* //onSubmit={updateChildTree} ref={childForm} */}

							{/* This is the end */}
							<form onSubmit={updateChildTree}>
								<div style={{ width: "400px", margin: "20px" }}>
									<LabelToolTip
										label="Parent Equipment"
										info="The parent equipment whose childrens need to be configured"
									/>
									<AutoSelect
										fields={fData}
										onChange={parentOnChange}
										value={parentFiledValue}
									></AutoSelect>
								</div>
								<div
									className={classes.child}
									style={{ margin: "20px" }}
								>
									<Grid container>
										<Grid container item spacing={4}>
											<Grid item xs={3}>
												<LabelToolTip
													label="Child Component Name"
													info="Name of the child component"
												/>
											</Grid>
											<Grid item xs={3}>
												<LabelToolTip
													label="CMMS ID"
													info="EquipmentCode of the equipment in CMMS"
												/>
											</Grid>
											<Grid item xs={3}>
												<LabelToolTip
													label="Nomenclature"
													info="Nomenclature for child component, typically a formal or standardized name."
												/>
											</Grid>
											<Grid item xs={2}></Grid>
										</Grid>
										{childInputFields.map((child, item) => {
											return (
												<Grid
													container
													item
													key={item}
													spacing={4}
												>
													<Grid
														item
														xs={3}
														style={{
															marginTop: "20px",
														}}
													>
														<CustomTextInput
															className={
																classes.fullWidth
															}
															name="childName"
															// id="childName"
															value={
																child.childName
															}
															onChange={(e) =>
																handleChildChange(
																	item,
																	e
																)
															}
														/>
													</Grid>
													<Grid
														item
														xs={3}
														style={{
															marginTop: "20px",
														}}
													>
														<CustomTextInput
															className={
																classes.fullWidth
															}
															name="childPartId"
															// id="partId"
															value={
																child.childPartId
															}
															onChange={(e) =>
																handleChildChange(
																	item,
																	e
																)
															}
														/>
													</Grid>
													<Grid
														item
														xs={3}
														style={{
															marginTop: "20px",
														}}
													>
														<CustomTextInput
															className={
																classes.fullWidth
															}
															name="nomenclature"
															// id="partId"
															value={
																child.nomenclature
															}
															onChange={(e) =>
																handleChildChange(
																	item,
																	e
																)
															}
														/>
													</Grid>
													<Grid
														item
														xs={2}
														style={{
															display: "flex",
															paddingLeft:
																"-300px",
															alignItems:
																"center",
															justifyContent:
																"center",
															margin: "24px 0",
															padding: 0,
														}}
													>
														<span
															style={{
																display:
																	"inline-block",
																padding: "5px",
																boxShadow:
																	"0 3px 10px rgba(0, 0, 0, 0.2)",
																borderRadius:
																	"50%",
															}}
														>
															<DeleteIcon
																fontSize="medium"
																onClick={() => {
																	onDeleteChildField(
																		item
																	);
																}}
															/>
														</span>
													</Grid>
												</Grid>
											);
										})}
									</Grid>
								</div>
								<div
									style={{
										float: "right",
										marginTop: "30px",
										marginBottom: "30px",
									}}
								>
									<Button
										variant="contained"
										color="primary"
										//onClick={updateChildTree}
										type="submit"
										disabled={
											!(childInputFields.length > 0)
										}
									>
										Create child Component
									</Button>
									<Button
										style={{ marginLeft: "20px" }}
										variant="contained"
										color="primary"
										onClick={onAddNewChildField}
									>
										Add Row
									</Button>
								</div>
							</form>
						</div>
					</>
				);
			case 2:
				return (
					<>
						{rowDataTable.length > 0 ? (
							<>
								<div className={classes.formrow3}>
									<Table
										columnDefs={DCcolumnDefs}
										rowData={rowDataTable}
										tableUpdate={updateFinalRowData}
										height={250}
									/>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "flex-end",
										gap: "15px",
									}}
								>
									<Button
										className={classes.buttons}
										variant="contained"
										color="primary"
										style={{
											marginTop: "50px",
											width: "120px",
										}}
										onClick={addNewRow}
									>
										Add Row
									</Button>
									<Button
										className={classes.buttons}
										variant="contained"
										color="primary"
										style={{
											marginTop: "50px",
											width: "100px",
										}}
										onClick={saveData}
									>
										Create
									</Button>
								</div>
							</>
						) : (
							<div
								style={{
									height: "300px",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								className={classes.importBtnContainer}
							>
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
									style={{ marginTop: "50px" }}
									onClick={() => fileInputRef.current.click()}
								>
									Import File
								</Button>
							</div>
						)}
					</>
				);
			default:
				return "Something is wrong in EquiStructuring module";
		}
	};
	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systems",
			showSnackBar: false,
		});
	};
	return (
		<div className={classes.root}>
			<div className={classes.form}>
				<Tabs
					value={tab}
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
					className={classes.tabView}
				>
					<Tab label="Create Equipment" />
					<Tab label="Add Child Equipments" />
					<Tab label="Import OEM Data" />
				</Tabs>
				{TabViewRendrer()}
			</div>
			<div className={classes.tree}>
				<div className={classes.treeChild}>
					{/* <FullscreenIcon style={{ float: "right", marginRight: "25px" }} /> */}
					<TreeComponent height="400px"></TreeComponent>
					{/* <div></div> */}
				</div>
			</div>
			{SnackBarMessage.showSnackBar && (
				<CustomizedSnackbars
					message={SnackBarMessage}
					onHandleClose={onHandleSnackClose}
				/>
			)}
		</div>
	);
}

export default EqptStructuring;
