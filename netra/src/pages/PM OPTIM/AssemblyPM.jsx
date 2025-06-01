import { useState } from "react";
import { useSelector } from "react-redux";
import { getQuestions } from "../#DepricatedCode/pmdep/Data";
import Navigation from "../../components/navigation/Navigation";
import AdminInputs from "./AdminInputs";
import OptiQ from "./OptiQ";
import styles from "./pm.module.css";

const AssemblyPM = () => {
	const [selectedOption, setSelectedOption] = useState("option6");
	const [currQ, setCurrQ] = useState({
		columns: ["beta", "eeta"],
		name: "risk_target",
	}); // Initialize with default
	const SelectedEqId = useSelector((state) => state.treeData.treeData);
	const [eta, setEta] = useState(0);
	const [beta, setBeta] = useState(0);

	const HandleSubmit = () => {
		const componentId = SelectedEqId[0]?.id;

		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ component_id: componentId }),
		};

		fetch("/fetch_eta_beta", requestOptions)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Network response was not ok: ${response.status}`
					);
				}
				return response.json();
			})
			.then((data) => {
				// Process the fetched data (eta and beta values)
				const eta = data.eta;
				const beta = data.beta;
				setEta(data.eta);
				setBeta(data.beta);
				console.log(`ETA: ${eta}, BETA: ${beta}`);
			})
			.catch((error) => {
				// Handle errors
				console.error("Fetch error:", error);
			});
	};

	// Function to map dropdown selections to option values
	const handleSelectionChange = (optimizationType, optimizationSubtype) => {
		let optionValue = "option6"; // default

		// Map the combinations to option values
		if (
			optimizationType === "Risk Based Replacement" &&
			optimizationSubtype === "Risk based"
		) {
			optionValue = "option6";
		} else if (
			optimizationType === "Age Based Replacement" &&
			optimizationSubtype === "Cost Criterion"
		) {
			optionValue = "option1";
		} else if (
			optimizationType === "Age Based Replacement" &&
			optimizationSubtype === "Downtime Criterion"
		) {
			optionValue = "option2";
		} else if (
			optimizationType === "Calendar Time Based Replacement(Group)" &&
			optimizationSubtype === "Cost Criterion"
		) {
			optionValue = "option3";
		} else if (
			optimizationType === "Calendar Time Based Replacement(Group)" &&
			optimizationSubtype === "Downtime Criterion"
		) {
			optionValue = "option4";
		} else if (
			optimizationType === "Calendar Time Based Replacement" &&
			optimizationSubtype === "Cost Criterion"
		) {
			optionValue = "option5";
		} else if (
			optimizationType === "Calendar Time Based Replacement" &&
			optimizationSubtype === "Downtime Criterion"
		) {
			optionValue = "option7";
		}

		// Update the selected option and corresponding currQ
		setSelectedOption(optionValue);

		// Update currQ based on the option
		switch (optionValue) {
			case "option1":
				setCurrQ({
					columns: ["beta", "eta", "cf", "cp"],
					name: "age_based",
				});
				break;
			case "option2":
				setCurrQ({
					columns: ["beta", "eta", "df", "dp"],
					name: "downtime_based",
				});
				break;
			case "option3":
				setCurrQ({
					columns: ["component", "beta", "eeta", "c", "rt"],
					name: "component_group",
				});
				break;
			case "option4":
				setCurrQ({
					columns: ["component", "beta", "eeta", "rt"],
					name: "downtime_component_group",
				});
				break;
			case "option5":
				setCurrQ({
					columns: ["beta", "eeta", "cf", "cp"],
					name: "calendar_time",
				});
				break;
			case "option6":
				setCurrQ({ columns: ["beta", "eeta"], name: "risk_target" });
				break;
			case "option7":
				setCurrQ({
					columns: ["beta", "eeta", "df", "dp"],
					name: "calender_downtime",
				});
				break;
			default:
				setCurrQ({ columns: ["beta", "eeta"], name: "risk_target" });
				break;
		}
	};

	return (
		<>
			<Navigation />
			<div className={styles.flex}>
				<AdminInputs
					HandleSubmit={HandleSubmit}
					onSelectionChange={handleSelectionChange}
				/>

				{selectedOption && (
					<OptiQ
						option={selectedOption}
						currQ={currQ}
						name={currQ?.name || "risk_target"}
						questions={getQuestions(selectedOption)}
						eta={eta}
						beta={beta}
					/>
				)}
			</div>
		</>
	);
};

export default AssemblyPM;
