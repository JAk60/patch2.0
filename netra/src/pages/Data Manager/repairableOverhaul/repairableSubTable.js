import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import styles from "./repairable.module.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Button, TextField } from "@material-ui/core";
import { v4 as uuid } from "uuid";
const RepairableSubTable = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [secondRows, setSecondRows] = useState([]);
  const [numOverhaul, setNumOverhaul] = useState("1");
  const [gridColumnApi, setGridColumnApi] = useState(null);
  //   const location = useLocation();
  let secondRowHeight = 120;
  if (secondRows.length > 0 && secondRows.length > 2) {
    secondRowHeight = 200;
  }
  const onGridReady = (params) => {
    setGridApi(params.api);
    // props.setGrid(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };
  const numOverhaulColumns = [
    <AgGridColumn
      field="overhaulNum"
      headerName="Overhaul Number"
      headerTooltip="Overhaul Number"
      minWidth={500}
      //   editable={true}
    />,
    <AgGridColumn
      field="runAge"
      headerName="Performed at Running Age (hours)"
      headerTooltip="Performed at Running Age (hours)"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="numMaint"
      headerName="Total Maintenance Events in this Overhaul"
      headerTooltip="Total Maintenance Events in this Overhaul"
      width={500}
      editable={true}
    />,
  ];

  const onSubmitNumOverhaul = () => {
    let count = 1;
    const sRows = [];
    while (count <= +numOverhaul) {
      sRows.push({
        overhaulNum: count.toString(),
        runAge: 6000 * count,
        numMaint: 1,
        id: uuid(),
      });
      count = count + 1;
    }
    setSecondRows(sRows);
    props.secondTableDataUpdate(sRows);
  };

  const saveModifiedRows = (params) => {
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    console.log(allRowData);
    props.secondTableDataUpdate(allRowData, true);
  };

  return (
    <div>
      <div className={styles.numOverhaulParent}>
        <div className={styles.overhaulHaul}>
          <h2>Total Number of Overhauls performed on this Equipment :</h2>
          <TextField
            required
            id="outlined-required"
            label="Number of Overhauls"
            defaultValue="1"
            values={numOverhaul}
            onChange={(e) => {
              setNumOverhaul(e.target.value);
            }}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={onSubmitNumOverhaul}
            style={{ width: "8rem", height: "3rem", marginTop: "1rem" }}
          >
            Submit
          </Button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: secondRowHeight, width: "100%", marginBottom: "2rem" }}
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            resizable: true,
            filter: true,
            sortable: true,
          }}
          rowData={secondRows}
          // columnDefs={props.columnDefs}
          onGridReady={onGridReady}
          onCellValueChanged={saveModifiedRows}
        >
          {numOverhaulColumns}
        </AgGridReact>
      </div>
    </div>
  );
};

export default RepairableSubTable;
