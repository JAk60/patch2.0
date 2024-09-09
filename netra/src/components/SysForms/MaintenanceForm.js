import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

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
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});

	const EquipmentNomenclatures = useSelector(
		(state) => state.userSelection.componentsData
	);
	const CurrentEquipment = useSelector(
		(state) => state.userSelection.currentSelection
	);

	const handleSubmit = async (values) => {
		let component = EquipmentNomenclatures.find(
			(item) =>
				item.ship_name === CurrentEquipment.shipName &&
				item.nomenclature === CurrentEquipment.nomenclature
		);

		if (!component) {
			setSnackBarMessage({
				severity: "error",
				message: "Component not found",
				showSnackBar: true,
			});
			return;
		}

		const dataToSend = {
			id: uuid(),
			component_id: component.id,
			EquipmentName: CurrentEquipment?.equipmentName,
			RepairType: values.RepairType,
			PreventiveMaintenanceApplicable:
				values.PreventiveMaintenanceApplicable, // Fixed typo
			PreventiveMaintenanceInterval: parseInt(
				values.PreventiveMaintenanceInterval
			) || 0,
			ComponentsReplaced: values.ComponentsReplaced,
		};

		console.log(values);
		console.log(dataToSend);

		try {
			const response = await fetch("/save_system", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					flatData: [dataToSend],
					dtype: "insertMaintenanceInfo", // Ensure dtype is correct
				}),
			});

			const data = await response.json();
			console.log(data);
			if (response.ok) {
				setSnackBarMessage({
					severity: "success",
					message: data.message,
					showSnackBar: true,
				});
			} else {
				throw new Error(data.message || "An unknown error occurred");
			}
		} catch (error) {
			setSnackBarMessage({
				severity: "error",
				message:
					"Error occurred in System Configuration, Please try again: " +
					error.message,
				showSnackBar: true,
			});
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
		<div
			style={{
				display: "flex",
				gap: "20px",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ values, setFieldValue, setFieldTouched }) => (
					<Form>
						<Autocomplete
							options={repairTypeOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Repair Type"
									variant="outlined"
								/>
							)}
							style={{ width: "400px", marginBottom: "8px" }}
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
							style={{ width: "400px", marginBottom: "8px" }}
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

						{values.PreventiveMaintenaceApplicable === "Yes" && (
							<TextField
								label="Preventive Maintenance Interval (hrs)"
								name="PreventiveMaintenaceInterval"
								type="number"
								fullWidth
								variant="outlined"
								style={{ width: "400px", marginBottom: "8px" }}
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
						)}

						<Autocomplete
							options={componentsReplacedOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Can it be replaced by ship staff ?"
									variant="outlined"
								/>
							)}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event, newValue) => {
								setFieldValue(
									"ComponentsReplaced",
									newValue ? newValue : ""
								);
								setFieldTouched("ComponentsReplaced", true);
							}}
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
						>
							Submit
						</Button>
					</Form>
				)}
			</Formik>
			{SnackBarMessage.showSnackBar && (
				<CustomizedSnackbars
					message={SnackBarMessage}
					onHandleClose={onHandleSnackClose}
				/>
			)}
		</div>
	);
};

export default MaintenanceFormikForm;
