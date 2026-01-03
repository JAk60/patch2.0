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
      marginTop: theme.spacing(0),
      // width:
      width: "50%",
      height: theme.spacing(5),
      // background: "#048ee7",
      color: "black",
      display: "flex",
      alignItems: "center",
      // justifyContent: "center",
    },
  },
}));

const NPRD = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const classes = useStyles();
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });
  const [rowState, setRows] = useState([
    {
      id: rows[0].id,
      ComponentName: rows[0].name,
      FailureRate: "2",
      Beta: "2",
    },
  ]);

  const NPRDColumns = [
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
      field="FailureRate"
      headerName="Failure Rate"
      editable={true}
    />,
    <AgGridColumn
      field="Beta"
      headerName="β - Shape Parameter"
      type="nmber"
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "nprd");
  };

  const AddRow = () => {
    const defaultRow = [
      {
        id: rows[0].id,
        ComponentName: rows[0].name,
        FailureRate: "2",
        Beta: "2",
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
        <h5>
          *If the beta of the component is not known, use the following
          information: <br />
          1. If Failure of the component is observed in narrow time window use
          beta(β) = 2.5 <br />
          2. If Failure of the component is observed in scattered time window
          use beta(β) = 1.5
        </h5>
      </div>
      <Table
        columnDefs={NPRDColumns}
        rowData={rowState}
        setGrid={setGridApi}
        gridApi={gridApi}
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
};

export default NPRD;
