import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
const initialValues = {
	EquipmentNomenclature: "",
	FailureMode: "",
};

const FMFormikForm = () => {
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
			EquipmentName: CurrentEquipment?.equipmentName,
			eqId: component?.id,
			id: uuid(), // Assuming you have a function or library to generate unique IDs like uuid()
			fixFailureMode: values.FailureMode,
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
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				// flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ errors, touched, setFieldValue, setFieldTouched }) => (
					<Form>
						<TextField
							label="Failure Mode"
							name="FailureMode"
							fullWidth
							variant="outlined"
							style={{ marginBottom: "8px" }}
							onChange={(event) => {
								setFieldValue(
									"FailureMode",
									event.target.value
								);
								setFieldTouched("FailureMode", true);
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

export default FMFormikForm;
