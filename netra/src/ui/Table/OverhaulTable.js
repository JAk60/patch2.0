import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import styles from "./OverHaulTable.module.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import ReactDom from "react-dom";
import { v4 as uuid } from "uuid";
// import { getDatePicker } from "./DatePicker";
// import styles2 from "../../pages/";

export const getDatePicker = () => {
  debugger;
  const fillZeros = (a) => {
    return Number(a) < 10 ? "0" + a : a;
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getFormattedDateOutput = (dateString) => {
    const dateParse = new Date(dateString);
    const dd = dateParse.getDate();
    const mm = dateParse.getMonth() + 1; //January is 0!
    const yyyy = dateParse.getFullYear();
    // console.log(dateString, dateParse);
    return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
  };
  function Datepicker() {}
  Datepicker.prototype.init = function (params) {
    this.textInput = React.createRef();
    const getFormattedDateMaterial = (dateString) => {
      const dateParse = new Date(
        dateString.split("/")[2] +
          "-" +
          dateString.split("/")[1] +
          "-" +
          dateString.split("/")[0]
      );
      const dd = dateParse.getDate();
      const mm = dateParse.getMonth() + 1; //January is 0!
      const yyyy = dateParse.getFullYear();
      console.log(dateString, dateParse);
      return fillZeros(dd) + "/" + fillZeros(mm) + "/" + yyyy;
    };
    const eInput = React.createElement(TextField, {
      type: "date",
      defaultValue: getFormattedDateMaterial(params.value),
      ref: this.textInput,
      style: { width: "95%" },
    });
    this.div = document.createElement("div");
    this.div.className = "ag-cell-parent-append";
    ReactDom.render(eInput, this.div);
  };
  Datepicker.prototype.getGui = function () {
    return this.div;
  };
  Datepicker.prototype.afterGuiAttached = function () {
    this.textInput.current.focus();
  };
  Datepicker.prototype.getValue = function () {
    return getFormattedDateOutput(
      this.textInput.current.querySelector("input").value
    );
  };
  Datepicker.prototype.destroy = function () {};
  Datepicker.prototype.isPopup = function () {
    return false;
  };
  return Datepicker;
};
//Date Picker End
const createData = (data) => {
  const finalRows = [];
  data.forEach((ele, index) => {
    let overhaulCount = index + 1;
    if (index === 0) {
      finalRows.push({
        fullWidth: true,
        name: "Initiation to" + " Overhaul " + overhaulCount,
        overhaulId: ele.id,
      });
    } else {
      finalRows.push({
        fullWidth: true,
        name: " Overhaul " + index + " to Overhaul " + overhaulCount,
        overhaulId: ele.id,
      });
    }
    let numDps = ele["numMaint"];
    for (let i = 0; i < numDps; i++) {
      finalRows.push({
        Date: "--/--/----",
        maintenanceType: "--Select--",
        totalRunAge: 0,
        subSystem: "--Select--",
        fullWidth: false,
        overhaulId: ele.id,
      });
    }
  });

  finalRows.push({
    fullWidth: true,
    name: "Overhaul " + data.length + " to Present",
    overhaulId: uuid(),
  });
  return finalRows;
};
const OverhaulTable = (props) => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.treeData
  );
  useEffect(() => {
    let d = createData(props.data);
    setRowData(d);
  }, [props.data]);
  let parent = "";
  let subSystem = [];
  try {
    parent = systemConfigurationTreeData.filter((x) => x.parentId === null)[0]
      .id;
    subSystem = systemConfigurationTreeData.filter(
      (x) => x.parentId === null || x.parentId === parent
    );
  } catch {
    <Redirect to="/data_manager/historical_data"></Redirect>;
  }
  //   const parent = systemConfigurationTreeData.filter(
  //     (x) => x.parentId === null
  //   )[0].id;
  //   const subSystem = systemConfigurationTreeData.filter(
  //     (x) => x.parentId === null || x.parentId === parent
  //   );
  const onGridReady = (params) => {
    setGridApi(params.api);
    // props.setGrid(params.api);
    //   setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    props.tableUpdate({ mainTable: allRowData, subTable: props.data });
  };
  const saveModifiedRows = (params) => {
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    props.tableUpdate({ mainTable: allRowData, subTable: props.data });
  };
  const colDefs = [
    <AgGridColumn
      headerName="Date (DD/MM/YYYY)"
      field="Date"
      //   headerTooltip="Date"
      //   minWidth={250}
      //   cellEditor="datePicker"
      editable={true}
    />,
    <AgGridColumn
      headerName="Maintenance Type"
      field="maintenanceType"
      headerTooltip="Maintenance Type"
      cellEditor="agSelectCellEditor"
      minWidth={400}
      cellEditorParams={{ values: ["Corrective Maintenance","Overhaul"] }}
      editable={true}
    />,
    <AgGridColumn
      headerName="Running Age After Previous Overhaul"
      field="totalRunAge"
      headerTooltip="Running Age After Previous Overhaul"
      minWidth={500}
      editable={true}
    />,
    <AgGridColumn
      headerName="Associated Sub-System"
      field="subSystem"
      headerTooltip="Associated Sub-System"
      minWidth={500}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: subSystem.map((x) => x.name),
      }}
      editable={true}
    />,
  ];

  const fullWidthCellRenderer = (params) => {
    debugger;
    let cssClass;
    let message;
    cssClass = styles["example-full-width-row"];
    message = params.data.name;
    const eDiv = document.createElement("div");
    eDiv.innerHTML = '<div class="' + cssClass + '">' + message + "</div>";
    return eDiv.firstChild;
  };
  const AddRow = () => {
    let newRowData = [
      {
        Date: "10/10/2021",
        maintenanceType: "",
        totalRunAge: "",
        subSystem: "",
        fullWidth: false,
      },
    ];
    gridApi.applyTransaction({
      add: newRowData,
    });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    props.tableUpdate({ mainTable: allRowData, subTable: props.data });
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    props.tableUpdate({ mainTable: allRowData, subTable: props.data });
  };
  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        onGridReady={onGridReady}
        onFirstDataRendered={onFirstDataRendered}
        onCellValueChanged={saveModifiedRows}
        isFullWidthCell={(rowNode) => rowNode.data.fullWidth}
        fullWidthCellRenderer={fullWidthCellRenderer}
        components={{
          datePicker: getDatePicker(),
        }}
      >
        {colDefs}
      </AgGridReact>
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

export default OverhaulTable;
