import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import AddInfoFormikForm from "../../components/SysForms/AdditionalInfoForm";
import FMFormikForm from "../../components/SysForms/FailureModeForm";
import MaintenanceDataFormik from "../../components/SysForms/MaintDataForm";
import MaintenanceFormikForm from "../../components/SysForms/MaintenanceForm";
import FormikForm from "../../components/SysForms/parallelRedundancy";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginLeft: "29rem",
		marginTop: "80px",
	},
	accordion: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "80%", 
		marginBottom: theme.spacing(2),
	},
	formContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		width: "100vw",
		maxWidth: "900px", 
	},
}));


const options = [
	"Redundancy & Parallel Information",
	"Maintenance Information",
	"Failure Modes",
	"Additional Information",
	"Maintenance Data",
]; // Replace with your options

export default function FormsTab() {
	const classes = useStyles();
	const [selectedOption, setSelectedOption] = useState(null);
	const [formVisible, setFormVisible] = useState(false);

	const handleOptionChange = (option) => {
		if (selectedOption === option) {
			// If the same option is clicked again, collapse the Accordion
			setSelectedOption(null);
			setFormVisible(false);
		} else {
			setSelectedOption(option);
			setFormVisible(true); // Show the form when an option is selected
		}
	};

	const renderForm = () => {
		if (selectedOption && formVisible) {
			switch (selectedOption) {
				case "Redundancy & Parallel Information":
					return <FormikForm />;
				case "Maintenance Information":
					return <MaintenanceFormikForm />;
				case "Failure Modes":
					return <FMFormikForm />;
				case "Additional Information":
					return <AddInfoFormikForm />;
				case "Maintenance Data":
					return <MaintenanceDataFormik />;
				default:
					return null;
			}
		}
		return null;
	};

	return (
		<div className={classes.root}>
			{options.map((option) => (
				<Accordion
					key={option}
					className={classes.accordion}
					expanded={selectedOption === option}
					onChange={() => handleOptionChange(option)}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>{option}</Typography>
					</AccordionSummary>
					<AccordionDetails className={classes.formContainer}>
						<div>{selectedOption === option && renderForm()}</div>
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}
