import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

export default function EtlEquipment({ classes }) {
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );

  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shipsOptions, setShipOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const [loading, setLoading] = useState(false); // New state for the loader
  useEffect(() => {
    const fetchD = async () => {
      try {
        const response = await fetch("/api/fetch_user_selection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          console.error("Error fetching user selection data");
          return;
        }
        const data = await response.json();
        const userData = data["data"];
        const eqData = data["eqData"];
        const uniqueDepartmentsSet = new Set(
          eqData.map((item) => item.department)
        );
        const uniqueDepartments = Array.from(uniqueDepartmentsSet);
        setDepartmentOptions(uniqueDepartments);
        let shipName = userData.map((x) => x.shipName);
        console.log(uniqueDepartments);
        shipName = [...new Set(shipName)];
        setShipOptions(shipName);
        const components = data["uniq_eq_data"];
        dispatch(
          userActions.onFirstLoad({
            filteredData: { shipName: shipName },
            componentsData: components,
          })
        );
      } catch (error) {
        console.error("Error in fetching user selection data:", error);
      }
    };

    fetchD();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/equipment_onship", {
        method: "POST",
        body: JSON.stringify({
          shipName: currentSelection["shipName"],
          department: currentSelection["department"],
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
          severity: "success",
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
      const response = await fetch("/api/set_equip_etl", {
        method: "POST",
        body: JSON.stringify({
          shipName: currentSelection["shipName"],
          nomenclature: row?.nomenclature,
          enabled: enable,
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
          severity: "success",
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

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/srcetl", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (data.code === 1) {
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
      console.error("Error updating data:", error);
      setSnackBarMessage({
        severity: "error",
        message: "Error updating data",
        showSnackBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const filteredTableData = tableData
    // Remove duplicate entries
    .filter(
      (row, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r.component_name === row.component_name &&
            r.nomenclature === row.nomenclature
        )
    )
    // Apply search filter
    .filter((row) => {
      const searchString = searchKeyword.toLowerCase();
      const matchesComponentName = row.component_name
        .toLowerCase()
        .includes(searchString);
      const matchesNomenclature = row.nomenclature
        .toLowerCase()
        .includes(searchString);

      // Filter based on component name, then only apply nomenclature filter if necessary
      return (
        matchesComponentName || (!matchesComponentName && matchesNomenclature)
      );
    });

  const ShipChange = (e, value) => {
    const data = { shipName: value };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const departmentChange = (e, value) => {
    const data = { department: value };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
    setTableData([]);
  };

  useEffect(() => {
    setTableData([]);
    setSearchKeyword("");
  }, [currentSelection.department, currentSelection.shipName]);
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Close",
      showSnackBar: false,
    });
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
          options={shipsOptions}
          getOptionLabel={(option) => option}
          onChange={ShipChange}
          renderInput={(params) => (
            <TextField {...params} label="Ship Name" variant="outlined" />
          )}
        />
        <Autocomplete
          className={classes.autocomplete}
          options={departmentOptions}
          getOptionLabel={(option) => option}
          onChange={departmentChange}
          renderInput={(params) => (
            <TextField {...params} label="Department" variant="outlined" />
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
        <Button
          className={classes.deleteButton}
          variant="contained"
          color="secondary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} style={{ marginLeft: "10px" }} />
          ) : (
            "Update now"
          )}
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
              <TableCell>Equipment Name</TableCell>
              <TableCell>Nomenclature</TableCell>
              <TableCell>Transfer Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTableData.map((row) => (
              <TableRow key={row.component_name}>
                <TableCell>{row.component_name}</TableCell>
                <TableCell>{row.nomenclature}</TableCell>
                <TableCell>
                  {row.etl === true ? (
                    <CheckIcon style={{ color: "green" }} />
                  ) : (
                    row.etl === false && <ClearIcon style={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell style={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEtlAction(row, true)}
                    style={{ marginRight: "10px" }}
                    disabled={row.etl}
                  >
                    Enable Transfer
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEtlAction(row, false)}
                    disabled={!row.etl}
                  >
                    Disable Transfer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {SnackBarMessage.showSnackBar && (
          <CustomizedSnackbars
            message={SnackBarMessage}
            onHandleClose={onHandleSnackClose}
          />
        )}
      </container>
    </div>
  );
}
