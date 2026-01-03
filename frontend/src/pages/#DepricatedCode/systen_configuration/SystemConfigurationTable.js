//Redundancy and Parallel Information
export const RIrowData = [
  {
    EquipmentName: "Equipment 1",
    EquipmentParentName: "Fresh Water Cooling",
    ParallelComponent: "",
    RedundancyType: "Option 1",
    K: 2,
    N: 2,
    SwitchReliability: 1,
  },
  {
    EquipmentName: "Equipment 1",
    EquipmentParentName: "Fresh Water Cooling",
    ParallelComponent: "Equipment 2",
    RedundancyType: "Option 1",
    K: 2,
    N: 2,
    SwitchReliability: 1,
  },
  {
    EquipmentName: "Equipment 1",
    EquipmentParentName: "Fresh Water Cooling",
    ParallelComponent: "Equipment 2",
    RedundancyType: "Option 1",
    K: 2,
    N: 2,
    SwitchReliability: 1,
  },
];
export const RIcolumnDefs = [
  {
    field: "EquipmentName",
    headerName: "Equipment name",
    width: 220,
  },
  {
    field: "EquipmentParentName",
    headerName: "Equipment Parent Name",
    width: 300,
  },
  {
    field: "ParallelComponent",
    headerName: "Parallel Component",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Equipment 2", "Equipment 3", "Equipment 4"],
    },
    width: 220,
    editable: true,
  },
  {
    field: "RedundancyType",
    headerName: "Redundancy Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: [
        "",
        "K out-of N - Active Redundancy",
        "K out-of N with Perfect Switching",
        "K out-of N with Imperfect Switching",
      ],
    },
    width: 220,
    editable: true,
  },
  {
    field: "K",
    headerName: "K",
    type: "number",
    width: 100,
    editable: true,
  },
  {
    field: "N",
    headerName: "N",
    width: 100,
    type: "number",
    editable: true,
  },
  {
    field: "SwitchReliability",
    headerName: "Switch Reliability",
    width: 200,
    type: "number",
    editable: true,
  },
];

//Maintenance Information
export const MIrowData = [
  {
    EquipmentName: "Equipment 1",
    RepairType: "Repairable",
    PreventiveMaintenaceApplicable: "Yes",
    PreventiveMaintenaceInterval: 145,
    ComponentsReplaced: "No",
    ConditionMonitoring: "Yes",
    ComponentCriticality: "Option 1",
  },
  {
    EquipmentName: "Equipment 1",
    RepairType: "Repairable",
    PreventiveMaintenaceApplicable: "Yes",
    PreventiveMaintenaceInterval: 145,
    ComponentsReplaced: "No",
    ConditionMonitoring: "Yes",
    ComponentCriticality: "Option 1",
  },
  {
    EquipmentName: "Equipment 1",
    RepairType: "Repairable",
    PreventiveMaintenaceApplicable: "Yes",
    PreventiveMaintenaceInterval: 145,
    ComponentsReplaced: "No",
    ConditionMonitoring: "Yes",
    ComponentCriticality: "Option 1",
  },
];

export const MIcolumnDefs = [
  {
    field: "EquipmentName",
    headerName: "Equipment name",
    width: 180,
    editable: true,
  },
  {
    field: "RepairType",
    headerName: "Repair Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Repairable", "Duplicate", "Refurbished", "Cannibalised"],
    },
    width: 180,
    editable: true,
  },
  {
    field: "PreventiveMaintenaceApplicable",
    headerName: "Preventive Maintenace Applicable",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Yes", "No"] },
    width: 220,
    editable: true,
  },
  {
    field: "PreventiveMaintenaceInterval",
    headerName: "Preventive Maintenace Interval",
    type: "number",
    width: 220,
    editable: true,
  },
  {
    field: "ComponentsReplaced",
    headerName: "Components Replaced During Mission",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Yes", "No"] },
    width: 220,
    editable: true,
  },
  {
    field: "ConditionMonitoring",
    headerName: "Condition Monitoring Applicable",
    width: 220,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Yes", "No"] },
    editable: true,
  },
  {
    field: "ComponentCriticality",
    headerName: "Component Criticality",
    width: 220,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Option 1", "Option 2", "Option 3"] },
    editable: true,
  },
];
// Failure Mode Information
export const FMrowData = [
  {
    EquipmentName: "Equipment 1",
    FailureMode: "Failure Mode 1  Failure Mode 2",
  },
  {
    EquipmentName: "Equipment 1",
    FailureMode: "Failure Mode 1",
  },
  {
    EquipmentName: "Equipment 1",
    FailureMode: "Failure Mode 1",
  },
];
export const FMcolumnDefs = [
  {
    field: "EquipmentName",
    headerName: "Equipment Name",
    width: 300,
    editable: true,
  },
  {
    field: "FailureMode",
    headerName: "Failure Mode",
    width: 800,
    editable: true,
  },
];
//Duty Cycle Information
export const DCrowData = [
  {
    Component: "Air Starting System DA2",
    DutyCycle: 1,
  },
  {
    Component: "Air Starter Plumbing - LMU",
    DutyCycle: 1,
  },
  {
    Component: "Fings 6 - LMU",
    DutyCycle: 1,
  },
];
export const DCcolumnDefs = [
  {
    field: "Component",
    headerName: "Component",
    width: 500,
    editable: true,
  },
  {
    field: "DutyCycle",
    headerName: "Duty Cycle",
    type: "number",
    width: 500,
    editable: true,
  },
];
