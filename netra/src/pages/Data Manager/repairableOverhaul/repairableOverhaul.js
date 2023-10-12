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



const RepairableOverhaul = (props) => {
  const [secondTableData, setSecondTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("manual");
  const secondTableDataUpdate = (data, isUpdated = false) => {
    console.log(data)
    setSecondTableData(data);
  };

  const mainTableUpdate = (data) => {
    console.log(data)
    if (data.mainTable.length == 0 && data.subTable[0].hasOwnProperty("nomenclature")) {
      props?.tableUpdate(data, "overhaul_age");
    } else {
      props?.tableUpdate(data, "overhauls");
    }
  };

  return (<>
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
      </RadioGroup>

      {selectedOption === "manual" && (
        <div>
          <RepairableSubTableMaual secondTableDataUpdate={secondTableDataUpdate} />
          <OverhaulTable data={secondTableData} tableUpdate={mainTableUpdate} />
        </div>
      )}

      {/* {selectedOption === "cmms" && (
        <div>
          <RepairableSubTable secondTableDataUpdate={secondTableDataUpdate} />
          <OverhaulTable data={secondTableData} tableUpdate={mainTableUpdate} />
        </div>
      )} */}

      {selectedOption === "ship" && (
        <Custom />
      )}
      {selectedOption === "overhaul_hours" && (
        <OverhaulEntryTable secondTableDataUpdate={secondTableDataUpdate} tableUpdate={mainTableUpdate} />
      )}
    </div>
  </>
  );
};

export default RepairableOverhaul;
