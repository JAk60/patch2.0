import React, { useEffect, useState } from "react";
import Custom from "./custom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import OverhaulTable from "../../../ui/Table/OverhaulTable";
import RepairableSubTable from "./repairableSubTable";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RepairableSubTableMaual from "./RepairableSubTableMaual";
import OverhaulEntryTable from "./OverhaulEntryTable";
import { useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import InfoIcon from "@material-ui/icons/Info";

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
			<div>
				<RadioGroup
					row
					aria-label="option"
					name="option"
					value={selectedOption}
					onChange={(e) => setSelectedOption(e.target.value)}
				>
					<FormControlLabel
						value="manual"
						control={<Radio />}
						label="Manual Data Entry"
					/>
					{/* <FormControlLabel
            value="cmms"
            control={<Radio />}
            label="Cmms Data Entry"
          /> */}
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

				{/* Tooltip Button */}

				{/* Dialog Box */}
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

				{selectedOption === "manual" && (
					<div>
						<RepairableSubTableMaual
							secondTableDataUpdate={secondTableDataUpdate}
						/>
						<OverhaulTable
							data={secondTableData}
							tableUpdate={mainTableUpdate}
						/>
					</div>
				)}

				{/* {selectedOption === "cmms" && (
          <div>
            <RepairableSubTable
              secondTableDataUpdate={secondTableDataUpdate}
            />
            <OverhaulTable
              data={secondTableData}
              tableUpdate={mainTableUpdate}
            />
          </div>
        )} */}

				{selectedOption === "ship" && <Custom />}
				{selectedOption === "overhaul_hours" && (
					<OverhaulEntryTable
						secondTableDataUpdate={secondTableDataUpdate}
						tableUpdate={mainTableUpdate}
					/>
				)}
			</div>
		</>
	);
};

export default RepairableOverhaul;
