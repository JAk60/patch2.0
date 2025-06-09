import { TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import MultiSelect from "./MultiSelect";

const useStyles = makeStyles({
	root: {
		margin: "0 2.5em",
	},
	tabs: {
		marginTop: "1rem",
	},
	autocomplete: {
		margin: "1rem",
		minWidth: 250,
	},
	deleteButton: {
		margin: "1rem",
	},
});

export default function CmmsSysConfig() {
	const [allEquipmentData, setAllEquipmentData] = useState([]);
	const [shipsOptions, setShipOptions] = useState([]);
	const [departmentsOptions, setDepartmentOptions] = useState([]);
	const [equipmentOptions, setEquipmentOptions] = useState([]);
	const [nomenclatureOptions, setNomenclatureOptions] = useState([]);
	const [selectedShip, setSelectedShip] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [selectedOptions, setSelectedOptions] = useState([]);
	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/fetch_cmms_selection", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});
				const data = await response.json();
				console.log(data);

				// Extract unique ship names and departments
				const uniqueShips = [
					...new Set(data.map((item) => item.ship_name)),
				];
				setShipOptions(uniqueShips);

				setAllEquipmentData(data);

				const components = data.map((item) => ({
					equipmentName: item.equipment,
					department: item.department,
					nomenclature: item.nomenclature,
				}));

				dispatch(
					userActions.onFirstLoad({
						filteredData: { shipName: uniqueShips },
						componentsData: components,
					})
				);
			} catch (error) {
				console.error("Error in fetching user selection data:", error);
			}
		};

		fetchData();
	}, []);
	const getOptionDisabled = (option) => option.value === "foo";
	const ShipChange = (e, value) => {
		setSelectedShip(value);
		setSelectedDepartment(""); // Reset department when ship changes
		const filteredDepartments = allEquipmentData
			.filter((equipment) => equipment.ship_name === value)
			.map((equipment) => equipment.department);
		console.log(filteredDepartments);
		setDepartmentOptions([...new Set(filteredDepartments)]);
		const data = { shipName: value };
		dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
	};

	const DepartmentChange = (e, value) => {
		setSelectedDepartment(value);
		const filteredEquipments = allEquipmentData
			.filter(
				(equipment) =>
					equipment.ship_name === selectedShip &&
					equipment.department === value
			)
			.map((equipment) => equipment.component_name);
			
		setEquipmentOptions([...new Set(filteredEquipments)]);
		const data = { department: value };
		dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
	};

	const EquipmentChange = (e, value) => {
		const selectedEquipment = value;
		const filteredNomenclature = allEquipmentData
			.filter(
				(equipment) =>
					equipment.ship_name === selectedShip &&
					equipment.department === selectedDepartment &&
					equipment.component_name === selectedEquipment
			)
			.map((equipment) => equipment.nomenclature);
			console.log("abcd",filteredNomenclature)
      const nomenclatureOptionsAsObjects = filteredNomenclature.map((option) => ({
        label: option.toLowerCase().replace(/ /g, ''),
        value: option,
      }));
	  console.log("anupam",nomenclatureOptionsAsObjects)
		setNomenclatureOptions(nomenclatureOptionsAsObjects);
		const data = { equipmentName: value };
		dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
	};
	console.log("12345",nomenclatureOptions);
	const NomenclatureChange = (e, values) => {
		const selectedNomenclatures = values || [];

		// Get all unique nomenclatures from allEquipmentData
		const allNomenclatures = Array.from(
			new Set(allEquipmentData.map((item) => item.nomenclature))
		);
		const hasSelectAll = selectedNomenclatures.includes("Select All");

		let updatedNomenclatures;

		if (hasSelectAll) {
			// If "Select All" is selected, set updatedNomenclatures to all nomenclatures
			updatedNomenclatures = allNomenclatures;
		} else {
			// Remove "Select All" from the selectedNomenclatures array
			updatedNomenclatures = selectedNomenclatures.filter(
				(item) => item !== "Select All"
			);

			// If all nomenclatures except "Select All" are selected, deselect all
			const hasAllSelected =
				updatedNomenclatures.length === allNomenclatures.length;
			if (hasAllSelected) {
				updatedNomenclatures = [];
			}
		}

		const data = { nomenclature: updatedNomenclatures };
		dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));

		const equipmentCodes = updatedNomenclatures.map(
			(selectedNomenclature) => {
				const filteredCmmsCode = allEquipmentData.find(
					(equipment) =>
						equipment.nomenclature === selectedNomenclature
				);
				return filteredCmmsCode ? filteredCmmsCode.CMMSCode : null;
			}
		);

		const datac = { equipmentCode: equipmentCodes };
		dispatch(userActions.onChangeCurrentSelection({ selectedData: datac }));
	};
	const handleToggleOption = (selectedOptions) =>{
    console.log(selectedOptions);
    const data = { nomenclature: selectedOptions };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
		setSelectedOptions(selectedOptions);
  }
	const handleClearOptions = () => setSelectedOptions([]);
	const handleSelectAll = (isSelected) => {
		if (isSelected) {
			setSelectedOptions(nomenclatureOptions);
      const data = { nomenclature: nomenclatureOptions };
		  dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
		} else {
			handleClearOptions();
		}
	};
	const getOptionLabel = (option) => option?.label;
	return (
		<>
			<Autocomplete
				className={classes.autocomplete}
				options={shipsOptions}
				getOptionLabel={(option) => option}
				onChange={ShipChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Ship Name"
						variant="outlined"
					/>
				)}
			/>
			<Autocomplete
				className={classes.autocomplete}
				options={departmentsOptions}
				getOptionLabel={(option) => option}
				onChange={DepartmentChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Department"
						variant="outlined"
					/>
				)}
			/>
			<Autocomplete
				className={classes.autocomplete}
				options={equipmentOptions}
				getOptionLabel={(option) => option}
				onChange={EquipmentChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Equipment Name"
						variant="outlined"
					/>
				)}
			/>
			{/* <Autocomplete
        multiple
        className={classes.autocomplete}
        options={nomenclatureOptions}
        getOptionLabel={(option) => option}
        onChange={NomenclatureChange}
        renderInput={(params) => (
          <TextField {...params} label="Nomenclature" variant="outlined" />
        )}
      /> */}
			<MultiSelect
				items={nomenclatureOptions}
				getOptionLabel={getOptionLabel}
				getOptionDisabled={getOptionDisabled}
				selectedValues={selectedOptions}
				label="Select Nomenclature"
				placeholder="select nomenclature"
				selectAllLabel="Select all"
				onToggleOption={handleToggleOption}
				onClearOptions={handleClearOptions}
				onSelectAll={handleSelectAll}
        className={classes.autocomplete}
			/>
		</>
	);
}
