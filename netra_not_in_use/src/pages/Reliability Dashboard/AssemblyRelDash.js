import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import styles from "./rDashboard.module.css";
import ReliabilityChart from "./ReliabilityChart";
import { Typography } from "@material-ui/core";

export default function AssemblyRelDash() {
	const [shipName, setShipName] = useState("");
	const [equipment, setEquipment] = useState("");
	const [equipmentData, setEquipmentData] = useState([]);
	const [assembly, setAssembly] = useState([]);
	const [duration, setDuration] = useState("");
	const [allEquipmentData, setAllEquipmentData] = useState([]);
	const [graphData, setGraphData] = useState([]);
	const [selectedEqName, setEquipmentName] = useState(null);
	const [nomenclature, setNomenclature] = useState(null);
	const [tempMissionData, setTempMissionData] = useState([]);
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/fetch_user_selection", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				if (!response.ok) {
					// Handle the error here if needed
					console.error("Error fetching user selection data");
					return;
				}
				const data = await response.json();
				const userData = data["data"];
				const eqData = data["eqData"];
				let shipName = userData.map((x) => x.shipName);
				console.log(eqData);
				setAllEquipmentData(eqData);
				// shipName = [...new Set(shipName)];
				// setShipOptions(shipName);
				const components = data["uniq_eq_data"];
				dispatch(
					userActions.onFirstLoad({
						componentsData: components,
					})
				);
			} catch (error) {
				console.error("Error in fetching user selection data:", error);
			}
		};

		fetchData(); // Call the asynchronous function
	}, []);
	let ships = useSelector(
		(state) => state.userSelection.userSelection.shipName
	);
	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle form submission logic here, e.g., send data to server
		console.log("Form submitted:", {
			shipName,
			equipment,
			assembly,
			duration,
		});
		setGraphData([]);

		const data = {
			missions: [duration], /// its duration not the missioncardD
			equipments: selectedEqName,
			nomenclature: nomenclature,
			shipClass: [shipName],
			tempMissions: tempMissionData,
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
		// Clear form fields after submission if needed
		// setShipName("");
		// setEquipment("");
		// setAssembly("");
		// setDuration("");
	};
	const Onshipchange = (e, value) => {
		const currShip = value;
		const filteredEqData = allEquipmentData.filter((equipment) => {
			return equipment.shipName === currShip;
		});
		console.log(filteredEqData);
		setEquipmentData(filteredEqData);
	};
	const OnAssemblychange = (e, value) => {
		const currShip = value;
		console.log(value);
		const equipment = value.map((item) => ({
            equipmentName: item.name,
            parent: item.shipName,
        }));
    
        const nomenclature = value.map((item) => ({
            equipmentName: item.name,
            parent: item.shipName,
            nomenclature: item.nomenclature,
        }));

		setEquipmentName(equipment);
		setNomenclature(nomenclature);
		// const filteredEqData = allEquipmentData.filter((equipment) => {
		// 	return equipment.shipName === currShip;
		// });
		// console.log(filteredEqData);
		// setEquipmentData(filteredEqData);
	};
	const OnEquipmentChnage = async (e, value) => {
		console.log(value);

		setShipName(value.shipName);

		const payload = {
			nomenclature: value?.nomenclature,
			ship_name: value.shipName,
			component_id: null,
		};

		try {
			const response = await fetch("/fetch_system", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			setAssembly(data.treeD);
			console.log("Fetch system response:", data);
			// Handle further processing of response data as needed
		} catch (error) {
			console.error("Error fetching system:", error);
			// Handle error state or display error to user
		}
	};
	console.log(assembly);
	return (
		<>
			<form onSubmit={handleSubmit}>
				<div
					style={{
						display: "flex",
						padding: "20px",
						justifyContent: "center",
						boxShadow: "0px 0 15px 0px rgba(0, 0, 0, 0.15)",
						borderRadius: "15px",
						gap: "10px",
					}}
				>
					<Autocomplete
						id="ship-name"
						options={ships}
						getOptionLabel={(option) => option}
						onChange={Onshipchange}
						style={{ width: "200px" }}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Ship Name"
								variant="outlined"
							/>
						)}
					/>

					<Autocomplete
						id="equipment"
						options={equipmentData}
						getOptionLabel={(option) => option.nomenclature}
						// value={equipment}
						style={{ width: "200px" }}
						onChange={OnEquipmentChnage}
						renderOption={(option) => (
							<React.Fragment>
								<span>{option.equipmentName}</span>
								{option.nomenclature && ( // Check if nomenclature exists
									<span> ({option.nomenclature}) </span> // Display nomenclature in brackets
								)}
							</React.Fragment>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Equipment"
								variant="outlined"
							/>
						)}
					/>

					<Autocomplete
						multiple
						id="assembly"
						options={assembly}
						getOptionLabel={(option) => option?.nomenclature}
						groupBy={(option) => option?.parent}
						style={{ width: "200px" }}
						onChange={OnAssemblychange}
						renderOption={(option) => (
							<React.Fragment>
								<span>{option.name}</span>
								{option.nomenclature && ( // Check if nomenclature exists
									<span> ({option.nomenclature}) </span> // Display nomenclature in brackets
								)}
							</React.Fragment>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Assembly"
								variant="outlined"
							/>
						)}
					/>

					<TextField
						id="duration"
						label="Duration"
						type="number"
						value={duration}
						style={{ width: "200px" }}
						onChange={(event) => {
							// Ensure only numbers are entered
							const value = event.target.value.replace(/\D/g, "");
							setDuration(value);
						}}
						variant="outlined"
					/>

					<Button type="submit" variant="contained" color="primary">
						Submit
					</Button>
				</div>
			</form>
			{graphData.length ? (
				<>
					<div className={styles.content}>
						{graphData && <ReliabilityChart data={graphData} />}
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
		</>
	);
}
