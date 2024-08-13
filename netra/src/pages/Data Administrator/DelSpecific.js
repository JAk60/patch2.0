import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import AdminInputs from "./AdminInputs";

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
  },
  autocomplete: {
    margin: "1rem",
    minWidth: 200,
  },
  deleteButton: {
    margin: "1rem",
  },
});

export default function DelSpecific() {
  const classes = useStyles();
  const [selectedDataType, setSelectedDataType] = useState("");
  const [gridData, setGridData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [table, setTable] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [snackBarMessage, setSnackBarMessage] = useState({
    severity: "success",
    message: "",
    showSnackBar: false,
  });

  // New state to manage the confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);

  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const componentsData = useSelector(
    (state) => state.userSelection.componentsData
  );

  const DataTypes = [
    {
      "Redundancy & Parallel Information": "redundancy_data",
      avoidColumns: ["component_id"],
    },
    {
      "Maintenance Information": "maintenance_configuration_data",
      avoidColumns: ["maintenance_id", "component_id"],
    },
    {
      "Failure Mode": "failure_modes",
      avoidColumns: ["component_id", "failure_mode_id"],
    },
    {
      "Duty Cycle": "duty_cycle",
      avoidColumns: ["component_id", "duty_cycle_id"],
    },
    { "Additional Information Info": "", avoidColumns: ["component_id"] },
    {
      "Operational Data": "operational_data",
      avoidColumns: ["component_id", "id"],
    },
    {
      "Overhaul Hours": "data_manager_overhauls_info",
      avoidColumns: ["component_id", "id"],
    },
    {
      "Overhaul Information": "data_manager_overhaul_maint_data",
      avoidColumns: [
        "component_id",
        "id",
        "overhaul_id",
        "associated_sub_system",
      ],
    },
    { "Alpha & Beta": "alpha_beta", avoidColumns: ["component_id", "id"] },
    {
      Sensor: "sensor_based_data",
      avoidColumns: [
        "component_id",
        "id",
        "equipment_id",
        "level",
        "data",
        "frequency",
      ],
    },
    {
      "Sensor Data": "parameter_data",
      avoidColumns: ["component_id", "id", "parameter_id"],
    },
  ];

  const DataTypeChange = (e, value) => {
    setSelectedDataType(value);

    const tableObject = DataTypes.find((item) => {
      const key = Object.keys(item)[0];
      return key === value;
    });

    const tableName = tableObject ? Object.values(tableObject)[0] : null;

    setTable(tableName);
  };

  const fetchData = async () => {
    const equipment = componentsData.find((item) => {
      return (
        item.nomenclature === currentSelection["nomenclature"] &&
        item.ship_name === currentSelection["shipName"]
      );
    });

    if (!equipment) {
      console.error("Equipment not found");
      return;
    }

    const values = {
      component_id: equipment?.id,
      table: table,
    };

    try {
      const response = await fetch("/getspecific_data", {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.code === 1) {
        const filteredColumns = data.columns.filter((column) => {
          const avoidColumns =
            DataTypes.find((item) => item[selectedDataType] === table)
              ?.avoidColumns || [];
          return !avoidColumns.includes(column.field);
        });

        setGridData(data.columnData);
        setColumns(filteredColumns);
        setSnackBarMessage({
          severity: "success",
          message: data.message,
          showSnackBar: true,
        });
      } else {
        setSnackBarMessage({
          severity: "error",
          message: data.message,
          showSnackBar: true,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackBarMessage({
        severity: "error",
        message: "Error fetching data",
        showSnackBar: true,
      });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = (rows) => {
    if (rows.length > 0) {
      handleOpenDialog();
      setSelectedRows(rows);
    }
  };

  const handleDeleteConfirmed = async () => {
    handleCloseDialog();

    for (const selectedRow of selectedRows) {
      const values = {
        table: table,
        component_id: selectedRow?.component_id,
        failure_mode: selectedRow?.failure_mode,
        value: selectedRow?.value,
        date: selectedRow?.date,
        operation_date: selectedRow?.operation_date,
      };

      try {
        // Perform deletion for each row
        const response = await fetch("/delspecific", {
          method: "POST",
          body: JSON.stringify({ values }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (data.code !== 1) {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
          return;
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        setSnackBarMessage({
          severity: "error",
          message: "Error deleting data",
          showSnackBar: true,
        });
        return;
      }
    }

    // After all deletions, fetch data and update UI
    fetchData();
    setSelectedRows([]);
  };

  const handleCheckboxChange = (row) => {
    const isSelected = selectedRows.includes(row);
    if (isSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow !== row)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const filteredGridData = gridData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <AdminInputs />
        <Autocomplete
          className={classes.autocomplete}
          options={DataTypes.map((data) => Object.keys(data)[0])}
          getOptionLabel={(option) => option}
          onChange={DataTypeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Information Type"
              variant="outlined"
            />
          )}
        />
        <Button
          className={classes.deleteButton}
          variant="contained"
          color="secondary"
          onClick={fetchData}
        >
          Fetch Information
        </Button>
      </div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchKeyword}
        onChange={handleSearchChange}
        style={{ margin: "0 5rem" }}
      />
      {filteredGridData.length > 0 ? (
        <Container>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.length === filteredGridData.length}
                    onChange={() => {
                      const allSelected =
                        selectedRows.length === filteredGridData.length;
                      if (allSelected) {
                        setSelectedRows([]);
                      } else {
                        setSelectedRows([...filteredGridData]);
                      }
                    }}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGridData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row)}
                      onChange={() => handleCheckboxChange(row)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      className={classes.deleteButton}
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(selectedRows)}
                    >
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      ) : (
        <Typography
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "90px",
          }}
        >
          Fill The Above Information
        </Typography>
      )}
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
