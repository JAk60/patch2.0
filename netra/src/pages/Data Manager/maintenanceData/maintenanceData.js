import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "../DataManager.module.css";
import EquipmentName from "./EquipmentName";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
const MaintenanceData = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const systemData = useSelector((state) => state.treeData.treeData);
  let finalDataTableData = [];
  const [rowState, setRows] = useState([]);
  let selectedOptionId = "";
  // const
  const setIdToDropdownOption = (id) => {
    selectedOptionId = id;
  };
  const MaintColumns = [
    <AgGridColumn
      field="LMU"
      headerName="Equipment Name"
      headerTooltip="Equipment Name"
      cellEditorFramework={EquipmentName}
      minWidth={100}
      editable={true}
      // keyCreator={{ values: systemData.map((x) => x.id) }}
      cellEditorParams={{ setId: setIdToDropdownOption }}
      // cellEditorParams={{ values: systemData.map((x) => x.name) }}
      checkboxSelection={true}
      // cellEditor="agSelectCellEditor"
    />,
    <AgGridColumn
      field="EventType"
      headerName="EventType"
      headerTooltip="EventType"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Preventive", "Breakdown"],
      }}
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="Date"
      headerName="Date"
      headerTooltip="Date"
      width={200}
      cellEditor="datePicker"
      editable={true}
    />,
    <AgGridColumn
      field="MaintenanceType"
      headerName="Maintenance Type"
      headerTooltip="Maintenance Type"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Replaced", "Repaired"] }}
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="ReplaceType"
      headerName="Replace Component Type"
      headerTooltip="Replace Component Type"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["New", "Refurbished", "Cannibalised", "Duplicate"],
      }}
      minWidth={100}
      editable={(params) => {
        return params.data.ReplaceType === "NA" ? false : true;
      }}
    />,
    <AgGridColumn
      field="CannibalisedAge"
      headerName="Cannibalised Age"
      headerTooltip="Cannibalised Age"
      type="number"
      minWidth={100}
      editable={(params) => {
        return params.data.CannibalisedAge === "NA" ? false : true;
      }}
    />,
    <AgGridColumn
      field="MaintenanceDuration"
      headerName="Maintenance Duration"
      headerTooltip="Maintenance Duration"
      type="nmber"
      minWidt={100}
      editable={true}
    />,
    <AgGridColumn
      field="FM"
      headerName="Failure Mode"
      headerTooltip="Failure Mode"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Failure Mode 1", "Failure Mode 2", "Failure Mode 3"],
      }}
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="Remark"
      headerName="Remark"
      headerTooltip="Remark"
      cellEditor="agLargeTextCellEditor"
      minWidth={100}
      editable={true}
    />,
  ];
  const AddRow = () => {
    let newRowData = [
      {
        LMU: systemData[0]?.name,
        component_id: systemData[0]?.id,
        EventType: "Preventive",
        Date: "10/08/2021",
        MaintainanceType: "Replaced",
        ReplaceType: "New",
        CannibalisedAge: "NA",
        MaintenanceDuration: "0",
        FM: "Failure Mode 1",
        Remark: "Enter remarks here...",
        id: uuid(),
      },
    ];
    gridApi.applyTransaction({
      add: newRowData,
    });
    onGridAddDeleteSupport();
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    onGridAddDeleteSupport();
  };
  const onGridAddDeleteSupport = () => {
    let allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    tableUpdate(allRowData, undefined);
  };
  const tableUpdate = (data, id) => {
    // alert(id);
    // alert(selectedOptionId);
    finalDataTableData = data;
    if (id) {
      finalDataTableData.filter((x) => x.id === id)[0]["component_id"] =
        selectedOptionId;
    }
    props.tableUpdate(finalDataTableData, "maintData");
  };

  return (
    <div>
      <Table
        columnDefs={MaintColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        // selectedOptionId={selectedOptionId}
        tableUpdate={tableUpdate}
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

export default MaintenanceData;
