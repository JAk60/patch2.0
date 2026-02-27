import { Fragment } from "react";
import CustomSelect from "../../../ui/Form/CustomSelect";
import Table from "../../../ui/Table/Table";
import styles from "../Phasemanager.module.css";
import LensIcon from "@material-ui/icons/Lens";
import { makeStyles } from "@material-ui/core";
import { LMrowData, components } from "../PhasetableData";
import { AgGridColumn } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
const PhaseStyles = makeStyles({
  formControl: {
    minWidth: "20%",
  },
  Submit: {
    height: 40,
  },
  Pbuttons: {
    marginLeft: 10,
  },
});
const LifeMultiplier = (props) => {
  const PhaseClasses = PhaseStyles();
  const phase = useSelector((state) => state.phase.phase);
  const systemData = useSelector((state) => state.treeData.treeData);
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
            index={ele1.id}
            editable={true}
          />
        );
      } else {
        return <AgGridColumn field={ele1.Status} />;
      }
    });
    return (
      <AgGridColumn field={ele} headerName={ele}>
        {childAgGrid}
      </AgGridColumn>
    );
  });
  const LMcolumnDefs = [
    <AgGridColumn
      field="Component"
      headerName="Component"
      minWidth={140}
      editable={true}
    />,
    ...phaseArr,
  ];
  const rowData = systemData.map((element, index) => {
    let d = {};
    const phaseD = childColHeaders.map((ele, index) => {
      d[ele] = 1;
      return null;
    });
    debugger;
    return {
      Component: element.name,
      component_id: element.id,
      ...d,
    };
  });
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
    <Fragment>
      {/* <div className={styles.flex2}>
        <CustomSelect
          style={{ minWidth: "45%" }}
          className={PhaseClasses.formControl}
          id="parent-component"
          label="Parent Component"
          fields={components}
        />
        <Button
          variant="contained"
          color="primary"
          className={PhaseClasses.Submit}
        >
          Submit
        </Button>
        <span style={{ fontSize: "0.7rem" }}>
          <LensIcon style={{ color: "#d8f0f4" }} />
          LMU-Lowest Maintainable Unit
        </span>
      </div> */}
      <div className={styles.LMphaseTable}>
        <Table
          columnDefs={LMcolumnDefs}
          rowData={rowData}
          tableUpdate={updateFinalRowData}
        />
      </div>
    </Fragment>
  );
};

export default LifeMultiplier;
