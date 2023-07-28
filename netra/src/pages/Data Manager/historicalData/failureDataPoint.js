import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "../DataManager.module.css";
const FailureDataPoint = (props) => {
  debugger
  const [gridApi, setGridApi] = useState(null);
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });
  const [rowState, setRows] = useState([
    {
      id: rows[0].id,
      ComponentName: rows[0].name,
      installationDate: "",
      removalDate: "",
      AFS: "Failure",
    },
  ]);

  // const DPColumns = [
  //   <AgGridColumn
  //     field="ComponentName"
  //     headerName="Component Name"
  //     editable={true}
  //     minWidth={100}
  //     checkboxSelection={true}
  //     cellEditor="agSelectCellEditor"
  //     cellEditorParams={{
  //       values: rows.map((x) => x.name),
  //     }}
  //   />,
  //   <AgGridColumn headerName="Actual Data">
  //     <AgGridColumn
  //       field="DateTime"
  //       headerName="Date & Time"
  //       cellEditor="datePicker"
  //       editable={true}
  //     ></AgGridColumn>
  //     <AgGridColumn
  //       resizable={true}
  //       field="RTStart"
  //       headerName="Run Time at Start of Month"
  //       editable={true}
  //     ></AgGridColumn>
  //     <AgGridColumn
  //       field="RTEnd"
  //       headerName="Run Time at End of Month"
  //       editable={true}
  //     ></AgGridColumn>
  //     <AgGridColumn
  //       field="AFS"
  //       headerName="Failure/Suspension"
  //       editable={true}
  //       width={150}
  //       cellEditor="agSelectCellEditor"
  //       cellEditorParams={{
  //         values: ["Failure", "Suspension"],
  //       }}
  //     ></AgGridColumn>
  //   </AgGridColumn>,
  //   <AgGridColumn headerName="Interval Data">
  //     <AgGridColumn
  //       field="StartDate"
  //       headerName="Start Date"
  //       cellEditor="datePicker"
  //       editable={true}
  //     ></AgGridColumn>

  //     <AgGridColumn
  //       field="EndDate"
  //       headerName="End Date"
  //       cellEditor="datePicker"
  //       editable={true}
  //     ></AgGridColumn>

  //     <AgGridColumn
  //       field="IFS"
  //       headerName="Failure/Suspension"
  //       editable={true}
  //       width={150}
  //       cellEditor="agSelectCellEditor"
  //       cellEditorParams={{
  //         values: ["Failure", "Suspension"],
  //       }}
  //     ></AgGridColumn>
  //   </AgGridColumn>,
  // ];

  const DPColumns = [
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      editable={true}
      minWidth={100}
      checkboxSelection={true}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: rows.map((x) => x.name),
      }}
    />,
    <AgGridColumn headerName="Actual Data">
      <AgGridColumn
        field="installationDate"
        headerName="Installation Date"
        cellEditor="datePicker"
        editable={true}
      ></AgGridColumn>
      <AgGridColumn
        field="removalDate"
        headerName="Removal Date"
        cellEditor="datePicker"
        editable={true}
      ></AgGridColumn>
      <AgGridColumn
        field="AFS"
        headerName="Failure/Suspension"
        editable={true}
        width={150}
        cellEditor="agSelectCellEditor"
        cellEditorParams={{
          values: ["Failure", "Suspension"],
        }}
      ></AgGridColumn>
    </AgGridColumn>,
  ];
  //End
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "fdp");
  };
  const AddRow = () => {
    const defaultRow = [
      {
        id: rows[0].id,
        ComponentName: rows[0].name,
        installationDate: "",
        removalDate: "",
        AFS: "Failure",
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    console.log(selectedRows);
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  return (
    <div>
      <Table
        columnDefs={DPColumns}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
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

export default FailureDataPoint;
