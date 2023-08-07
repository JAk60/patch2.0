import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { makeStyles } from "@material-ui/core/styles";
import styles from './pm.module.css';
import {  Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";

const GroupTable = ({ height, n, tData, columnDefs }) => {
  const useStyles = makeStyles((theme) => ({
    dialogContainer: {
      borderRadius: theme.spacing(2),
      padding: theme.spacing(2),
    },
    dialogTitle: {
      paddingBottom: theme.spacing(1),
    },
    dialogContent: {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
  }));
  const [open, setOpen] = useState(false);
  const [tval, setTval] = useState(0);
  const [tval90, setTval90] = useState(0);
  const [tval110, setTval110] = useState(0);

  const classes = useStyles();
  const handleClose = () => {
    setOpen(false); // Close the dialog
    setTableData([]);
    // window.location.reload();
  };
  // Generate row data with 'n' number of rows
  const rowData = [];
  for (let i = 1; i <= n; i++) {
    rowData.push({ id: i, component: `Component ${i}` });
  }

  // Modify the first column to be of type 'text'
  const modifiedColumnDefs = columnDefs.map((col, index) => {
    if (index === 0) {
      return { ...col, type: "text", editable: true };
    }
    return col;
  });

  // State to store the table data
  const [tableData, setTableData] = useState(rowData);
  console.log(tData);

  const handleOnClickSubmit = () => {
    const jsonData = tableData.reduce((result, row, index) => {
      const componentKey = `component_${index + 1}`;
      result[`${componentKey}_eeta`] = parseFloat(row.eeta);
      result[`${componentKey}_beta`] = parseFloat(row.beta);
      result[`${componentKey}_c`] = parseFloat(row.c);
      result[`${componentKey}_rt`] = parseFloat(row.rt);
      return result;
    }, {});
    const combinedData = {
      ...jsonData, // Spread the jsonData
      ...tData[0], // Spread the first element of the propData array
    };

    fetch("/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(combinedData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log(data);
        setTval(data.t);
        setTval90(data.t - 0.1 * data.t);
        setTval110(data.t + 0.1 * data.t);
        // Set the tableData state with the row data when the form is submitted
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
      setOpen(true);
      
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: height, width: "100%", position: "relative" }}
    >
      <AgGridReact
        columnDefs={modifiedColumnDefs}
        rowData={tableData}
        onCellValueChanged={(params) => {
          // Update the tableData state when a cell value is changed
          setTableData((prevData) =>
            prevData.map((row) =>
              row.id === params.data.id ? params.data : row
            )
          );
        }}
        defaultColDef={{
          flex: 1,
          resizable: true,
          filter: true,
          sortable: true,
          editable: true,
        }}
      ></AgGridReact>
      <Button className={styles.btn} type="submit" variant="contained" color="primary"  onClick={handleOnClickSubmit}>Submit</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <div className={classes.dialogContainer}>
              <DialogTitle className={classes.dialogTitle}>Optimization Result</DialogTitle>
              <DialogContent className={classes.dialogContent}>
                <p>t value: {tval}</p>
                <p>t value (90%): {tval90}</p>
                <p>t value (110%): {tval110}</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </div>
          </Dialog>
    </div>
  );
};

export default GroupTable;
