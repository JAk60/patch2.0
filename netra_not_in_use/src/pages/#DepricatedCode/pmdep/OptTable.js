import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react';
import styles from './pm.module.css';

const OptTable = ({ columnDefs, rowData, height, name, setRowData }) => {
  const defaultColumnDefs = [
    { headerName: "Beta", field: "beta", editable: true },
    { headerName: "Eeta", field: "eeta", editable: true },
  ];
  const tableColumnDefs = columnDefs || defaultColumnDefs;

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
  const [tvals, setTvals] = useState([]);
  const [tval90, setTval90] = useState(0);
  const [tval110, setTval110] = useState(0);


  const classes = useStyles();
  const handleClose = () => {
    setOpen(false); // Close the dialog
    setRowData([])
    window.location.reload();

  };

  const handleT = (event) => {
    event.preventDefault();

    // Include the method value in the answers object
    const dataToSend = { ...rowData, method: name };
    console.log(dataToSend);

    // Send the answers to the Flask backend
    fetch("/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend[0]),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        if (name !== "risk_target") {
          console.log(data);
          setTval(data.t);
          setTval90(data.t - 0.1 * data.t);
          setTval110(data.t + 0.1 * data.t);
        }
        else {
          setTvals(data.t)
          console.log(tvals)
        }
        // Set the tableData state with the row data when the form is submitted

      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
    setOpen(true);
  }


  return (
    <div className="ag-theme-alpine" style={{ height: height, width: '100%', position: 'relative' }}>
      {console.log(rowData)}
      <AgGridReact
        columnDefs={tableColumnDefs}
        rowData={rowData}
        defaultColDef={{
          flex: 1,
          resizable: true,
          filter: true,
          sortable: true,
          editable: true,
        }}
      ></AgGridReact>
      <Button className={styles.btn} type="submit" variant="contained" color="primary" onClick={handleT}>Submit</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <div className={classes.dialogContainer}>
          <DialogTitle className={classes.dialogTitle}>Optimization Result</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            {name === "risk_target" ? (
              <div>
                <p>Optimized Time For Maintenance(t):</p>
                <table className={styles.optimizationTable}>
                  <thead>
                    <tr>
                      <th>Risk Level</th> {/* Add the extra column header */}
                      <th>Optimized Time</th>
                      <th>Lower Bound</th>
                      <th>Upper Bound</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvals.map((t, index) => (
                      <tr key={index}>
                        <td>{[.8, .85, .9, .95][index]}</td> {/* Add the extra column values */}
                        <td>{t.toFixed(4)}</td> {/* Round off to 4 decimal places */}
                        <td>{(t * 0.9).toFixed(4)}</td> {/* Round off to 4 decimal places */}
                        <td>{(t * 1.1).toFixed(4)}</td> {/* Round off to 4 decimal places */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <p>Optimized Time For Maintenance: {tval}</p>
                <p>Lower Bound: {tval90}</p>
                <p>Upper Bound: {tval110}</p>
              </div>
            )}

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

export default OptTable;
