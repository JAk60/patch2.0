import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const initialValues = {
	EquipmentNomenclature: "",
	installation_date: "",
	AverageRunning: "",
	Unit: "",
};

const unitOptions = ["Days", "Hours", "Cycles"];

const AddInfoFormikForm = () => {
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
		const dataToSend = {
			id: uuid(),
			component_id: component?.id,
			EquipmentName: CurrentEquipment?.nomenclature,
			AverageRunning: values.AverageRunning,
			Unit: values.Unit,
			installation_date: values.installation_date,
			maintDataAvail: "Component Level",
			hK: 1,
			elhK: 1,
			cK: 1,
			dsK: 1,
			asK: 1,
			parallelComponentIds: [],
			N: 1,
		};
		try {
			const response = await fetch("/save_system", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					flatData: [dataToSend],
					dtype: "additionalInfo",
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
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ errors, touched, setFieldValue, setFieldTouched }) => (
					<Form>
						<TextField
							label="Installation Date"
							name="installation_date"
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							fullWidth
							variant="outlined"
							style={{ width: "400px",marginBottom: "8px" }}
							onChange={(event) => {
								setFieldValue(
									"installation_date",
									event.target.value
								);
								setFieldTouched("installation_date", true);
							}}
						/>
						<div>
							<TextField
								label="Default Avg. Monthly Utilization"
								name="AverageRunning"
								type="number"
								// fullWidth
								variant="outlined"
								style={{ width: "400px",marginBottom: "8px" }}
								onChange={(event) => {
									setFieldValue(
										"AverageRunning",
										event.target.value
									);
									setFieldTouched("AverageRunning", true);
								}}
							/>
						</div>
						<Autocomplete
							options={unitOptions}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Unit"
									variant="outlined"
								/>
							)}
							style={{ width: "400px",marginBottom: "8px" }}
							onChange={(event, newValue) => {
								setFieldValue("Unit", newValue ? newValue : "");
								setFieldTouched("Unit", true);
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

export default AddInfoFormikForm;
