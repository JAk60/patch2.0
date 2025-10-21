import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { treeDataActions } from "../../store/TreeDataStore";
import Navigation from "../../components/navigation/Navigation";
import UserSelection from "../../ui/userSelection/userSelection";
import { Button } from "@material-ui/core";
import styles from "./historicalData.module.css";
import HistoricalData from "./historicalData/historicalData";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

export default function MainHistoryView() {
	const currentSelection = useSelector(
		(state) => state.userSelection.currentSelection
	);
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const [tableRows, setTableRows] = useState([]);
	const [dataType, setDataType] = useState("");
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});
	const systemConfigurationTreeData = useSelector(
		(state) => state.treeData.treeData
	);
	const sData = useSelector((state) => state.userSelection.componentsData);

	const currentNomenclature = currentSelection["nomenclature"];
	const matchingItems = sData.filter(
		(item) =>
			item.nomenclature === currentNomenclature &&
			item.ship_name === currentSelection["shipName"]
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
				console.log("data>>>>>", d);
				const equipment = d.treeD.filter((x) => x.parentId === null)[0];
				if (equipment.repairType === "Replaceable") {
					history.push("/historical_data");
				} else {
					history.push("/historical_data/repairable_overhaul");
				}
				dispatch(treeDataActions.setTreeData({ treeData: d.treeD }));
			});
		setSnackBarMessage({
			severity: "success",
			message: "Loaded Equipment Successfully",
			showSnackBar: true,
		});
	};

	const handleSaveSupport = (data) => {
		fetch("/api/save_historical_data", {
			method: "POST",
			body: JSON.stringify({
				data: data,
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
				console.log(data);
				if (data.code) {
					setSnackBarMessage({
						severity: "success",
						message: "Data Saved Successfully",
						showSnackBar: true,
					});
				} else {
					setSnackBarMessage({
						severity: "error",
						message: data.message,
						showSnackBar: true,
					});
				}
			})
			.catch((error) => {
				setSnackBarMessage({
					severity: "error",
					message: "Some Error Occured. " + error,
					showSnackBar: true,
				});
			});
	};

	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systemss",
			showSnackBar: false,
		});
	};
	const handleSave = () => {
		let data = [];
		if (dataType === "oem") {
			data = tableRows.map((x) => {
				const life_estimate1 = Object.keys(x).sort()[1];
				const life_estimate2 = Object.keys(x).sort()[2];
				return {
					component_id: x.id,
					id: uuid(),
					life_estimate1,
					life_estimate2,
					life_estimate1_val: x[life_estimate1],
					life_estimate2_val: x[life_estimate2],
				};
			});
		} else if (dataType === "fdp") {
			data = tableRows.map((x) => {
				return {
					component_id: x.id,
					id: uuid(),
					installationDate: x.installationDate,
					removalDate: x.removalDate,
					actual_failure: x.AFS,
				};
			});
			//End of FDP
		} else if (dataType === "oemE") {
			data = tableRows.map((x) => {
				const life_estimate1 = Object.keys(x).sort()[1];
				return {
					component_id: x.id,
					id: uuid(),
					life_estimate1,
					maxLife: x.MaxLife,
					minLife: x.MinLife,
					life_estimate1_val: x[life_estimate1],
					mostLikely: x.MostLikely,
					componentFailure: x.componentFailure,
					time_wo_failure: x.time_wo_failure,
				};
			});
		} else if (dataType === "expert") {
			data = tableRows.map((x) => {
				return {
					component_id: x.id,
					id: uuid(),
					maxLife: x.MaxLife,
					minLife: x.MinLife,
					mostLikely: x.MostLikely,
					componentFailure: x.componentFailure,
					time_wo_failure: x.time_wo_failure,
				};
			});
		} else if (dataType === "prob") {
			data = tableRows.map((x) => {
				return {
					component_id: x.id,
					id: uuid(),
					failureProb: x.FailureProbability,
					time: x.Time,
				};
			});
		} else if (dataType === "nprd") {
			data = tableRows.map((x) => {
				return {
					component_id: x.id,
					id: uuid(),
					failureRate: x.FailureRate,
					beta: x.Beta,
				};
			});
		} else if (dataType === "import_replacable") {
			data = tableRows.map((x) => {
				if (x.ScaleParameter !== "" && x.ShapeParameter !== "") {
					return {
						component_id: x.id,
						id: uuid(),
						eta: x.ScaleParameter,
						beta: x.ShapeParameter,
					};
				}
				return null;
			});
			console.log("");
		} else if (dataType === "insertOpData") {
			data = tableRows.map((x) => {
				return {
					id: x.id,
					oid: uuid(),
					Date: x.Date,
					AverageRunning: x.AverageRunning,
				};
			});
		} else if (dataType === "maintData") {
			data = tableRows;
		} else if (dataType === "overhauls") {
			const main_data = tableRows["mainTable"];
			const sub_data = tableRows["subTable"];
			console.log("This is from Overhauls");
			console.log(main_data);
			console.log(sub_data);
			let parent = "";
			let subSystem = [];
			try {
				parent = systemConfigurationTreeData.filter(
					(x) => x.parentId === null
				)[0].id;
				subSystem = systemConfigurationTreeData.filter(
					(x) => x.parentId === null || x.parentId === parent
				);

				const subFinalData = sub_data.map((x) => {
					return {
						id: uuid(),
						overhaulNum: x.overhaulNum,
						runAge: x.runAge,
						numMaint: x.numMaint,
						component_id: parent,
					};
				});

				const mainFinalData = main_data.map((x) => {
					if (x.subSystem) {
						const subSystemId = subSystem.filter(
							(sS) => sS.nomenclature === x.subSystem
						)[0].id;
						return {
							id: uuid(),
							overhaulId: x.overhaulId,
							date: x.Date,
							maintenanceType: x.maintenanceType,
							totalRunAge: x.totalRunAge,
							subSystemId: subSystemId,
						};
					}
					return null;
				});
				data = [{ mainData: mainFinalData, subData: subFinalData }];
			} catch {
				console.log("Error");
			}
		} else if (dataType === "overhaul_age") {
			const main_data = tableRows["mainTable"];
			const sub_data = tableRows["subTable"];
			const subFinalData = sub_data.map((x) => {
				return {
					id: uuid(),
					runAge: x.runAge,
					nomenclature: x.nomenclature,
					ship_name: x.shipName,
					equipment_name: x.equipmentName,
				};
			});
			data = [{ mainData: main_data, subData: subFinalData }];
		} else if (dataType === "interval") {
			data = tableRows.map((x) => {
				return {
					component_id: x.id,
					id: uuid(),
					installationStartDate: x.installationStartDate,
					installationEndDate: x.installationEndDate,
					removalStartDate: x.removalStartDate,
					removalEndDate: x.removalEndDate,
					interval_failure: x.IFS,
				};
			});
		}
		data = data.filter((x) => x !== undefined);
		handleSaveSupport({ data, dataType: dataType });
	};
	const handleTableUpdatedRows = (allRows, dataType) => {
		setTableRows(allRows);
		if (location.pathname === "/historical_data/repairable_overhaul") {
			setDataType(dataType);
		} else if (location.pathname === "/maintenance_data") {
			setDataType(dataType);
		} else {
			setDataType(dataType);
		}
	};
	const handleHistoricalDataDropdownChange = (dataType) => {
		setDataType(dataType);
	};
	return (
		<>
			<Navigation />
			<div className={styles.OverhaulParent}>
				<div className={styles.UserSelection}>
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
							// className={styles.buttons}
							onClick={handleOnLoadSystem}
						>
							Load Equipment
						</Button>
						<Button
							variant="contained"
							color="primary"
							// className={styles.buttons}
							onClick={handleSave}
						>
							Save
						</Button>
					</div>
				</div>
				<div>
					<HistoricalData
						tableUpdate={handleTableUpdatedRows}
						handleDropdown={handleHistoricalDataDropdownChange}
					/>
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
}
