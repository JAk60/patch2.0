import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { AgGridColumn } from "ag-grid-react";
import { Button } from "@material-ui/core";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import styles from "../DataManager.module.css";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid} from "uuid";
const OperationalData = (props) => {
  const systemData = useSelector((state) => state.treeData.treeData);
  //const phaseData = useSelector((state) => state.phase.phase);
  //const phaseNames = [...new Set(phaseData.map((x) => x.PhaseName))];
  //const phaseHeader = [];
  debugger;
  // phaseNames.map((p_e, p_i) => {
  //   const phase_ranges = phaseData.filter((x) => x.PhaseName === p_e);
  //   let values = [];
  //   if (phase_ranges[0].MeasurementType === "Quantitative") {
  //     values = phase_ranges.map((x) => x.PhaseRange);
  //   } else {
  //     values = phase_ranges.map((x) => x.Status);
  //   }
  //   const header = (
  //     <AgGridColumn
  //       field={p_e}
  //       headerName={p_e}
  //       cellEditor="agSelectCellEditor"
  //       cellEditorParams={{ values: values }}
  //       width={200}
  //       editable={true}
  //     />
  //   );
  //   phaseHeader.push(header);
  // });
  const [gridApi, setGridApi] = useState(null);
  const components=systemData.filter(x=>x.parentId==null)
  const rows=components.map((element, index) => {
    return {
      id: element.id,
      Date: "August/2021",
      AverageRunning: "0",
    };
  })
  
  const [rowData,setRows]=useState(rows)

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
        rowData={rowData}
        setGrid={setGridApi}
        gridApi={gridApi}
        // onCellClicked={(e) => {
        //   console.log("onCellClicked", e);
        // }}
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

export default OperationalData;