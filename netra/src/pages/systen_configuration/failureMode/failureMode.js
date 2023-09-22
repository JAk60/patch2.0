import { Button } from "@material-ui/core";
import { AgGridColumn } from "ag-grid-react";
// import CustomSelect from "../../../ui/Form/CustomSelect";
// import Table from "../../../ui/Table/Table";
import Table from "../../../ui/Table/DataManagerTable"
import styles from "../SystemConfiguration.module.css";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect, useState } from "react";
// import { treeDataActions } from "../../../store/TreeDataStore";
// import RenderParallelComponent from "../redundancy/RenderParallelComponent";
import EquipmentName from "./EquipmentName";
const FailureMode = (props) => {
  const failureModesData = useSelector((state) => state.treeData.failureModes);
  const systemData = useSelector((state) => state.treeData.treeData);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]); // State to hold the table's row data



  useEffect(() => {
    const tableRowData = failureModesData?.map((failureMode) => ({
      EquipmentName: systemData[0].name,
      eqId: props.matchingId,
      id: uuid(),
      fixFailureMode: failureMode.failure_mode,
      // You can add more properties based on your table columnDefs.
    }));
    setRowData(tableRowData);
  }, []);



  let selectedOptionId = "";
  let finalDataTableData = [];
  const setIdToDropdownOption = (id) => {
    selectedOptionId = id;
  };
  console.log("rowDATA",rowData);
 
  const FMcolumnDefs = [
    <AgGridColumn
      field="EquipmentName"
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
      field="fixFailureMode"
      headerName="Failure Mode/Symptoms"
      headerTooltip="Failure Mode"
      width={300}
      editable={true}
      // cellEditor="agSelectCellEditor"
    />
  ];

  const AddRow = () => {
    const defaultRow = [
      {
        EquipmentName: systemData[0].nomenclature,
        eqId: props.matchingId,
        id: uuid(),
        fixFailureMode: "",
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    // console.log(selectedRows);
  };
  const updateFinalRowData = (allRows, id) => {
    // debugger;
    finalDataTableData = allRows;
    if (id) {
      console.log(finalDataTableData[0].id, "flag")
      finalDataTableData.filter((x) => x.id === id)[0]["eqId"] = props.matchingId;
    }
    props.tableUpdate(finalDataTableData);
  };
  return (
    <div className={styles.systemTable}>
      <Table
        columnDefs={FMcolumnDefs}
        rowData={rowData}
        tableUpdate={updateFinalRowData}
        setGrid={setGridApi}
        gridApi={gridApi}
      />
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
              style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              onClick={()=>deleteRows()}
            >
              Delete Rows
            </Button>
          </div>
    </div>
  );
};
export default FailureMode;
