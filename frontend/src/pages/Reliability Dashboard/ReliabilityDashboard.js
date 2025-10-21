import MomentUtils from "@date-io/moment";
import {
	Button,
	InputLabel,
	TextField,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import { SelectWithLimit } from "../../ui/Form/SelectWithLimit";
import AccessControl from "../Home/AccessControl";
import ReliabilityChart from "./ReliabilityChart";
import styles from "./rDashboard.module.css";

const ReliabilityDashboard = () => {
	const [eqDataOption, setEqDataOption] = useState([]);
	const [nomenclatureDataOption, setNomenclatureDataOption] = useState([]);
	const [selectedEqName, setEquipmentName] = useState(null);
	const [nomenclature, setNomenclature] = useState(null);
	const [selectedShipName, setShipName] = useState([]);
	const [selectedMissionName, setMissionName] = useState([]);
	const [graphData, setGraphData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});

	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systems",
			showSnackBar: false,
		});
	};

	const [userSelectionData, setUserSelectionData] = useState([]);
	const dispatch = useDispatch();
	const customSelectData = useSelector(
		(state) => state.userSelection.userSelection
	);

	useEffect(() => {
		fetch("/api/rel_dashboard", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const user_selection = data["user_selection"]["data"];
				const eqData = data["user_selection"]["eqData"];
				let shipName = user_selection.map((x) => x.shipName);
				shipName = [...new Set(shipName)];
				setUserSelectionData(eqData);
				dispatch(
					userActions.onChangeLoad({
						filteredData: { shipName: shipName },
					})
				);
			});
	}, [dispatch]);

	const getSelectedValues = (d, selectType) => {
		if (selectType === "equipmentName") {
			const uniqueNomenData = new Set();
			d.forEach((element) => {
				const filteredItems = userSelectionData
					.filter(
						(x) =>
							x.equipmentName === element.equipmentName &&
							x.shipName === element.parent
					)
					.map((x) => ({
						equipmentName: x.equipmentName,
						parent: element.parent,
						nomenclature: x.nomenclature,
					}));
				filteredItems.forEach((item) => {
					uniqueNomenData.add(JSON.stringify(item));
				});
			});
			const uniqueNomsArray = Array.from(uniqueNomenData).map((item) =>
				JSON.parse(item)
			);
			setNomenclatureDataOption(uniqueNomsArray);
			setEquipmentName(d);
		} else if (selectType === "shipName") {
			const uniqueEqData = new Set();
			d.forEach((element) => {
				const filteredItems = userSelectionData
					.filter((x) => x.shipName === element)
					.map((x) => ({
						equipmentName: x.equipmentName,
						parent: element,
						nomenclature: x.nomenclature,
					}));
				filteredItems.forEach((item) => {
					uniqueEqData.add(JSON.stringify(item));
				});
			});
			const uniqueNamesArray = Array.from(uniqueEqData).map((item) =>
				JSON.parse(item)
			);
			setEqDataOption(
				Array.from(
					new Set(
						uniqueNamesArray.map((item) =>
							JSON.stringify({
								equipmentName: item.equipmentName,
								parent: item.parent,
							})
						)
					)
				).map((item) => JSON.parse(item))
			);
			setShipName(d);
		} else if (selectType === "nomenclature") {
			setNomenclature(d);
		}
	};

	const handleChange = (event) => {
		setMissionName(event.target.value);
	};

	const onSubmitHandler = () => {
		setGraphData([]);
		setIsLoading(true);

		const data = {
			missions: [selectedMissionName],
			equipments: selectedEqName,
			nomenclature: nomenclature,
			shipClass: selectedShipName,
			tempMissions: [],
		};

		fetch("/api/rel_estimate_EQ", {
			method: "POST",
			body: JSON.stringify({ data: data }),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.code) {
					const d = res.results;
					const reliabilityDataArray = [];

					d.forEach((missionData) => {
						Object.keys(missionData["Temp Mission"]).forEach((ship) => {
							const shipData = missionData["Temp Mission"][ship];
							shipData.forEach((data) => {
								Object.keys(data).forEach((name) => {
									const equipment = data[name].equipment;
									const relValue = data[name].rel;

									reliabilityDataArray.push({
										ship,
										equipment,
										name,
										reliability: 100 * relValue,
									});
								});
							});
						});
					});

					setGraphData(reliabilityDataArray);
					setSnackBarMessage({
						severity: "success",
						message: res.message,
						showSnackBar: true,
					});
				} else {
					setSnackBarMessage({
						severity: "error",
						message: res.message,
						showSnackBar: true,
					});
				}
			})
			.catch((err) => {
				console.error(err);
				setSnackBarMessage({
					severity: "error",
					message: "Something went wrong!",
					showSnackBar: true,
				});
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<AccessControl allowedLevels={["L0", "L1", "L2", "L3", "L4", "L5"]}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<div>
					<div className={styles.mprofile}>
						<div style={{ width: "300px", padding: "20px" }}>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
								<Typography variant="h5">Ship Name</Typography>
							</InputLabel>
							<SelectWithLimit
								limit={100}
								options={customSelectData["shipName"]}
								getSelectedValues={getSelectedValues}
								selectType={"shipName"}
							/>
						</div>
						<div style={{ width: "300px" }}>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
								<Typography variant="h5">Equipment Name</Typography>
							</InputLabel>
							<SelectWithLimit
								limit={100}
								options={eqDataOption}
								getSelectedValues={getSelectedValues}
								selectType={"equipmentName"}
							/>
						</div>
						<div style={{ width: "300px" }}>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
								<Typography variant="h5">Equipment Nomenclature</Typography>
							</InputLabel>
							<SelectWithLimit
								limit={100}
								options={nomenclatureDataOption}
								getSelectedValues={getSelectedValues}
								selectType={"nomenclature"}
							/>
						</div>
						<div style={{ width: "250px" }}>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px", marginBottom: "10px" }}>
								<Typography variant="h5">Duration(Hours)</Typography>
							</InputLabel>
							<TextField
								variant="outlined"
								type="number"
								selectType="missionDuration"
								value={selectedMissionName}
								onChange={handleChange}
							/>
						</div>
						<Button
							variant="contained"
							color="primary"
							style={{ marginTop: "2rem", marginRight: "1rem" }}
							onClick={onSubmitHandler}
						>
							Submit
						</Button>
					</div>

					{/* Chart or Loading or Message */}
					{isLoading ? (
						<div style={{ marginTop: "15rem", display: "flex", justifyContent: "center" }}>
							<CircularProgress size={40} />
						</div>
					) : graphData.length ? (
						<div className={styles.content}>
							<ReliabilityChart data={graphData} />
						</div>
					) : (
						<Typography
							variant="h4"
							style={{
								marginTop: "14rem",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							Please fill the above fields to see the graph..
						</Typography>
					)}
				</div>

				{SnackBarMessage.showSnackBar && (
					<CustomizedSnackbars
						message={SnackBarMessage}
						onHandleClose={onHandleSnackClose}
					/>
				)}
			</MuiPickersUtilsProvider>
		</AccessControl>
	);
};

export default ReliabilityDashboard;
