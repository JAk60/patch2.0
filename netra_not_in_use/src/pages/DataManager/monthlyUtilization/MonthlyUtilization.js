import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Table from "../../../ui/Table/DataManagerTable";
import styles from "../DataManager.module.css";

const MonthlyUtilization = (props) => {
  const systemData = useSelector((state) => state.treeData.treeData);
  const [gridApi, setGridApi] = useState(null);
  const components = systemData.filter(x => x.parentId == null)
  const rows = components.map((element, index) => {
    return {
      id: element.id,
      Date: "August/2021",
      AverageRunning: "0",
    };
  })

  // const [rowData, setRows] = useState(rows)

  const OperationalColumns = [
    <AgGridColumn
      field="Date"
      headerName="Date"
      width={200}
      cellEditor="monthPicker"
      editable={true}
      checkboxSelection={true}
    />,
    <AgGridColumn
      field="AverageRunning"
      headerName="Monthly Utilization"
      headerTooltip="Monthly Utilization"
      width={200}
      editable={true}
    />
  ];

  const updateFinalRowData = (allRows) => {
    console.log(allRows)
    props.tableUpdate(allRows, "insertOpData");

  };
  const AddRow = () => {
    let newRowData = components.map((element, index) => {
      return {
        id: element.id,
        Date: "",
        AverageRunning: "0",
      };
    });
    gridApi.applyTransaction({
      add: newRowData,
    });
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
  };

  
  return (
    <div>
      <Table
        columnDefs={OperationalColumns}
        rowData={rows}
        setGrid={setGridApi}
        gridApi={gridApi}
        tableUpdate={updateFinalRowData}
        tableSize={350}
      ></Table>
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
          variant="contained"
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={() => deleteRows()}
        >
          Delete Rows
        </Button>
      </div>
    </div>
  );
};

export default MonthlyUtilization;