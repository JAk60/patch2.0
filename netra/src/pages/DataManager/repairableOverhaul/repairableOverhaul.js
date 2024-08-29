import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import React, { useState } from "react";
import OverhaulTable from "../../../ui/Table/OverhaulTable";
import Custom from "./custom";
import OverhaulEntryTable from "./OverhaulEntryTable";
import RepairableSubTableMaual from "./RepairableSubTableMaual";

const useStyles = makeStyles((theme) => ({
	infoButton: {
		backgroundColor: "red",
		padding: theme.spacing(0.5),
		fontSize: "0.75rem", // smaller font size
		minWidth: "auto", // smaller button size
	},
}));
const RepairableOverhaul = (props) => {
	const [secondTableData, setSecondTableData] = useState([]);
	const [selectedOption, setSelectedOption] = useState("manual");
	const [openDialog, setOpenDialog] = useState(false); // State for controlling dialog visibility
	const classes = useStyles();
	const secondTableDataUpdate = (data, isUpdated = false) => {
		console.log(data);
		setSecondTableData(data);
	};

	const mainTableUpdate = (data) => {
		console.log(data);
		if (
			data.mainTable.length == 0 &&
			data.subTable[0].hasOwnProperty("nomenclature")
		) {
			props?.tableUpdate(data, "overhaul_age");
		} else {
			props?.tableUpdate(data, "overhauls");
		}
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<div className={classes.overhaul}>
				<RadioGroup
					row
					aria-label="option"
					name="option"
					value={selectedOption}
					style={{
						margin: "8px 2% 2px 4%",
						padding: "20px 20px 30px 20px",
						borderRadius: "10px",
						boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"
					}}
					onChange={(e) => setSelectedOption(e.target.value)}
				>
					<FormControlLabel
						value="manual"
						control={<Radio />}
						label="Manual Data Entry"
					/>
					<FormControlLabel
						value="ship"
						control={<Radio />}
						label="Insert From another ship"
					/>
					<FormControlLabel
						value="overhaul_hours"
						control={<Radio />}
						label="Insert Overhaul Hours"
					/>
					<Tooltip title="Click for more information">
						<Button
							style={{
								position: "absolute",
								top: 228,
								right: 10,
							}} // Set absolute position
							onClick={handleOpenDialog}
						>
							<InfoIcon />
						</Button>
					</Tooltip>
				</RadioGroup>
				{selectedOption === "manual" && (
					<div style={{ height: "100%" }}>
						<RepairableSubTableMaual
							secondTableDataUpdate={secondTableDataUpdate}
						/>
						<OverhaulTable
							data={secondTableData}
							tableUpdate={mainTableUpdate}
						/>
					</div>
				)}
				{selectedOption === "ship" && <Custom />}
				{selectedOption === "overhaul_hours" && (
					<OverhaulEntryTable
						secondTableDataUpdate={secondTableDataUpdate}
						tableUpdate={mainTableUpdate}
					/>
				)}
			</div>
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Information</DialogTitle>
				<DialogContent>
					<p>
						<strong>Manual Data Entry:</strong> Use it to
						manually enter corrective maintenance data. (Optional)
					</p>
					<p>
						<strong>Insert From another ship:</strong> If
						historical data for an equipment is not available
						for estimating the parameters, but performance of
						the equipment is similar to another equipment,
						"import from another equipment" option can be used
						to copy the parameter values.
					</p>
					<p>
						<strong>Insert Overhaul Hours:</strong> Use it to
						enter Time between two overhaul. (Compulsory)
					</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default RepairableOverhaul;
