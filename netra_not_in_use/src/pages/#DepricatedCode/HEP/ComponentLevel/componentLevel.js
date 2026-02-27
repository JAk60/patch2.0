import { Fragment } from "react";
import styles from "../HEP.module.css";
import Table from "../../../ui/Table/Table";
import { CLrowData } from "../HEPData";
import { AgGridColumn } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

const HEPComponentLevel = (props) => {
  let systemData = useSelector((state) => state.treeData.treeData);
  systemData = systemData.filter((x) => x.lmu === 1);
  const phaseData = useSelector((state) => state.phase.phase);
  const mData = ["Preventive", "Breakdown"];
  const rowData = systemData.map((e, i) => {
    return {
      ComponentId:e.id,
      LMU: e.name,
      psfcomplexity: "Nominal",
      psfergonomics: "Nominal",
      psfprocedure: "Available",
      id:uuid(),
    };
  });
  debugger;
  const CLcolumnDefs = [
    <AgGridColumn
      field="LMU"
      headerName="Lowest Maintainable Unit (LMU)"
      minWidth={80}
    />,
    <AgGridColumn
      field="psfcomplexity"
      headerName="PSF-Complexity"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Nominal", "Moderately Complex", "Highly Complex"],
      }}
      minWidth={80}
      editable={true}
    />,
    <AgGridColumn
      field="psfergonomics"
      headerName="PSF-Ergonomics"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Nominal", "Good", "Poor", "Misleading"] }}
      minWidth={80}
      editable={true}
    />,
    <AgGridColumn
      field="psfprocedure"
      headerName="PSF-Procedure Available"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Available", "Available But Poor", "Not Available"],
      }}
      minWidth={80}
      editable={true}
    />,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
    <Fragment>
      <div className={styles.phaseTable}>
        <Table
          columnDefs={CLcolumnDefs}
          rowData={rowData}
          tableUpdate={updateFinalRowData}
        />
      </div>
    </Fragment>
  );
};

export default HEPComponentLevel;
