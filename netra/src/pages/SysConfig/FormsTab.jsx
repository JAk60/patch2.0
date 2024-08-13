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
import RedundancyInfo from "../systen_configuration/redundancy/redundancy";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyItems: "center",
		marginTop: "80px",
	},
	accordion: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "90%",
		marginBottom: theme.spacing(2),
	},
	formContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		width: "100vw",
		maxWidth: "1000px",
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
	const CurrentEquipment = useSelector(
		(state) => state.treeData.sortTreeData
	);
	console.log(CurrentEquipment);
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
					return <RedundancyInfo />;
				case "Maintenance Information":
					return <MaintenanceFormikForm />;
				case "Failure Modes":
					return <FMFormikForm />;
				case "Additional Information":
					return <AddInfoFormikForm />;
				case "Maintenance Data":
					return <MaintenanceDataFormik />;
				default:
					return <Typography>Hello, nothing here</Typography>;
			}
		}
		return <Typography>Hello, nothing here</Typography>;
	};

	return (
		<div className={classes.root}>
			{!CurrentEquipment[0]?.name ? (
				<Typography variant="h6" color="error">
					Please load the equipment in the previous tab.
				</Typography>
			) : (
				<>
					<Typography variant="h4" style={{ marginBottom: "24px" }}>
						Equipment Under Consideration:{" "}
						{CurrentEquipment[0]?.name} (
						{CurrentEquipment[0]?.nomenclature})
					</Typography>
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
				</>
			)}
		</div>
	);
}
