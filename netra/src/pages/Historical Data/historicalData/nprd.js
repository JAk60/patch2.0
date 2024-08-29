import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      marginTop: theme.spacing(0),
      width: "50%",
      height: theme.spacing(5),
      color: "black",
      display: "flex",
      alignItems: "center",
    },
  },
  Info: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end"
  },
  tableFooter: {
    float: "right",
  }
}));

const NPRD = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [open, setOpen] = useState(false); // State for controlling dialog visibility
  const classes = useStyles();
  
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });

  const [rowState, setRows] = useState([
    {
      id: rows[0]?.id,
      ComponentName: rows[0]?.name,
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
      type="number"
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className={classes.Info}>
        <IconButton onClick={handleClickOpen} style={{color: "black"}}>
          <InfoIcon />
        </IconButton>

      </div>
      <Table
        columnDefs={NPRDColumns}
        rowData={rowState}
        setGrid={setGridApi}
        gridApi={gridApi}
        tableUpdate={updateFinalRowData}
      ></Table>
      <div className={classes.tableFooter}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="secondary"
          onClick={AddRow}
        >
          Add Row
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={deleteRows}
        >
          Delete Rows
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Information</DialogTitle>
          <DialogContent>
            *If the beta of the component is not known, use the following information:
            <br />
            1. If Failure of the component is observed in a narrow time window use beta(β) = 2.5
            <br />
            2. If Failure of the component is observed in a scattered time window use beta(β) = 1.5
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default NPRD;
