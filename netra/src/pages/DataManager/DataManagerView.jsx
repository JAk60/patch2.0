import { AppBar, Button, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import MonthlyUtilization from "./monthlyUtilization/MonthlyUtilization";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./DataManager.module.css";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import ParameterEstimation from "./parameterEstimation/parameterEstimation";
const useStyles = makeStyles((theme) => ({
	transparentTab: {
		backgroundColor: "#1976d4",
		color: theme.palette.text.white,
	},
	coloredTab: {
		backgroundColor: "#1976d2",
		color: theme.palette.common.white,
	},
	content: {
		paddingTop: theme.spacing(4),
		gridRow: "2",
		gridColumn: "2 / span 13",
	},
}));

export default function DataManagerView(props) {
	const [selectedTab, setSelectedTab] = useState(0);
	const [tableRows, setTableRows] = useState([]);
	const classes = useStyles();
	const dispatch = useDispatch();
	const systemConfigurationTreeData = useSelector(
		(state) => state.treeData.treeData
	);
	const currentSelection = useSelector(
		(state) => state.userSelection.currentSelection
	);
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue);
	};
	const handleTableUpdatedRows = (allRows, dataType) => {
		setTableRows(allRows);
	};
	console.log(tableRows);
	const handleSave = () => {
		let d = [];
		d = tableRows.map((x) => {
			return {
				id: x.id,
				oid: uuid(),
				Date: x.Date,
				AverageRunning: x.AverageRunning,
			};
		});
		d = d.filter((x) => x !== undefined);
		const data={
			data: d,
			dataType: "insertOpData",
		}
		// Filter out any undefined data, though it's not needed here as there's only one case
		console.log('data', data)
		// Call the save function
		fetch("/save_historical_data", {
			method: "POST",
			body: JSON.stringify({data}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setSnackBarMessage({
					severity: data.code ? "success" : "error",
					message: data.code
						? "Data Saved Successfully"
						: data.message,
					showSnackBar: true,
				});
			})
			.catch((error) => {
				setSnackBarMessage({
					severity: "error",
					message: "Some Error Occurred. " + error,
					showSnackBar: true,
				});
			});
	};

	const sData = useSelector((state) => state.userSelection.componentsData);

	const currentNomenclature = currentSelection["nomenclature"];
	const matchingItems = sData.filter(
		(item) => item.nomenclature === currentNomenclature
	);

	const matchingId = matchingItems[0]?.id;
	const handleOnLoadSystem = () => {
		const payload = {
			nomenclature: currentSelection["nomenclature"],
			ship_name: currentSelection["shipName"],
		};

		if (matchingId) {
			payload.component_id = matchingId;
		}
		console.log(payload);
		fetch("/fetch_system", {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((d) => {
				dispatch(treeDataActions.setTreeData({ treeData: d.treeD }));
			});
		setSnackBarMessage({
			severity: "success",
			message: "Loaded Equipment Successfully",
			showSnackBar: true,
		});
	};

	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systemss",
			showSnackBar: false,
		});
	};
	return (
		<>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<Navigation />
				<AppBar
					style={{
						zIndex: "10",
						marginLeft: "20px",
					}}
				>
					<Tabs
						value={selectedTab}
						onChange={handleChange}
						variant="fullWidth"
					>
						<Tab
							label="Monthly Utilization"
							className={
								selectedTab === 0
									? classes.coloredTab
									: classes.transparentTab
							}
						/>
						<Tab
							label="Parameter Estimation"
							className={
								selectedTab === 1
									? classes.coloredTab
									: classes.transparentTab
							}
						/>
					</Tabs>
				</AppBar>
			</div>
			<div className={classes.content}>
				<div className={styles.flex}>
					<UserSelection />
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							gap: "10px",
							height: "40px",
							minWidth: "150",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={handleOnLoadSystem}
						>
							Load Equipment
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSave}
						>
							Save
						</Button>
					</div>
				</div>
				{selectedTab === 0 && (
					<div>
						<MonthlyUtilization
							tableUpdate={handleTableUpdatedRows}
						/>
					</div>
				)}
				{selectedTab === 1 && (
					<ParameterEstimation
						list={systemConfigurationTreeData.filter(
							(x) => x.lmu === 1 || x.parent_id == null
						)}
						rope={true}
					/>
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
}
