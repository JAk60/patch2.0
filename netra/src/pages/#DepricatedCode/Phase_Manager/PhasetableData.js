import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";

export const MProwData = [
  {
    PhaseName: "Load",
    MeasurementType: "Quantitative",
    LowerBound: 0,
    UpperBound: 50,
    Status: "",
    PhaseRange: "L1",
    Unit: "Unit",
    Description: "Description",
  },
  {
    PhaseName: "Load",
    MeasurementType: "Quantitative",
    LowerBound: 51,
    UpperBound: 75,
    Status: "",
    PhaseRange: "L2",
    Unit: "Unit",
    Description: "Description",
  },
];
export const MPcolumnDefs = [
  {
    field: "PhaseName",
    headerName: "Phase name",
    minWidth: 100,
    editable: true,
  },
  {
    field: "MeasurementType",
    headerName: "Measurement Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Qualitative", "Quantitative"] },
    minWidth: 140,
    editable: true,
  },
  {
    field: "LowerBound",
    headerName: "Lower Bound",
    type: "number",
    minWidth: 100,
    editable: true,
  },
  {
    field: "UpperBound",
    headerName: "Upper Bound",
    type: "number",
    minWidth: 100,
    editable: true,
  },
  {
    field: "Status",
    headerName: "Status",
    minWidth: 100,
    editable: true,
  },
  {
    field: "PhaseRange",
    headerName: "PhaseRange",
    minWidth: 100,
    editable: true,
  },
  {
    field: "Unit",
    headerName: "Unit",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Km/hr", "M/hr"] },
    minWidth: 100,
    editable: true,
  },
  {
    field: "Description",
    headerName: "Description",
    minWidth: 100,
    editable: true,
  },
];

export const LMrowData = [];

export const LMcolumnDefs = [
  {
    headerName: "Component",
    minWidth: 140,
    editable: true,
  },
  {
    headerName: "Load",
    children: [{ field: "L1" }, { field: "L2" }, { field: "L3" }],
  },
  {
    headerName: "Ship Mode",
    children: [{ field: "Docked" }, { field: "Cruise" }, { field: "Attack" }],
  },
];

export const DCMrowData = [
  {
    System: "DA",
    L1: "0.52",
    L2: "1",
    L3: "0.5",
    Docked: "1",
    Cruise: "1",
    Attack: "1",
  },
];

export const DCMcolumnDefs = [
  {
    field: "System",
    headerName: "System",
    minWidth: 260,
    editable: false,
  },
  {
    field: "L1",
    headerName: "L1",
    minWidth: 120,
    editable: true,
  },
  {
    field: "L2",
    headerName: "L2",
    minWidth: 120,
    editable: true,
  },
  {
    field: "L3",
    headerName: "L3",
    minWidth: 120,
    editable: true,
  },
  {
    field: "Docked",
    headerName: "Docked",
    minWidth: 120,
    editable: true,
  },
  {
    field: "Cruise",
    headerName: "Cruise",
    minWidth: 120,
    editable: true,
  },
  {
    field: "Attack",
    headerName: "Attack",
    minWidth: 120,
    editable: true,
  },
];

export const components = ["Fresh Water Cooling", "Component2", "Component3"];
