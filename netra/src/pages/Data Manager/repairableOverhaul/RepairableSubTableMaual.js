import React, { useEffect, useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import styles from "./repairable.module.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Button, TextField, Typography } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";

const RepairableSubTableMaual = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [secondRows, setSecondRows] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [overhaulNums, setOverhaulNums] = useState("0");
  const currSelectedData = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const [currAge, setCurrAge] = useState("0");
  const currNomenclature = currSelectedData.nomenclature;
  const currShipName = currSelectedData.shipName;
  const currEquipmentName = currSelectedData.equipmentName;

  let secondRowHeight = 120;
  if (secondRows.length > 0 && secondRows.length > 2) {
    secondRowHeight = 200;
  }
  const onGridReady = (params) => {
    setGridApi(params.api);
    // props.setGrid(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };
  const numOverhaulColumns = [
    <AgGridColumn
      field="overhaulNum"
      headerName="Overhaul Number"
      headerTooltip="Overhaul Number"
      minWidth={500}
    //   editable={true}
    />,
    <AgGridColumn
      field="runAge"
      headerName="Performed at Running Age (hours)"
      headerTooltip="Performed at Running Age (hours)"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="numMaint"
      headerName="Total Maintenance Events in this Overhaul"
      headerTooltip="Total Maintenance Events in this Overhaul"
      width={500}
      editable={true}
    />,
  ];

  const onSubmitNumOverhaul = () => {
    let count = 1;
    const sRows = [];

    // fetch('/component_overhaul_age', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({age: runAge}),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Handle the response data here
    //     console.log(data.overhaul_nums)
    //     setOverhaulNums(data.overhaul_nums)
    //     console.log(overhaulNums)
    //   })
    //   .catch(error => {
    //     // Handle errors here
    //     console.error('Error:', error);
    //   });


    while (count <= +overhaulNums) {
      sRows.push({
        overhaulNum: count.toString(),
        runAge: currAge,
        numMaint: 1,
        id: uuid(),
      });
      count = count + 1;
    }
    setSecondRows(sRows);
    props.secondTableDataUpdate(sRows);
  };


  const saveModifiedRows = (params) => {
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    console.log(allRowData);
    props.secondTableDataUpdate(allRowData, true);
  };

  useEffect(() => {
    if (currNomenclature) {
      const payload = {
        ship_name: currShipName,
        equipment_name: currEquipmentName,
        nomenclature: currNomenclature,
      };
      fetch("/get_overhaul_hours", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.code) {
            setCurrAge(data.result);
          } else {
            setCurrAge("0");
          }
        });
    } else {
      // Handle the case when currNomenclature is null or empty
      setCurrAge("0"); // Reset currAge to "0"
    }
  }, [currNomenclature]);

  return (
    <div>
      <div className={styles.numOverhaulParent}>
        <div className={styles.overhaulHaul}>
          <Typography variant="h5" className={styles.formTitle}>
            Number of Overhauls:
          </Typography>
          <TextField
            required
            id="outlined-required"
            // label="Number of Overhauls"
            // defaultValue="6000"
            value={overhaulNums}
            onChange={(e) => {
              setOverhaulNums(e.target.value);
            }}
            className={styles.formInput}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={onSubmitNumOverhaul}
            className={styles.submitButton}
          >
            Submit
          </Button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: secondRowHeight, width: "100%", marginBottom: "2rem" }}
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            resizable: true,
            filter: true,
            sortable: true,
          }}
          rowData={secondRows}
          // columnDefs={props.columnDefs}
          onGridReady={onGridReady}
          onCellValueChanged={saveModifiedRows}
        >
          {numOverhaulColumns}
        </AgGridReact>
      </div>
    </div>
  );
};

export default RepairableSubTableMaual;