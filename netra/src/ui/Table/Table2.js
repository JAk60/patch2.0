import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Table.css";


const Table2 = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const location = useLocation();
  console.log(location);
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  const onGridSizeChanged = (params) => {
    params.api.sizeColumnsToFit();
  };

  const saveModifiedRows = () => {
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    console.log(allRowData);
    // add API call to save modified rows
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        defaultColDef={{
          flex: 1,
          resizable: true,
          filter: true,
          sortable: true,
        }}
        rowData={props.rowData}
        columnDefs={props.columnDefs}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onGridSizeChanged={onGridSizeChanged}
        onCellValueChanged={saveModifiedRows}
      >
        {/* {props.columnDefs} */}
      </AgGridReact>
    </div>
  );
};

export default Table2;
