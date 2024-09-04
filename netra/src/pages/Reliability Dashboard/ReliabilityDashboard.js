import MomentUtils from "@date-io/moment";
import { Button, InputLabel, TextField, Typography } from "@material-ui/core";
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
		fetch("/rel_dashboard", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => {
				return res.json();
			})
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
	}, [dispatch, setUserSelectionData]);

	console.log(userSelectionData);
	const getSelectedValues = (d, selectType) => {
		if (selectType === "equipmentName") {
			console.log("the D value", d);

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
						parent: element.parent, // Include parent information
						nomenclature: x.nomenclature,
					}));

				filteredItems.forEach((item) => {
					uniqueNomenData.add(JSON.stringify(item));
				});

				console.log("uniqueEqData", filteredItems);
			});

			let uniqueNomArray = Array.from(uniqueNomenData).map((item) =>
				JSON.parse(item)
			);

			const uniqueNomSet = new Set(
				uniqueNomArray.map((item) =>
					JSON.stringify({
						equipmentName: item.equipmentName,
						parent: item.parent,
						nomenclature: item.nomenclature,
					})
				)
			);

			const uniqueNomsArray = Array.from(uniqueNomSet).map((item) =>
				JSON.parse(item)
			);

			console.log("uniqueNomsArray", uniqueNomsArray);

			setNomenclatureDataOption(uniqueNomsArray);
			setEquipmentName(d);
			debugger;
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

				console.log("uniqueEqData", uniqueEqData);
			});

			let uniqueArray = Array.from(uniqueEqData).map((item) =>
				JSON.parse(item)
			);

			const uniqueNamesSet = new Set(
				uniqueArray.map((item) =>
					JSON.stringify({
						equipmentName: item.equipmentName,
						parent: item.parent,
					})
				)
			);

			const uniqueNamesArray = Array.from(uniqueNamesSet).map((item) =>
				JSON.parse(item)
			);

			console.log("Flagggist", typeof uniqueArray);

			setEqDataOption(uniqueNamesArray);
			debugger;
			setShipName(d);
		} else if (selectType === "nomenclature") {
			setNomenclature(d);
		}
	};

	console.log("EQuip", selectedEqName);
	console.log("EQuip", eqDataOption);
	console.log("graphData", graphData);

	console.log(selectedEqName, selectedMissionName, selectedShipName);

	const handleChange = (event) => {
		setMissionName(event.target.value);
	};
	const onSubmitHandler = () => {
		setGraphData([]);

		const data = {
			missions: [selectedMissionName], /// its duration not the missioncardD
			equipments: selectedEqName,
			nomenclature: nomenclature,
			shipClass: selectedShipName,
			tempMissions: [],
		};
		console.log(data, "tooltip");

		fetch("/rel_estimate_EQ", {
			method: "POST",
			body: JSON.stringify({ data: data }),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log("res", res);
				// debugger;
				if (res.code) {
					const d = res.results;
					const reliabilityDataArray = [];
					d.forEach((missionData) => {
						Object.keys(missionData["Temp Mission"]).forEach(
							(ship) => {
								const shipData =
									missionData["Temp Mission"][ship];

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
							}
						);
					});

					console.log("---------------->>>>>", reliabilityDataArray);

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
			});
	};

	return (
		<AccessControl allowedLevels={["L1", "L2", "L3", "L4", "L5"]}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				{/* <Navigation /> */}
				<div>
					<div className={styles.mprofile}>
						<div style={{ width: "300px", padding: "20px" }}>
							<InputLabel
								style={{
									fontWeight: "bold",
									color: "black",
									fontSize: "16px",
									marginBottom: "10px",
								}}
							>
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
							<InputLabel
								style={{
									fontWeight: "bold",
									color: "black",
									fontSize: "16px",
									marginBottom: "10px",
								}}
							>
								<Typography variant="h5">
									Equipment Name
								</Typography>
							</InputLabel>
							<SelectWithLimit
								limit={100}
								options={eqDataOption}
								getSelectedValues={getSelectedValues}
								selectType={"equipmentName"}
							/>
						</div>
						<div style={{ width: "300px" }}>
							<InputLabel
								style={{
									fontWeight: "bold",
									color: "black",
									fontSize: "16px",
									marginBottom: "10px",
								}}
							>
								<Typography variant="h5">
									Equipment Nomenclature
								</Typography>
							</InputLabel>
							<SelectWithLimit
								limit={100}
								options={nomenclatureDataOption}
								getSelectedValues={getSelectedValues}
								selectType={"nomenclature"}
							/>
						</div>
						<div style={{ width: "250px" }}>
							<InputLabel
								style={{
									fontWeight: "bold",
									color: "black",
									fontSize: "16px",
									marginBottom: "10px",
								}}
							>
								<Typography variant="h5">
									Duration(Hours)
								</Typography>
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
							style={{
								marginTop: "2rem",
								marginRight: "1rem",
							}}
							onClick={onSubmitHandler}
						>
							Submit
						</Button>
					</div>
					{graphData.length ? (
						<>
							<div className={styles.content}>
								{graphData && (
									<ReliabilityChart data={graphData} />
								)}
							</div>
						</>
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
							Enter the above details to see the graph...
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
