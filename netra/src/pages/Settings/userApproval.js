import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import Table from "../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import classes from "./userApproval.module.css";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

function UserApproval() {
  const [gridApi, setGridApi] = useState(null);
  const [rowState, setRows] = useState([
    {
      Name: "Bhupendra Singh",
      Email: "xyz@gmail.com",
      PermissionLevel: "L1",
      Status: "Pending",
    },
  ]);
  let finalTableData = [];
  const setFinalTableData = (d) => {
    finalTableData = d;
    if (finalTableData.length > 0) {
      console.log("Hi");
    }
  };
  const UAcolumns = [
    <AgGridColumn
      field="Name"
      headerName="Name"
      width={200}
      editable={true}
      checkboxSelection={true}
    />,
    <AgGridColumn
      field="Email"
      headerName="Email Address"
      width={300}
      editable={true}
    />,
    <AgGridColumn
      field="PermissionLevel"
      headerName="Permission Level"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["L1", "L2", "L3"] }}
      type="200"
      width={200}
      editable={true}
    />,
    <AgGridColumn
      field="Status"
      headerName="Status"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Approved", "Pending"] }}
      type="200"
      width={200}
      editable={true}
    />,
  ];
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    console.log(selectedRows);
  };
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
              User Authentication | Account Request
            </Button>
          </div>
          <Table
            columnDefs={UAcolumns}
            rowData={rowState}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
          ></Table>
           <div className={classes.footer}>
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
        <div className={classes.img}>
          <img src="/netra-logo-removebg.png" width={60} height={60} />
        </div>
      </div>
    </div>
  );
}
export default UserApproval;
