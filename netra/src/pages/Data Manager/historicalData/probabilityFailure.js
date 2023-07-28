import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "../DataManager.module.css";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(40),
      height: theme.spacing(5),
      background: "#048ee7",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
}));

function ProbabilityFailure(props) {
  const [gridApi, setGridApi] = useState(null);
  const classes = useStyles();
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });
  const [rowState, setRows] = useState([
    {
      id: rows[0].id,
      ComponentName: rows[0].name,
      Time: "120",
      FailureProbability: "10",
    },
  ]);

  const PFColumns = [
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      editable={true}
      minWidth={100}
      checkboxSelection={true}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: rows.map((x) => x.name),
      }}
    />,
    <AgGridColumn
      field="Time"
      headerName="Time (T<) hrs"
      editable={true}
      type="number"
    />,
    <AgGridColumn
      field="FailureProbability"
      headerName="Failure Probability"
      type="number"
      editable={true}
    />,
  ];

  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "prob");
  };
  const AddRow = () => {
    const defaultRow = [
      {
        id: rows[0].id,
        ComponentName: rows[0].name,
        Time: "120",
        FailureProbability: "10",
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  return (
    <div>
      <div className={classes.root}>
        <Paper elevation={3} variant="outlined">
          Probabilty of Failure
        </Paper>
      </div>
      <Table
        columnDefs={PFColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
      ></Table>
      <div className={styles.tableFooter}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="secondary"
          onClick={() => AddRow()}
        >
          Add Row
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={() => deleteRows()}
        >
          Delete Rows
        </Button>
      </div>
    </div>
  );
}

export default ProbabilityFailure;
