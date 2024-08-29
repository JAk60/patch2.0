import React, { useEffect, useState } from "react";
import NewModule from "../../components/module/NewModule";
import Navigation from "../../components/navigation/Navigation";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./MissionProfile.module.css";
import { AgGridColumn } from "ag-grid-react";
import Table from "../../ui/Table/DataManagerTable";
import { Button, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const SystemStyles = makeStyles({
  formControl: {
    margin: "2rem",
    minWidth: 200,
  },
  Submit: {
    margin: "2rem",
  },
  buttons: {
    minWidth: 150,
    marginLeft: 10,
    marginTop: 15,
    float: "right",
  },
});
const MissionProfile = (props) => {
  const SystemClasses = SystemStyles();
  const [gridApi, setGridApi] = useState(null);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Close",
      showSnackBar: false,
    });
  };
  const [missionData, setMissionData] = useState([]);
  // let finalTableData = [];
  const setFinalTableData = (d) => {
    setMissionData(d);
  };
  useEffect(() => {
    fetch("/mission_data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const mData = data;
        // const rowD = data.map((x) => () => {
        //   return {
        //     id: x["id"],
        //     missionName: x["missionName"],
        //     Harbour: x["Harbour"],
        //     elh: x["elh"],
        //     cruise: x["cruise"],
        //     ds: x["ds"],
        //     as: x["ask"],
        //   };
        // });
        setRows(mData);
        setMissionData(mData);
      });
  }, []);
  const [rowState, setRows] = useState([]);
  const MProfileColumns = [
    <AgGridColumn
      field="missionName"
      headerName="Mission Name"
      headerTooltip="Mission Name"
      width={250}
      checkboxSelection={true}
      editable={true}
    />,
    <AgGridColumn
      field="Harbour"
      headerName="Harbour"
      headerTooltip="Harbour"
      width={250}
      editable={true}
    />,
    <AgGridColumn
      field="elh"
      headerName="Entry Leaving Harbour"
      headerTooltip="Entry Leaving Harbour"
      width={250}
      editable={true}
    />,
    <AgGridColumn
      field="cruise"
      headerName="Cruise"
      headerTooltip="Cruise"
      width={250}
      editable={true}
    />,
    <AgGridColumn
      field="ds"
      headerName="Defense Station"
      headerTooltip="Defense Station"
      width={250}
      editable={true}
    />,
    <AgGridColumn
      field="as"
      headerName="Action Station"
      headerTooltip="Action Station"
      width={250}
      editable={true}
    />,
    <AgGridColumn
      field="tar_rel"
      headerName="Target Reliability"
      headerTooltip="Target Reliability"
      width={250}
      editable={true}
    />,
  ];

  const AddRow = () => {
    const defaultRow = [
      {
        id: uuidv4(),
        missionName: "Please Enter Mission Name",
        Harbour: 0,
        elh: 0,
        cruise: 0,
        ds: 0,
        as: 0,
        tar_rel: 0,
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    let allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    setMissionData(allRowData)
    // console.log(selectedRows);
  };

  //Save Button Handler
  const onSaveButtonClickHandler = () => {
    debugger;
    if (missionData.length > 0) {
      fetch("/mission_data", {
        method: "POST",
        body: JSON.stringify({
          mission_data: missionData,
          dtype: "insertMission",
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
        })
        .catch((error) => {
          setSnackBarMessage({
            severity: "error",
            message: "Some Error Occured. " + error,
            showSnackBar: true,
          });
        });
    } else {
      setSnackBarMessage((prevState) => {
        const data = {
          ...prevState,
          message: "This is error",
          showSnackBar: true,
        };
        return data;
      });
    }
  };

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        <div className={styles.module}>
          {/* <NewModule /> */}
        </div>
        <div className={styles.user}>
          <Button
            variant="contained"
            color="primary"
            className={SystemClasses.buttons}
            onClick={onSaveButtonClickHandler}
          >
            Save
          </Button>
        </div>
        {/* <div className={styles.user}><UserSelection /></div> */}
        <div className={styles.table}>
          <Table
            rowData={rowState}
            columnDefs={MProfileColumns}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
          />
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
              style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              onClick={() => deleteRows()}
            >
              Delete Rows
            </Button>
          </div>
        </div>
      </div>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};

export default MissionProfile;
