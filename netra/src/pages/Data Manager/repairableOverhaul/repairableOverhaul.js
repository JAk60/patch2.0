import React, { useEffect, useState } from "react";
import Coustom from "./coustom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import OverhaulTable from "../../../ui/Table/OverhaulTable";
import RepairableSubTable from "./repairableSubTable";
import FormControlLabel from "@material-ui/core/FormControlLabel";



const RepairableOverhaul = (props) => {
  const [secondTableData, setSecondTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("manual");
  const secondTableDataUpdate = (data, isUpdated = false) => {
    setSecondTableData(data);
  };

  const mainTableUpdate = (data) => {
    props?.tableUpdate(data, "overhauls");
  };

  return (
    <div style={{ marginTop: "5rem" }}>
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
          label="Manual data entry"
        />
        <FormControlLabel
          value="ship"
          control={<Radio />}
          label="Insert From another ship"
        />
      </RadioGroup>

      {selectedOption === "manual" && (
        <div>
          <RepairableSubTable secondTableDataUpdate={secondTableDataUpdate} />
          <OverhaulTable data={secondTableData} tableUpdate={mainTableUpdate} />
        </div>
      )}

      {selectedOption === "ship" && (
        <Coustom/>
      )}
    </div>
  );
};

export default RepairableOverhaul;
