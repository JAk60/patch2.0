import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import LensIcon from "@material-ui/icons/Lens";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "../DataManager.module.css";
const ImportData = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const rows = props.childList.map((x) => {
    return {
      id: x.id,
      ComponentName: x.name,
      ScaleParameter: "",
      ShapeParameter: "",
    };
  });
  console.log(rows,"rowsssss");
  const ImportColumns = [
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      minWidth={200}
      checkboxSelection={true}
      editable={false}
    />,
    <AgGridColumn
      field="ScaleParameter"
      headerName="Scale Parameter"
      minWidth={200}
      type="number"
      editable={true}
    />,
    <AgGridColumn
      field="ShapeParameter"
      headerName="Shape Parameter"
      minWidth={200}
      type="number"
      editable={true}
    />,
  ];

  const updateFinalRowData = (allRows) => {
    debugger;
    props.tableUpdate(allRows, "import_replacable");
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  return (
    <div>
      <Table
        columnDefs={ImportColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rows}
        tableUpdate={updateFinalRowData}
      />
      <div className={styles.tableFooter}>
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

export default ImportData;
