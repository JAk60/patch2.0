import { Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
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
    tableFooter: {
      float: "right",
    }
  },
}));

const Expert = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const classes = useStyles();
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });
  const rowState = [
    {
      id: rows[0]?.id,
      ComponentName: rows[0]?.name,
      MostLikely: "",
      MaxLife: "",
      MinLife: "",
      componentFailure: "",
      time_wo_failure: "",
    },
  ]

  const ExpertColumns = [
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      editable={true}
      width={200}
      checkboxSelection={true}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: rows.map((x) => x.name),
      }}
    />,
    <AgGridColumn
      field="MostLikely"
      headerName="Most Likely Life"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="MaxLife"
      headerName="Maximum Life"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="MinLife"
      headerName="Minimum Life"
      width={150}
      editable={true}
    />,
    // <AgGridColumn
    //   field="Replacements"
    //   headerName="No. of Replacements (Acknowledged by Expert)"
    //   editable={true}
    // />,
    <AgGridColumn
      field="componentFailure"
      headerName="Number of Component seen withour Failure"
      editable={true}
    />,
    <AgGridColumn
      field="time_wo_failure"
      headerName="Total time without Failure"
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "expert");
  };
  const AddRow = () => {
    const defaultRow = [
      {
        id: rows[0].id,
        ComponentName: rows[0].name,
        MostLikely: "",
        MaxLife: "",
        MinLife: "",
        componentFailure: "",
        time_wo_failure: "",
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
          Expert Judgement
        </Paper>
      </div>
      <Table
        columnDefs={ExpertColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
      ></Table>
      <div className={classes.tableFooter}>
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
};

export default Expert;
