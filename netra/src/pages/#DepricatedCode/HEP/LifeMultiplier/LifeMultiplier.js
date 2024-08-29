import { Fragment } from "react";
import LensIcon from "@material-ui/icons/Lens";
import styles from "../HEP.module.css";
import Table from "../../../ui/Table/Table";
import { AgGridColumn } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
const HEPLifeMultiplier = (props) => {
  const systemData = useSelector((state) => state.treeData.treeData);
  const colDefs = [
    <AgGridColumn
      field="component"
      headerName="Component"
      minWidth={80}
      editable={true}
    />,
    <AgGridColumn
      field="refurbished"
      headerName="Refurbished"
      minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="cannibalised"
      headerName="Cannibalised"
      minWidth={80}
      editable={true}
    />,
    <AgGridColumn
      field="nonOEM"
      headerName="Non-OEM/Duplicate"
      minWidth={80}
      editable={true}
    />,
  ];

  const rowData = systemData.map((ele, index) => {
    return {
      id:uuid(),
      ComponentId:ele.id,
      component: ele.name,
      lmu:ele.lmu,
      refurbished: 1,
      cannibalised: 1,
      nonOEM: 1,
    };
  });

  const getLmuRowStyle = params => {
    //console.log(params.node);
    if (params.node.data.lmu==1) {
      return { background: '#d8f0f4' };
    }
  };

  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
    <Fragment>
      {/* <div className={styles.flex2}>
        <div>
          <span style={{ fontSize: "0.7rem" }}>
            <LensIcon style={{ color: "#d8f0f4" }} />
            LMU-Lowest Maintainable Unit
          </span>
        </div>
      </div> */}
      <div className={styles.phaseTable}>
        <Table
          columnDefs={colDefs}
          rowData={rowData}
          tableUpdate={updateFinalRowData}
          getRowStyle={getLmuRowStyle}
        />
      </div>
    </Fragment>
  );
};

export default HEPLifeMultiplier;
