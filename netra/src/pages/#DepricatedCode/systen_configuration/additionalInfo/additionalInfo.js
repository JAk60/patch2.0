import { Button, unstable_createMuiStrictModeTheme } from "@material-ui/core";
import CustomSelect from "../../../ui/Form/CustomSelect";
import Table from "../../../ui/Table/Table";
import styles from "../SystemConfiguration.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";
import { v4 as uuid } from "uuid";
import RenderParallelComponent from "../redundancy/RenderParallelComponent";
const AdditionalInfo = (props) => {
  let systemData = useSelector((state) => state.treeData.treeData);
  console.log(systemData);
  systemData = systemData.filter((x) => x.parentId === null);
  let ParallelIds = [];

  const setParallelIds = (d) => {
    ParallelIds = d;
  };
  const rowData = systemData.map((element, index) => {
    return {
      id: uuid(),
      component_id: element.id,
      installation_date: "10/08/2021",
      EquipmentName: element.name,
      nomenclature: element.nomenclature,
      AverageRunning: "",
      Unit: "",
      InstallationDate: "",
      maintDataAvail: "Component Level",
      hK: 1,
      elhK: 1,
      cK: 1,
      dsK: 1,
      asK: 1,
      parallelComponentIds: [],
    };
  });

  const AIcolumnDefs = [
    <AgGridColumn
      field="nomenclature"
      headerName="Equipment Name"
      headerTooltip="Equipment Name"
      width={150}
      // editable={true}
    />,
    <AgGridColumn
      field="installation_date"
      headerName="Installation Date"
      headerTooltip="Date"
      width={150}
      cellEditor="datePicker"
      editable={true}
    />,
    <AgGridColumn
      field="AverageRunning"
      headerName="Default Avg. Monthly Utilization"
      headerTooltip="Default Avg. Monthly Utilization"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="Unit"
      headerName="Unit"
      headerTooltip="Unit"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Days", "Hours", "Cycles"],
      }}
      width={100}
      editable={true}
    />,
    <AgGridColumn
      field="maintDataAvail"
      headerName="Maintenance Data Availability"
      headerTooltip="Maintenance Data Availability"
      width={250}
      cellEditor="agSelectCellEditor"
      editable={true}
      cellEditorParams={{
        values: ["System Level", "Component Level"],
      }}
    />,
    // <AgGridColumn
    //   field="hK"
    //   headerName="Harbour-K"
    //   headerTooltip="Harbour-K"
    //   type="number"
    //   width="100"
    //   editable={true}
    // />,
    // <AgGridColumn
    //   field="elhK"
    //   headerName="Entry Leaving Harbour-K"
    //   headerTooltip="Entry Leaving Harbour-K"
    //   type="number"
    //   width="100"
    //   editable={true}
    // />,
    // <AgGridColumn
    //   field="cK"
    //   headerName="Cruise-K"
    //   headerTooltip="Cruise-K"
    //   type="number"
    //   width="100"
    //   editable={true}
    // />,
    // <AgGridColumn
    //   field="dsK"
    //   headerName="Defence Station-K"
    //   headerTooltip="Defence Station-K"
    //   type="number"
    //   width="100"
    //   editable={true}
    // />,
    // <AgGridColumn
    //   field="asK"
    //   headerName="Action Station-K"
    //   headerTooltip="Action Station-K"
    //   type="number"
    //   width="100"
    //   editable={true}
    // />,
    // <AgGridColumn
    //   field="parallelC"
    //   headerName="Select Parallel"
    //   headerTooltip="Select Parallel"
    //   type="number"
    //   width="100"
    //   cellEditorFramework={RenderParallelComponent}
    //   cellEditorParams={{
    //     setParallelIds: setParallelIds,
    //     label: "Select Parallel Components",
    //     isMultiple: true,
    //   }}
    //   editable={true}
    // />,
  ];
  const updateFinalRowData = (allRows, id) => {
    if (id) {
      allRows.filter((x) => x.id === id)[0].parallelComponentIds = ParallelIds;
      allRows.filter((x) => x.id === id)[0].N = ParallelIds.length + 1;
    }
    props.tableUpdate(allRows);
  };
  return (
    <div className={styles.systemTable}>
      <Table
        columnDefs={AIcolumnDefs}
        rowData={rowData}
        tableUpdate={updateFinalRowData}
      />
    </div>
  );
};
export default AdditionalInfo;
