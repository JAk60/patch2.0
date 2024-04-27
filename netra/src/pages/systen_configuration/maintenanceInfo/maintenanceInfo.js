import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import Table from "../../../ui/Table/Table";
import styles from "../SystemConfiguration.module.css";
const MaintenanceInfo = (props) => {
  const systemData = useSelector((state) => state.treeData.treeData);
  const MaintColumns = [
    <AgGridColumn
      field="EquipmentName"
      headerName="Equipment name"
      headerTooltip="Equipment name"
      width={150}
      editable={false}
    />,
    <AgGridColumn
      field="RepairType"
      headerName="Repair Type"
      headerTooltip="Repair Type"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Replaceable", "Repairable"],
      }}
      width={160}
      editable={true}
    />,
    <AgGridColumn
      field="PreventiveMaintenaceApplicable"
      headerName="Preventive Maintenace Applicable"
      headerTooltip="Preventive Maintenace Applicable"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["No", "Yes"] }}
      width={200}
      editable={true}
    />,
    <AgGridColumn
      field="PreventiveMaintenaceInterval"
      headerName="Preventive Maintenace Interval (hrs)"
      headerTooltip="Preventive Maintenace Interval (hrs)"
      type="number"
      width={200}
      editable={true}
    />,
    <AgGridColumn
      field="ComponentsReplaced"
      headerName="Can be Replaced by Ship Staff"
      headerTooltip="Can be Replaced by Ship Staff"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["No", "Yes"] }}
      width={200}
      editable={true}
    />,
    <AgGridColumn
      field="ConditionMonitoring"
      headerName="Is System Parameter's Recorded"
      headerTooltip="Is System Parameter's Recorded"
      width={200}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["No", "Yes"] }}
      editable={true}
    />,
  ];

  const rowData = systemData
    // .filter((x) => x.lmu === 1)
    .map((element) => {
      return {
        id: uuid(),
        component_id: element.id,
        EquipmentName: element.nomenclature,
        RepairType: element.repairType,
        PreventiveMaintenaceApplicable: "No",
        PreventiveMaintenaceInterval: 0,
        ComponentsReplaced: "No",
        ConditionMonitoring: "No",
      };
    });
  const updateFinalRowData = (allRows) => {
    debugger
    props.tableUpdate(allRows);
  };
  return (
    <div className={styles.systemTable}>
      <Table
        columnDefs={MaintColumns}
        rowData={rowData}
        tableUpdate={updateFinalRowData}
      />
    </div>
  );
};

export default MaintenanceInfo;
