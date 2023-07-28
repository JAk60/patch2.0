import React, { useState } from "react";
import OverhaulTable from "../../../ui/Table/OverhaulTable";
import RepairableSubTable from "./repairableSubTable";
const RepairableOverhaul = (props) => {
  const [secondTableData, setSecondTableData] = useState([]);
  // const [secondTableData, setSecondTableData] = useState(false);
  const secondTableDataUpdate = (data, isUpdated = false) => {
    setSecondTableData(data);
  };
  const mainTableUpdate = (data) => {
    props?.tableUpdate(data, "overhauls");
  };
  return (
    <div style={{ marginTop: "5rem" }}>
      <RepairableSubTable secondTableDataUpdate={secondTableDataUpdate} />
      <OverhaulTable data={secondTableData} tableUpdate={mainTableUpdate} />
    </div>
  );
};

export default RepairableOverhaul;
