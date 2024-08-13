import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./Table.css";
import { getDatePicker } from "./DataManagerTable";
import ReactDom from "react-dom";
import { TextField, Typography } from "@material-ui/core";

// function getDatePicker() {
//   function Datepicker() {}
//   Datepicker.prototype.init = function (params) {
//     this.eInput = document.createElement("input");
//     this.eInput.value = params.value;
//     this.eInput.classList.add("ag-input");
//     this.eInput.style.height = "100%";
//     $(this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
//     console.log(params);
//   };
//   Datepicker.prototype.getGui = function () {
//     return this.eInput;
//   };
//   Datepicker.prototype.afterGuiAttached = function () {
//     this.eInput.focus();
//     this.eInput.select();
//   };
//   Datepicker.prototype.getValue = function () {
//     return this.eInput.value;
//   };
//   Datepicker.prototype.destroy = function () {};
//   Datepicker.prototype.isPopup = function () {
//     return false;
//   };
//   return Datepicker;
// }

// const getDatePicker = () => {
//   const fillZeros = (a) => {
//     return Number(a) < 10 ? "0" + a : a;
//   };
//   const getFormattedDateOutput = (dateString) => {
//     const dateParse = new Date(dateString);
//     const dd = dateParse.getDate();
//     const mm = dateParse.getMonth() + 1; //January is 0!
//     const yyyy = dateParse.getFullYear();
//     // console.log(dateString, dateParse);
//     return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
//   };
//   function Datepicker() {}
//   Datepicker.prototype.init = function (params) {
//     this.textInput = React.createRef();
//     const getFormattedDateMaterial = (dateString) => {
//       const dateParse = new Date(
//         dateString.split("/")[2] +
//           "-" +
//           dateString.split("/")[1] +
//           "-" +
//           dateString.split("/")[0]
//       );
//       const dd = dateParse.getDate();
//       const mm = dateParse.getMonth() + 1; //January is 0!
//       const yyyy = dateParse.getFullYear();
//       console.log(dateString, dateParse);
//       return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
//     };
//     const eInput = React.createElement(TextField, {
//       type: "datetime-local",
//       defaultValue: getFormattedDateMaterial(params.value),
//       ref: this.textInput,
//       style: { width: "95%" },
//     });
//     this.div = document.createElement("div");
//     this.div.className = "ag-cell-parent-append";
//     ReactDom.render(eInput, this.div);
//   };
//   Datepicker.prototype.getGui = function () {
//     return this.div;
//   };
//   Datepicker.prototype.afterGuiAttached = function () {
//     this.textInput.current.focus();
//   };
//   Datepicker.prototype.getValue = function () {
//     return getFormattedDateOutput(
//       this.textInput.current.querySelector("input").value
//     );
//   };
//   Datepicker.prototype.destroy = function () {};
//   Datepicker.prototype.isPopup = function () {
//     return false;
//   };
//   return Datepicker;
// };

const Table = ({tableUpdate,rowData,columnDefs,height=400,getRowStyle}) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const location = useLocation();
  const onGridReady = (params) => {
    setGridApi(params.api);
    // props.setGrid(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };
  // useEffect(()=>{
  //   gridApi.setColumnDefs(columnDefs)
  // },[columnDefs])

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
    const allRowData = [];
    params.api.forEachNode((node) => allRowData.push(node.data));
    debugger;
    tableUpdate(allRowData);
  };
  const onGridSizeChanged = (params) => {
    params.api.sizeColumnsToFit();
  };
console.log(rowData)
  const saveModifiedRows = (params) => {
    debugger;
    let currentlocation = location.pathname;

    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    if (
      currentlocation === "/system_config/redundancy_info" ||
      currentlocation === "/system_config/failure_mode" ||
      currentlocation === "/system_config/additional_info"
    ) {
      tableUpdate(allRowData, params.data.id);
    } else {
      tableUpdate(allRowData);
    }
    console.log(allRowData);
    // add API call to save modified rows
  };

  return (
    <div className="ag-theme-alpine" style={{ height: height, width: "100%" }}>
      {/* <Typography variant="h1"> */}
      <AgGridReact
        defaultColDef={{
          flex: 1,
          resizable: true,
          filter: true,
          sortable: true,
        }}
        rowData={rowData}
        // columnDefs={props.columnDefs}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onGridSizeChanged={onGridSizeChanged}
        onCellValueChanged={saveModifiedRows}
        tooltipShowDelay="0"
        components={{
          datePicker: getDatePicker(),
        }}
        getRowStyle={getRowStyle}
      >
        {columnDefs}
      </AgGridReact>
      {/* </Typography> */}
    </div>
  );
};

export default Table;
