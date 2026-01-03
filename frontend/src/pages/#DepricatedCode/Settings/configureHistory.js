import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import Table from "../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import classes from "./configureHistory.module.css";
import Button from "@material-ui/core/Button";
import CustomSelect from "../../ui/Form/CustomSelect";
import { components } from "../../ui/userSelection/userSelectionData";
function ConfigureHistory() {
  const [gridApi, setGridApi] = useState(null);
  let finalTableData = [];
  const setFinalTableData = (d) => {
    finalTableData = d;
    if (finalTableData.length > 0) {
      console.log("Hi");
    }
  };
  const EPcolumnDefs = [
    <AgGridColumn
      field="SubSystemName"
      headerName="Sub System Name"
      width={50}
    />,
    <AgGridColumn
      field="ModuleName"
      headerName="Module Name"
      cellRenderer="slider"
    />,
    <AgGridColumn
      field="Action"
      headerName="Action"
      width={50}
      cellRenderer="redirectButton"
    />,
  ];
  const rowData = [
    {
      SubSystemName: "Fresh Water Cooling",
    },
  ];
  return (
    <div
      className={classes.background}
      style={{
        backgroundImage: "url(/wave.svg)",
      }}
    >
      <div className={classes.flex}>
        <Navigation />
        <div className={classes.table}>
          <div className={classes.button}>
            <Button variant="contained" color="primary">
              Configuration History
            </Button>
          </div>
          <div className={classes.dropdown}>
            <div>
              <CustomSelect
                style={{ width: "300px" }}
                id="platformname"
                label="Platform Name"
                fields={components}
              />
            </div>
            <div className={classes.spacing}>
              <CustomSelect
                style={{ width: "300px" }}
                id="systemname"
                label="System Name"
                fields={components}
              />
            </div>
            <div className={classes.submit}>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </div>
          <Table
            columnDefs={EPcolumnDefs}
            rowData={rowData}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
            rowHeight={80}
          ></Table>
        </div>
        <div className={classes.img}>
          <img src="/images/netra-logo-removebg.png" width={60} height={60} alt="Netra Logo" />
        </div>
      </div>
    </div>
  );
}
export default ConfigureHistory;
