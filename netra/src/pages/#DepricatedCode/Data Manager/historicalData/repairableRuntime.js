import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../DataManager.module.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(30),
      height: theme.spacing(5),
      background: "#048ee7",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
}));

function RepairableRuntime(props) {
  const [gridApi, setGridApi] = useState(null);
  const classes = useStyles();
  const [rowState, setRows] = useState([
    {
      ComponentName: "",
      MonthlyRunTime: "",
    },
  ]);

  const RuntimeColumns = [
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      editable={true}
      width={200}
      checkboxSelection={true}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Pressure Cap", "Tank", "Water Pump Mounting Support"],
      }}
    />,
    <AgGridColumn
      field="MonthlyRunTime"
      headerName="Monthly Run Time"
      type="number"
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };

  return (
    <div>
      <div className={classes.root}>
        <Paper elevation={3} variant="outlined">
          Repairable Runtime
        </Paper>
      </div>
      <Table
        columnDefs={RuntimeColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
      ></Table>
    </div>
  );
}

export default RepairableRuntime;
