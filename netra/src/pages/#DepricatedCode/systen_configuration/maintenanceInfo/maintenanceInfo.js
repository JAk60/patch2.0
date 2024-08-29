import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import CustomSelect from "../../../ui/Form/CustomSelect";
import Table from "../../../ui/Table/Table";
import styles from "../SystemConfiguration.module.css";
import { MIrowData } from "../SystemConfigurationTable.js";
import { AgGridColumn } from "ag-grid-react";
import { v4 as uuid } from "uuid";
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
    // <AgGridColumn
    //   field="ComponentCriticality"
    //   headerName="Criticality"
    //   width={350}
    //   cellEditor="agSelectCellEditor"
    //   cellEditorParams={{
    //     values: [
    //       "",
    //       "Failure leads to hazard or complete loss of functionality.",
    //       "Failure does not lead to hazard but causes partial loss of functionality.",
    //       "Failure does not lead hazard or loss of functionality but significant loss in efficiency.",
    //       "Failure does not lead to hazard or loss of functionality or loss of efficiency but causes rapid deterioration of some other critical component.",
    //       "Failure does not lead to hazard or loss of functionality but minor loss in efficiency.",
    //       "Failure does not lead to hazard or loss of functionality but causes rapid deterioration of some other non-critical component.",
    //       "Failure does not lead to hazard or loss of functionality or loss of efficiency but leads to significant inconvenience.",
    //       "Failure does not lead to hazard or loss of functionality or loss of efficiency but leads to minor inconvenience.",
    //     ],
    //   }}
    //   editable={true}
    // />,
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
