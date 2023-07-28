import Table from "../../../ui/Table/Table";
import styles from "../Phasemanager.module.css";
import { AgGridColumn } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
const DCMultiplier = (props) => {
  const phase = useSelector((state) => state.phase.phase);
  if (phase.length === 0) {
    alert("Please add Phases first");
  }
  const systemData = useSelector((state) => state.treeData.treeData);
  const rootSystemData = systemData.filter((x) => x.parent === null);
  let distinctPhaseName = phase.map((element, index) => {
    return element.PhaseName;
  });
  distinctPhaseName = [...new Set(distinctPhaseName)];
  let childColHeaders = [];
  const phaseArr = distinctPhaseName.map((ele, index) => {
    const childArr = phase.filter((x) => x.PhaseName === ele);
    const childAgGrid = childArr.map((ele1, index1) => {
      childColHeaders.push(ele1.PhaseRange + " " + ele1.id);
      if (ele1.MeasurementType === "Quantitative") {
        return (
          <AgGridColumn
            field={ele1.PhaseRange + " " + ele1.id}
            headerName={ele1.PhaseRange}
            editable={true}
          />
        );
      } else {
        return <AgGridColumn field={ele1.Status} editable={true} />;
      }
    });
    return (
      <AgGridColumn field={ele} headerName={ele}>
        {childAgGrid}
      </AgGridColumn>
    );
  });
  // childColHeaders = [...new Set(childColHeaders)];
  const DCMcolumnDefs = [
    <AgGridColumn
      field="Component"
      headerName="Component"
      minWidth={140}
      editable={true}
    />,
    ...phaseArr,
  ];
  const rowData = systemData
    .filter((x) => x.parentId === null)
    .map((element, index) => {
      let d = {};
      const phaseD = childColHeaders.map((ele, index) => {
        d[ele] = 1;
        return null;
      });
      return {
        Component: element.name,
        component_id: element.id,
        ...d,
      };
    });
  debugger;
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
    <div className={styles.phaseTable}>
      <Table
        columnDefs={DCMcolumnDefs}
        rowData={rowData}
        tableUpdate={updateFinalRowData}
      />
    </div>
  );
};

export default DCMultiplier;
