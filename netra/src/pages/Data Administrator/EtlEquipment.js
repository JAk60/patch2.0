import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

export default function EtlEquipment({ classes }) {
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const ships = useSelector(
    (state) => state.userSelection.userSelection.shipName
  );
  console.log(ships);
  const componentsData = useSelector(
    (state) => state.userSelection.componentsData
  );
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tableData, setTableData] = useState([]);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });

  const fetchData = async () => {
    // Implement your fetch logic here, replace the URL with your actual API endpoint
    try {
      const response = await fetch("/equipment_onship", {
        method: "POST",
        body: JSON.stringify({
          shipName: currentSelection["shipName"],
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.code === 1) {
        setTableData(data.equipments);
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

  const handleEtlAction = async (row, enable) => {
    console.log(row);
    try {
      const response = await fetch("/set_equip_etl", {
        method: "POST",
        body: JSON.stringify({
          shipName: currentSelection["shipName"],
          nomenclature: row?.nomenclature,
          enabled: enable, // true for enable, false for disable
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      const data = await response.json();
      console.log(data);
      if (data.code === 1) {
        setTableData(data.equipments);
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
    fetchData();
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const filteredTableData = tableData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  );
  const ShipChange = (e, value) => {
    const data = { shipName: value };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        margin: "0 5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Autocomplete
          className={classes.autocomplete}
          options={ships}
          getOptionLabel={(option) => option}
          onChange={ShipChange}
          renderInput={(params) => (
            <TextField {...params} label="Ship Name" variant="outlined" />
          )}
        />
        <Button
          className={classes.deleteButton}
          variant="contained"
          color="secondary"
          onClick={fetchData}
        >
          Fetch Equipment
        </Button>
      </div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchKeyword}
        onChange={handleSearchChange}
        style={{ margin: "0 1rem" }}
      />
      <container>
        <Table>
          <TableHead>
            <TableRow>
              {/* Add your table headers here */}
              <TableCell>Equipment Name</TableCell>
              <TableCell>Nomenclature</TableCell>
              <TableCell>Transfer Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTableData.map((row) => (
              <TableRow key={row.component_name}>
                {/* Add your table cells here */}
                <TableCell>{row.component_name}</TableCell>
                <TableCell>{row.nomenclature}</TableCell>
                <TableCell>
                  {row.etl === true ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    row.etl === false  && <ClearIcon style={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell style={{display: "flex"}}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEtlAction(row,true)}
                    style={{marginRight: "10px"}}
                    disabled={row.etl}
                  >
                    Enable Transfer
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEtlAction(row,false)}
                    disabled={!row.etl}
                  >
                    Disable Transfer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </container>
    </div>
  );
}
