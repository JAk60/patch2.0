import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../../store/TreeDataStore";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import Table from "../../../ui/Table/Table";
import SelectEquipment from "../selectEquipment/selectEquipment";

const ParameterStyles = makeStyles({
  dropdown: {
    display: "flex",
    alignItems: "center",
    margin: "2rem 0 2rem 4%"
  },
  tableContainer: {
    marginLeft: "4%",
    marginRight: "2%",
  },
  tableTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#333"
  }
});

function ParameterEstimation(props) {
  const [gridApiAlpha, setGridApiAlpha] = useState(null);
  const [gridApiEta, setGridApiEta] = useState(null);
  const [selectedEquipmentList, setSelectedEquipmentList] = useState([]);
  const [alphaBetaRows, setAlphaBetaRows] = useState([]);
  const [etaBetaRows, setEtaBetaRows] = useState([]);
  const dispatch = useDispatch();
  const ParameterClasses = ParameterStyles();

  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systems",
      showSnackBar: false,
    });
  };

  // Alpha-Beta columns (default/repairable)
  const alphaBetaColumns = [
    <AgGridColumn
      key="EquipmentName-alpha"
      colId="EquipmentName"
      field="EquipmentName"
      headerName="Equipment Name"
      minWidth={200}
      editable={false}
    />,
    <AgGridColumn
      key="alpha"
      colId="alpha"
      field="alpha"
      headerName="Alpha"
      minWidth={200}
      type="number"
      editable={false}
    />,
    <AgGridColumn
      key="beta-alpha"
      colId="beta"
      field="beta"
      headerName="Beta"
      minWidth={200}
      type="number"
      editable={false}
    />,
  ];

  // Eta-Beta columns (replaceable)
  const etaBetaColumns = [
    <AgGridColumn
      key="EquipmentName-eta"
      colId="EquipmentName"
      field="EquipmentName"
      headerName="Equipment Name"
      minWidth={200}
      editable={false}
    />,
    <AgGridColumn
      key="eta"
      colId="eta"
      field="eta"
      headerName="Eta"
      minWidth={200}
      type="number"
      editable={false}
    />,
    <AgGridColumn
      key="beta-eta"
      colId="beta"
      field="beta"
      headerName="Beta"
      minWidth={200}
      type="number"
      editable={false}
    />,
  ];

  const onHandleSubmitClick = () => {
    // Initialize with blank alpha-beta columns as default
    const rowD = selectedEquipmentList.map((ele) => {
      return {
        id: ele.id,
        EquipmentName: ele.nomenclature,
        alpha: "-",
        beta: "-",
      };
    });

    setAlphaBetaRows(rowD);
    setEtaBetaRows([]); // Clear eta-beta table
    dispatch(treeDataActions.setP(selectedEquipmentList));
    console.log(rowD);
  };

  const onUpdateSelectedEquipmentList = (d) => {
    setSelectedEquipmentList(d);
  };

  const updateFinalRowData = (allRows) => {
    console.log("This");
    console.log(allRows);
  };

  const onHandleUpdateEtaBetaDB = () => {
    console.log({
      data: [...alphaBetaRows, ...etaBetaRows],
    });

    // Combine all rows for the API call
    const allRows = alphaBetaRows.length > 0 ? alphaBetaRows : etaBetaRows;

    fetch("/api/update_parameters", {
      method: "POST",
      body: JSON.stringify({
        data: allRows,
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
        console.log(data);

        if (data == null || data.length === 0) {
          setSnackBarMessage({
            severity: "error",
            message: "No Parameters data found",
            showSnackBar: true,
          });
          return;
        }

        // Separate data into alpha-beta and eta-beta
        const alphaData = [];
        const etaData = [];
        let noDataCount = 0;

        data.forEach(row => {
          if (row.message === "No parameter data found") {
            noDataCount++;
            // Add to alpha table with message
            alphaData.push(row);
          } else if (row.hasOwnProperty('alpha')) {
            alphaData.push(row);
          } else if (row.hasOwnProperty('eta')) {
            etaData.push(row);
          }
        });

        // Update both tables
        setAlphaBetaRows(alphaData);
        setEtaBetaRows(etaData);

        // Show appropriate message
        if (noDataCount === data.length) {
          setSnackBarMessage({
            severity: "error",
            message: "No parameter data found for any component",
            showSnackBar: true,
          });
        } else if (noDataCount > 0) {
          setSnackBarMessage({
            severity: "warning",
            message: `Parameters retrieved. ${noDataCount} component(s) have no data`,
            showSnackBar: true,
          });
        } else {
          setSnackBarMessage({
            severity: "success",
            message: "Parameters Retrieved Successfully",
            showSnackBar: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSnackBarMessage({
          severity: "error",
          message: "Error Occurred During Fetching Parameters",
          showSnackBar: true,
        });
      });
  };

  return (
    <div>
      <div className={ParameterClasses.dropdown}>
        <div>
          <SelectEquipment
            list={props.list}
            onUpdateSelectedEquipmentList={onUpdateSelectedEquipmentList}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={onHandleSubmitClick}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={onHandleUpdateEtaBetaDB}
          >
            Get Parameters
          </Button>
        </div>
      </div>

      {/* Alpha-Beta Table (Repairable Components) */}
      <div className={ParameterClasses.tableContainer}>
        {alphaBetaRows.length > 0 && (
          <Table
            columnDefs={alphaBetaColumns}
            setGrid={setGridApiAlpha}
            gridApi={gridApiAlpha}
            rowData={alphaBetaRows}
            tableUpdate={updateFinalRowData}
            height={120}
          />

        )}
        {/* Eta-Beta Table (Replaceable Components) */}
        {etaBetaRows.length > 0 && (
          <Table
            columnDefs={etaBetaColumns}
            setGrid={setGridApiEta}
            gridApi={gridApiEta}
            rowData={etaBetaRows}
            tableUpdate={updateFinalRowData}
            height={120}
          />
        )}
      </div>

      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </div>
  );
}

export default ParameterEstimation;