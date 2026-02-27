import { Fragment } from "react";
import Table from "../../../ui/Table/Table";
import { ELcolumnDefs, ELrowData } from "../HEPData";
import styles from "../HEP.module.css";
import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const EquipmentLevelHEP = (props) => {
  let systemData = useSelector((state) => state.treeData.treeData);
  systemData = systemData.filter((x) => x.parent === null);
  const phaseData = useSelector((state) => state.phase.phase);
  const mData = ["Preventive", "Breakdown"];
  let rowData = [];
  const rData = systemData.map((e, i) => {
    phaseData.map((p_e, p_i) => {
      mData.map((mE, mI) => {
        if (p_e.MType === "Qualitative") {
          rowData.push({
            equipment: e.name,
            phase: p_e.Status,
            Maintenancepolicy: mE,
            ATNominal: 100,
            Lessthanrequired: 0,
            Higherthanrequired: 0,
            vhtr: 0,
            Nominal: 100,
            Low: 0,
            Extreme: 0,
            id:uuid()
          });
          return null;
        } else {
          rowData.push({
            equipment: e.name,
            phase: p_e.PhaseRange,
            Maintenancepolicy: mE,
            ATNominal: 100,
            Lessthanrequired: 0,
            Higherthanrequired: 0,
            vhtr: 0,
            Nominal: 100,
            Low: 0,
            Extreme: 0,
            id:uuid()
          });
          return null;
        }
      });
      return null;
    });

    return null;
  });
  const ELcolumnDefs = [
    <AgGridColumn field="equipment" headerName="Equipment" minWidth={80} />,
    <AgGridColumn field="phase" headerName="Phase Name" minWidth={80} />,
    <AgGridColumn
      field="Maintenancepolicy"
      headerName="Maintenance Policy"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{ values: ["Preventive", "Breakdown"] }}
      minWidth={140}
      editable={true}
    />,
    <AgGridColumn headerName="PSF-Available Time">
      <AgGridColumn
        field="ATNominal"
        headerName="Nominal"
        editable={true}
      ></AgGridColumn>
      <AgGridColumn
        field="Lessthanrequired"
        headerName="Less Than Required"
        editable={true}
      ></AgGridColumn>
      <AgGridColumn
        field="Higherthanrequired"
        headerName="Higher than required"
        editable={true}
      ></AgGridColumn>
      <AgGridColumn
        field="vhtr"
        headerName="Very High than required"
        editable={true}
      ></AgGridColumn>
    </AgGridColumn>,
    <AgGridColumn headerName="PSF-Stress">
      <AgGridColumn field="Nominal" editable={true}></AgGridColumn>
      <AgGridColumn field="Low" editable={true}></AgGridColumn>
      <AgGridColumn field="Extreme" editable={true}></AgGridColumn>
    </AgGridColumn>,
  ];
  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows);
  };
  return (
      <div className={styles.phaseTable}>
        <Table
          columnDefs={ELcolumnDefs}
          rowData={rowData}
          tableUpdate={updateFinalRowData}
        />
      </div>
  );
};

export default EquipmentLevelHEP;
