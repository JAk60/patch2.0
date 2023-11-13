import { Button } from "@material-ui/core";
import CustomSelect from "../../../ui/Form/CustomSelect";
import Table from "../../../ui/Table/Table";
import styles from "../SystemConfiguration.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";
import {v4 as uuid} from 'uuid';
const DutyCycle = (props) => {
  const systemData = useSelector((state) => state.treeData.treeData);
  const rowData = systemData.map((element, index) => {
    return {
      Component: element.nomenclature,
      ComponentId:element.id,
      id:uuid(),
      DutyCycle: 1,
    };
  });



  const DCcolumnDefs = [
    <AgGridColumn
      field="Component"
      headerName="Component"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="DutyCycle"
      headerName="Duty Cycle"
      type="number"
      width={500}
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
    <div className={styles.systemTable}>
      <Table
        columnDefs={DCcolumnDefs}
        rowData={rowData}
        tableUpdate={updateFinalRowData}
      />
    </div>
  );
};
export default DutyCycle;
