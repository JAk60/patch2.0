import React, { useState } from "react";
import Navigation from "../../../components/navigation/Navigation";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import classes from "./editProfile.module.css";
import Button from "@material-ui/core/Button";
import PassModal from "../ChangePassword";

function EditProfile() {
  const [gridApi, setGridApi] = useState(null);
  const [passModal, setPassModal] = useState(false)
  let finalTableData = [];
  const setFinalTableData = (d) => {
    finalTableData = d;
    if (finalTableData.length > 0) {
      console.log("Hi");
    }
  };
  const onPassClick=()=>{
    setPassModal(true)
  }

  const handlePassOpen = () => {
    setPassModal(true);
  };

  const handlePassClose = () => {
    setPassModal(false);
  };

  const EPcolumnDefs = [
    <AgGridColumn field="Name" headerName="Name" width={200} />,
    <AgGridColumn
      field="Email"
      headerName="Email Address"
      width={300}
    />,
    <AgGridColumn 
    field="Action" 
    headerName="Action" 
    width={200} 
    cellRenderer='updateButton'
    cellRendererParams={{ onClick: onPassClick }}
    />,
  ];
  const rowData = [
    {
      Name: "Bhupendra Singh",
      Email: "xyz@gmail.com",
      Action: "",
    },
  ];
  return (
    <div
      className={classes.background}
      style={{
        backgroundImage: "url(/wave.svg)",
      }}
    >
      <PassModal passModal={passModal} handlePassClose={handlePassClose} handlePassOpen={handlePassOpen}/>
      <div className={classes.flex}>
        <Navigation />
        <div className={classes.table}>
          <div className={classes.button}>
            <Button variant="contained" color="primary">
              User Authentication | Forgot Password Request
            </Button>
          </div>
          <Table
            columnDefs={EPcolumnDefs}
            rowData={rowData}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
            rowHeight={50}
          ></Table>
        </div>
        <div className={classes.img}>
          <img src="/netra-logo-removebg.png" width={60} height={60} />
        </div>
      </div>
    </div>
  );
}
export default EditProfile;
