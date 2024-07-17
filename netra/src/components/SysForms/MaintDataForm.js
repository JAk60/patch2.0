import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuid } from "uuid";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import { useSelector } from "react-redux";

const initialValues = {
	LMU: "",
	EventType: "",
	Date: "",
	MaintenanceType: "",
	ReplaceType: "",
	CannibalisedAge: "",
	MaintenanceDuration: "",
	FM: "",
	Remark: "",
};

const eventTypeOptions = ["Preventive", "Breakdown"];
const maintenanceTypeOptions = ["Replaced", "Repaired"];
const replaceTypeOptions = ["New", "Refurbished", "Cannibalised", "Duplicate"];

const MaintenanceDataFormik = () => {
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
		console.log(values);
		let component = EquipmentNomenclatures.find(
			(item) =>
				item.ship_name === CurrentEquipment.shipName &&
				item.nomenclature === CurrentEquipment.nomenclature
		);
		const dataToSend = {
			LMU: CurrentEquipment?.equipmentName,
			component_id: component?.id,
			EventType: values.EventType,
			Date: values.Date,
			MaintainanceType: values.MaintenanceType,
			ReplaceType: values.ReplaceType,
			CannibalisedAge: values.CannibalisedAge,
			MaintenanceDuration: values.MaintenanceDuration,
			FM: "",
			Remark: values.Remark,
			id: uuid(),
			MaintenanceType: values.MaintenanceType,
		};

		try {
			const response = await fetch("/save_system", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					flatData: [dataToSend],
					dtype: "failure_mode", // Ensure dtype is correct
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
	const equipmentOptions = [
		{ label: "Option 1", value: "option1" },
		{ label: "Option 2", value: "option2" },
		{ label: "Option 3", value: "option3" },
	];

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({
					values,
					errors,
					touched,
					setFieldValue,
					setFieldTouched,
				}) => (
					<Form>
						<Autocomplete
							options={eventTypeOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Event Type"
									variant="outlined"
								/>
							)}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event, newValue) => {
								setFieldValue(
									"EventType",
									newValue ? newValue : ""
								);
								setFieldTouched("EventType", true);
							}}
						/>

						<TextField
							label="Date"
							name="Date"
							type="date"
							fullWidth
							variant="outlined"
							InputLabelProps={{
								shrink: true,
							}}
							value={values.Date}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event) => {
								setFieldValue("Date", event.target.value);
								setFieldTouched("Date", true);
							}}
						/>

						<Autocomplete
							options={maintenanceTypeOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Maintenance Type"
									variant="outlined"
								/>
							)}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event, newValue) => {
								setFieldValue(
									"MaintenanceType",
									newValue ? newValue : ""
								);
								setFieldTouched("MaintenanceType", true);
							}}
						/>

						<Autocomplete
							options={replaceTypeOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Replace Component Type"
									variant="outlined"
								/>
							)}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event, newValue) => {
								setFieldValue(
									"ReplaceType",
									newValue ? newValue : ""
								);
								setFieldTouched("ReplaceType", true);
							}}
						/>

						<TextField
							label="Cannibalised Age"
							name="CannibalisedAge"
							type="number"
							fullWidth
							variant="outlined"
							value={values.CannibalisedAge}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event) => {
								setFieldValue(
									"CannibalisedAge",
									event.target.value
								);
								setFieldTouched("CannibalisedAge", true);
							}}
						/>
						<div>
							<TextField
								label="Maintenance Duration"
								name="MaintenanceDuration"
								type="number"
								fullWidth
								variant="outlined"
								value={values.MaintenanceDuration}
								style={{ width: "400px", marginBottom: "8px" }}
								onChange={(event) => {
									setFieldValue(
										"MaintenanceDuration",
										event.target.value
									);
									setFieldTouched(
										"MaintenanceDuration",
										true
									);
								}}
							/>
						</div>

						<div>
            <TextField
							label="Remark"
							name="Remark"
							multiline
							rows={4}
							fullWidth
							variant="outlined"
							value={values.Remark}
							style={{ width: "400px", marginBottom: "8px" }}
							onChange={(event) => {
								setFieldValue("Remark", event.target.value);
								setFieldTouched("Remark", true);
							}}
						/>
            </div>

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

export default MaintenanceDataFormik;
