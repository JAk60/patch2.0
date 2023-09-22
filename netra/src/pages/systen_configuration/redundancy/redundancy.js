import {
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import CustomSelect from "../../../ui/Form/CustomSelect";
import Table from "../../../ui/Table/Table";
import styles from "../SystemConfiguration.module.css";
import { AgGridColumn } from "ag-grid-react";
import { v4 as uuid } from "uuid";
import RenderParallelComponent from "./RenderParallelComponent";
const RedundancyInfo = (props) => {
  // const [rows, setRows] = useState([]);
  // useEffect(() => {
  //   fetch("/home", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setRows(data);
  //     });
  // }, [setRows]);
  const [gridApi, setGridApi] = useState(null);
  let ParallelIds = [];

  const setParallelIds = (d) => {
    ParallelIds = d;
  };

  const systemData = useSelector((state) => state.treeData.treeData);

  const currentSelectedSystem = useSelector(
    (state) => state.userSelection.currentSelection.equipmentName
  );

  const RIDemo = [
    <AgGridColumn field="eqId" hide={true} />,
    <AgGridColumn
      field="EquipmentName"
      headerName="Equipment name"
      headerTooltip="Equipment name"
      width="220"
    />,
    <AgGridColumn
      field="EquipmentParentName"
      headerName="Equipment Parent Name"
      headerTooltip="Equipment Parent Name"
      width={300}
    />,
    <AgGridColumn
      field="ParallelComponent"
      headerName="Parallel Component (Component - Parent Name)"
      headerTooltip="Parallel Component (Component - Parent Name)"
      // cellEditor="agSelectCellEditor"
      cellEditorFramework={RenderParallelComponent}
      cellEditorParams={{
        setParallelIds: setParallelIds,
        label: "Select Parallel Equipments!",
        isMultiple: true,
      }}
      //onCellClicked={onCellChanged}
      width="220"
      editable={true}
    />,
    // <AgGridColumn
    //   field="ParallelComponent"
    //   headerName="Parallel Component (Component - Parent Name)"
    //   cellEditor="agSelectCellEditor"
    //   // cellEditorParams={renderParallelComponent}
    //   // onCellValueChanged={onCellChanged}
    //   cellRendererFramework={MultipleSelect}
    //   width="220"
    //   editable={true}
    // />,
    <AgGridColumn
      field="RedundancyType"
      headerName="Redundancy Type"
      headerTooltip="Redundancy Type"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: [
          "",
          "K out-of N - Active Redundancy",
          "K out-of N - Inactive Redundancy",
        ],
      }}
      width="220"
      editable={true}
    />,
    <AgGridColumn
      field="K"
      headerName="K"
      headerTooltip="K"
      type="number"
      width={100}
      editable={true}
    />,
  ];

  const rData = systemData.map((element, index) => {
    return {
      eqId: element.id,
      EquipmentName: element.nomenclature,
      componentId: element.id,
      systemName: currentSelectedSystem,
      id: uuid(),
      EquipmentParentName: element.parentName,
      ParallelComponent: "",
      RedundancyType: "K out-of N - Active Redundancy",
      K: 1,
      // hK: 1,
      // elhK: 0,
      // cK: 0,
      // dsK: 0,
      // asK: 0,
      parallelComponentIds: [],
      N: 0,
    };
  });

  const updateFinalRowData = (allRows, id) => {
    if (id) {
      allRows.filter((x) => x.id === id)[0].parallelComponentIds = ParallelIds;
      allRows.filter((x) => x.id === id)[0].N = ParallelIds.length + 1;
    }
    debugger;
    props.tableUpdate(allRows);
  };
  return (
    <div className={styles.systemTable}>
      <Table
        columnDefs={RIDemo}
        rowData={rData}
        tableUpdate={updateFinalRowData}
        setGrid={setGridApi}
        gridApi={gridApi}
      />
    </div>
  );
};

export default RedundancyInfo;
