import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const initialValues = {
	EquipmentNomenclature: "",
	RepairType: "",
	PreventiveMaintenaceApplicable: "",
	PreventiveMaintenaceInterval: "",
	ComponentsReplaced: "",
};

const repairTypeOptions = ["Replaceable", "Repairable"];
const preventiveMaintenanceApplicableOptions = ["No", "Yes"];
const componentsReplacedOptions = ["No", "Yes"];

const MaintenanceFormikForm = () => {
	const EquipmentNomenclatures = useSelector(
		(state) => state.userSelection.componentsData
	);
	console.log(EquipmentNomenclatures);
	const handleSubmit = async (values) => {
		console.log(values);
		try {
			const response = await fetch("/save_system", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					flatData: [{
						id: uuid(),
						component_id: values.EquipmentNomenclature.id,
						EquipmentName: values.EquipmentNomenclature.name,
						RepairType: values.RepairType,
						PreventiveMaintenaceApplicable:values.PreventiveMaintenaceApplicable,
						PreventiveMaintenaceInterval: parseInt(
							values.PreventiveMaintenaceInterval
						),
						ComponentsReplaced: values.ComponentsReplaced,
					}],
					dtype: "insertMaintenanceInfo", // Assuming dtype is always "system_configuration"
				}),
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Data saved successfully:", data);
				// Handle success if needed
			} else {
				console.error("Failed to save data:", response.statusText);
				// Handle error if needed
			}
		} catch (error) {
			console.error("Error occurred while saving data:", error);
			// Handle error if needed
		}
	};

	return (
		<Formik initialValues={initialValues} onSubmit={handleSubmit}>
			{({ errors, touched, setFieldValue, setFieldTouched }) => (
				<Form>
					<Autocomplete
						options={EquipmentNomenclatures}
						getOptionLabel={(option) => option.nomenclature}
						groupBy={(option) => option.ship_name}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Equipment Nomenclature"
								variant="outlined"
							/>
						)}
						onChange={(event, newValue) => {
							// Ensure newValue is logged correctly
							console.log(
								"Selected Equipment Nomenclature:",
								newValue
							);
							setFieldValue(
								"EquipmentNomenclature",
								newValue ? newValue : ""
							);
							setFieldTouched("EquipmentNomenclature", true);
						}}
					/>

					<Autocomplete
						options={repairTypeOptions}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Repair Type"
								variant="outlined"
							/>
						)}
						onChange={(event, newValue) => {
							setFieldValue(
								"RepairType",
								newValue ? newValue : ""
							);
							setFieldTouched("RepairType", true);
						}}
					/>

					<Autocomplete
						options={preventiveMaintenanceApplicableOptions}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Preventive Maintenance Applicable"
								variant="outlined"
							/>
						)}
						onChange={(event, newValue) => {
							setFieldValue(
								"PreventiveMaintenaceApplicable",
								newValue ? newValue : ""
							);
							setFieldTouched(
								"PreventiveMaintenaceApplicable",
								true
							);
						}}
					/>

					<TextField
						label="Preventive Maintenance Interval (hrs)"
						name="PreventiveMaintenaceInterval"
						type="number"
						fullWidth
						variant="outlined"
						onChange={(event) => {
							setFieldValue(
								"PreventiveMaintenaceInterval",
								event.target.value
							);
							setFieldTouched(
								"PreventiveMaintenaceInterval",
								true
							);
						}}
					/>

					<Autocomplete
						options={componentsReplacedOptions}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Can it be replaced by ship staff ?"
								variant="outlined"
							/>
						)}
						onChange={(event, newValue) => {
							setFieldValue(
								"ComponentsReplaced",
								newValue ? newValue : ""
							);
							setFieldTouched("ComponentsReplaced", true);
						}}
					/>

					<Button type="submit" variant="contained" color="primary">
						Submit
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default MaintenanceFormikForm;
