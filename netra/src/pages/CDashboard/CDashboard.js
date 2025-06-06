import React, { useEffect, useState } from "react";
import {
	InputLabel,
	TextField,
	makeStyles,
	Button,
	Typography,
	CircularProgress,
} from "@material-ui/core";
import styles from "./CDashboard.module.css";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Navigation from "../../components/navigation/Navigation";
import AccessControl from "../Home/AccessControl";
import CustomSelect from "../../ui/Form/CustomSelect";
import { Autocomplete } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import CGraph from "./CGraph";

const CDashboard = () => {
	const dispatch = useDispatch();
	const [userSelectionData, setUserSelectionData] = useState([]);
	const [uniqueEqIds, setUniqueEqIds] = useState([]);
	const [selectedEqName, setEquipmentName] = useState([]);
	const [paramOptions, setParamOptions] = useState([]);
	const [selectedShipName, setShipName] = useState([]);
	const [selectedParameterName, setParameterName] = useState([]);
	const [eqDataOption, setEqDataOption] = useState([]);
	const [nomenclatureDataOption, setNomenclatureDataOption] = useState([]);
	const [nomenclatureData, setNomenclatureData] = useState([]);
	const [graphData, setGraphData] = useState([]);
	const [showGraph, setShowGraph] = useState(false);
	const [loading, setLoading] = useState(false); // <-- loading state

	useEffect(() => {
		fetch("/cm_dashboard", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				const params = data["parameters"];
				const filteredData = params.filter((item) =>
					nomenclatureData.includes(item.nomenclature)
				);
				setParamOptions(filteredData);

				const user_selection = data["user_selection"]["data"];
				const eqData = data["user_selection"]["eqData"];
				const eqIds = data["user_selection"]["uniq_eq_data"];
				setUniqueEqIds(eqIds);
				let shipName = user_selection.map((x) => x.shipName);
				shipName = [...new Set(shipName)];
				setUserSelectionData(eqData);
				dispatch(userActions.populateParams({ params: params }));
				dispatch(
					userActions.onChangeLoad({
						filteredData: { shipName: shipName },
					})
				);
			});
	}, [nomenclatureData]);

	const customSelectData = useSelector(
		(state) => state.userSelection.userSelection
	);
	const dropDownStyle = makeStyles({
		root: {
			paddingLeft: 10,
			background: "#fff",
			border: "1px solid #0263a1",
			borderRadius: "5px",
			width: "320px",
			minHeight: "40px",
			boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
		},
		inputRoot: {
			width: "100%",
		},
	});
	const classes = dropDownStyle();

	const uniqueEquipmentIds = [
		...new Set(paramOptions.map((item) => item.equipment_id)),
	];

	const onSubmitHandler = () => {
		setLoading(true);
		setShowGraph(false);
		fetch("/cgraph", {
			method: "POST",
			body: JSON.stringify({
				equipment_id: uniqueEquipmentIds,
			}),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				if (data.code) {
					setSnackBarMessage({
						severity: "success",
						message: "Sensor Graph Showed Successfully",
						showSnackBar: true,
					});
					setGraphData(data.response["graphData"]);
					setShowGraph(true);
				} else {
					setSnackBarMessage({
						severity: "error",
						message: data.message,
						showSnackBar: true,
					});
				}
			})
			.catch((error) => {
				setLoading(false);
				setSnackBarMessage({
					severity: "error",
					message: "Some Error Occurred. " + error,
					showSnackBar: true,
				});
			});
	};

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

	const changeShip = (e) => {
		const filteredEqData = userSelectionData
			.filter((x) => x.shipName === e.target.value)
			.map((x) => {
				const id = uniqueEqIds.find(
					(y) => y.nomenclature === x.nomenclature
				);
				return id ? id : null;
			})
			.filter((id) => id !== null);
		const uniqueEqNames = [...new Set(filteredEqData.map((item) => item.name))];
		const filteredNomenclatures = filteredEqData
			.filter((item) => selectedEqName.includes(item.name))
			.map((item) => item.nomenclature);
		setEqDataOption(uniqueEqNames);
		setShipName(e.target.value);
	};

	useEffect(() => {
		const filteredEqData = userSelectionData
			.filter((x) => x.shipName === selectedShipName)
			.map((x) => {
				const id = uniqueEqIds.find(
					(y) => y.nomenclature === x.nomenclature
				);
				return id ? id : null;
			})
			.filter((id) => id !== null);
		let filteredNomenclatures = filteredEqData
			.filter((item) => selectedEqName.includes(item.name))
			.map((item) => item.nomenclature);
		filteredNomenclatures = [...new Set(filteredNomenclatures)];
		setNomenclatureDataOption(filteredNomenclatures);
	}, [selectedEqName, selectedShipName]);

	return (
		<AccessControl allowedLevels={['L0', 'L1', 'L2', 'L5']}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Navigation />
				<div className={styles.body}>
					<div className={styles.mprofile}>
						{/* Ship Name */}
						<div>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
								<Typography variant="h5">Ship Name</Typography>
							</InputLabel>
							<CustomSelect
								fields={customSelectData["shipName"]}
								onChange={changeShip}
								value={selectedShipName}
							/>
						</div>

						{/* Equipment Name */}
						<div>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
								<Typography variant="h5">Equipment Name</Typography>
							</InputLabel>
							<Autocomplete
								classes={classes}
								multiple
								id="equipment-select"
								options={eqDataOption}
								getOptionLabel={(option) => option}
								value={selectedEqName}
								style={{ width: "250px" }}
								onChange={(e, value) => setEquipmentName(value)}
								renderInput={(params) => (
									<TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} variant="standard" />
								)}
							/>
						</div>

						{/* Nomenclature */}
						<div>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
								<Typography variant="h5">Select Nomenclature</Typography>
							</InputLabel>
							<Autocomplete
								classes={classes}
								multiple
								id="nomenclature-select"
								options={nomenclatureDataOption}
								getOptionLabel={(option) => option}
								value={nomenclatureData}
								style={{ width: "250px" }}
								onChange={(e, value) => setNomenclatureData(value)}
								renderInput={(params) => (
									<TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} variant="standard" />
								)}
							/>
						</div>

						{/* Parameter */}
						<div>
							<InputLabel style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
								<Typography variant="h5">Select Parameter</Typography>
							</InputLabel>
							<Autocomplete
								classes={classes}
								multiple
								id="parameter-select"
								options={paramOptions}
								getOptionLabel={(option) => option.name}
								groupBy={(option) => option.nomenclature}
								value={selectedParameterName}
								style={{ width: "250px" }}
								onChange={(e, value) => setParameterName(value)}
								renderInput={(params) => (
									<TextField {...params} InputProps={{ ...params.InputProps, disableUnderline: true }} variant="standard" />
								)}
							/>
						</div>

						{/* Submit */}
						<Button
							variant="contained"
							color="primary"
							style={{ marginTop: "2rem" }}
							onClick={onSubmitHandler}
						>
							Submit
						</Button>
					</div>

					{/* Graph or Loading */}
					{loading ? (
						<div style={{ display: "flex", justifyContent: "center", marginTop: "15rem" }}>
							<CircularProgress size={40} />
						</div>
					) : showGraph ? (
						<CGraph
							graphData={graphData}
							selectedParameterNames={selectedParameterName}
							nomenclatureData={nomenclatureData}
						/>
					) : (
						<Typography
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								maxHeight: "75%",
								height: "100%",
								marginTop: "2rem",
							}}
							variant="h4"
						>
							Please fill the above fields to see the graph..
						</Typography>
					)}
				</div>

				{/* Snackbar */}
				{SnackBarMessage.showSnackBar && (
					<CustomizedSnackbars message={SnackBarMessage} onHandleClose={onHandleSnackClose} />
				)}
			</MuiPickersUtilsProvider>
		</AccessControl>
	);
};

export default CDashboard;
