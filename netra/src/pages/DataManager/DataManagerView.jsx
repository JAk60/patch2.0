import { AppBar, Button, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import Navigation from "../../components/navigation/Navigation";
import { treeDataActions } from "../../store/TreeDataStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./DataManager.module.css";
import MonthlyUtilization from "./monthlyUtilization/MonthlyUtilization";
import ParameterEstimation from "./parameterEstimation/parameterEstimation";

const useStyles = makeStyles((theme) => ({
	transparentTab: {
		backgroundColor: "#1976d4",
		color: theme.palette.text.white,
		flexGrow: 1,
		maxWidth: "none",
		width: "50%",
	},
	coloredTab: {
		backgroundColor: "#1976d2",
		color: theme.palette.common.white,
		flexGrow: 1,
		maxWidth: "none",
		width: "50%",
	},
	singleTab: {
		backgroundColor: "#1976d2",
		color: theme.palette.common.white,
		flexGrow: 1,
		maxWidth: "none",
		width: "100%",
	},
	content: {
		paddingTop: theme.spacing(4),
		gridRow: "2",
		gridColumn: "2 / span 13",
	},
	tabsContainer: {
		width: "100%",
	},
}));

export default function DataManagerView(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const userLevel = JSON.parse(localStorage.getItem("userData"));

	const [selectedTab, setSelectedTab] = useState(() => {
		return userLevel.level === "L0" ? 0 : 0;
	});

	const [tableRows, setTableRows] = useState([]);
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

	const sData = useSelector((state) => state.userSelection.componentsData);
	const currentNomenclature = currentSelection["nomenclature"];
	const matchingItems = sData.filter(
		(item) => item.nomenclature === currentNomenclature && item.ship_name === currentSelection["shipName"]
	);
	const matchingId = matchingItems[0]?.id;

	const handleChange = (event, newValue) => {
		if (userLevel.level === "L0" || newValue === 0) {
			setSelectedTab(newValue);
			console.log("Tab changed to:", newValue);
		}
	};

	const handleTableUpdatedRows = (allRows, dataType) => {
		setTableRows(allRows);
	};

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
		const data = {
			data: d,
			dataType: "insertOpData",
		};
		console.log("data", data);

		fetch("/save_historical_data", {
			method: "POST",
			body: JSON.stringify({ data }),
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
			message: "Please Add Systems",
			showSnackBar: false,
		});
	};

	const renderContent = () => {
		if (userLevel.level === "L0") {
			return selectedTab === 0 ? (
				<MonthlyUtilization tableUpdate={handleTableUpdatedRows} />
			) : (
				<ParameterEstimation
					list={systemConfigurationTreeData.filter(
						(x) => x.lmu === 1 || x.parent_id == null
					)}
					rope={true}
				/>
			);
		} else {
			return (
				<ParameterEstimation
					list={systemConfigurationTreeData.filter(
						(x) => x.lmu === 1 || x.parent_id == null
					)}
					rope={true}
				/>
			);
		}
	};

	return (
		<>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<Navigation />
				<AppBar
					style={{
						zIndex: "10",
						marginLeft: "20px",
						width: "calc(100% - 20px)", // Adjusted width to account for margin
					}}
				>
					{userLevel.level === "L0" ? (
						<>
							<Tabs
								value={selectedTab}
								onChange={handleChange}
								variant="fullWidth"
								className={classes.tabsContainer}
								indicatorColor="primary"
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
						</>
					) : (
						<Tabs
							value={selectedTab}
							onChange={handleChange}
							variant="fullWidth"
							className={classes.tabsContainer}
							indicatorColor="primary"
						>
							<Tab
								label="Parameter Estimation"
								className={classes.singleTab}
							/>
						</Tabs>
					)}
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
				{renderContent()}
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
