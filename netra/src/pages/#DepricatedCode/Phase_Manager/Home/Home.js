import { AgGridColumn } from "ag-grid-react";
import { Fragment } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import { useSelector } from "react-redux";
import styles from "../Phasemanager.module.css";
import { v4 as uuid } from "uuid";
const PhaseManagerHome = (props) => {
  const phases = useSelector((state) => state.phase.phase);

  const pRow = phases.map((x) => {
    return {
      id: x.id,
      Description: x.Description,
      LowerBound: x.LowerBound,
      MeasurementType: x.MeasurementType,
      PhaseName: x.PhaseName,
      PhaseRange: x.PhaseRange,
      Status: x.Status,
      Unit: x.Unit,
      UpperBound: x.UpperBound,
    };
  });
  // const pRow = [
  //   {
  //     Description: "Description",
  //     LowerBound: 0,
  //     MeasurementType: "Quantitative",
  //     PhaseName: "Load",
  //     PhaseRange: "L1",
  //     Status: "",
  //     Unit: "Unit",
  //     UpperBound: 50,
  //   },
  //   {
  //     Description: "Description",
  //     LowerBound: 51,
  //     MeasurementType: "Quantitative",
  //     PhaseName: "Load",
  //     PhaseRange: "L2",
  //     Status: "",
  //     Unit: "Unit",
  //     UpperBound: 75,
  //   },
  // ];
  const MPcolumnDefs = [
    <AgGridColumn
      field="PhaseName"
      headerName="Phase Parameter name"
      headerTooltip="Phase Parameter name"
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="MeasurementType"
      headerName="Measurement Type"
      headerTooltip="Measurement Type"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Qualitative", "Quantitative"] }}
      minWidth={140}
      editable={true}
    />,
    <AgGridColumn
      field="LowerBound"
      headerName="Lower Bound"
      headerTooltip="Lower Bound"
      type="number"
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="UpperBound"
      headerName="Upper Bound"
      headerTooltip="Upper Bound"
      type="number"
      minWidth={100}
      editable={true}
    />,
    // <AgGridColumn
    //   field="Status"
    //   headerName="Status"
    //   minWidth={100}
    //   editable={true}
    // />,
    <AgGridColumn
      field="PhaseRange"
      headerName="PhaseRange"
      headerTooltip="Phase Range"
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="Unit"
      headerName="Unit"
      headerTooltip="Unit"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Km/hr", "M/hr"] }}
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="Description"
      headerName="Description"
      headerTooltip="Description"
      minWidth={100}
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
          columnDefs={MPcolumnDefs}
          rowData={pRow}
          tableUpdate={updateFinalRowData}
          setGrid={props.setGridApi}
          gridApi={props.gridApi}
        />
      </div>
    </Fragment>
  );
};
export default PhaseManagerHome;
