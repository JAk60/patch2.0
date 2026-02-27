import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";

export const ELrowData = [
  {
    equipment: "Fresh Water Cooling",
    Maintenancepolicy: "Preventive",
    Criticality: "Low",
    ATNominal: "1",
    "Less than required": "2",
    "Higher than required": "3",
    "Very High than required": "4",
    Nominal: "5",
    Low: "6",
    Extreme: "7",
  },
];
export const ELcolumnDefs = [
  {
    field: "equipment",
    headerName: "Equipment",
    minWidth: 80,
    editable: true,
  },
  {
    field: "Maintenancepolicy",
    headerName: "Maintenance Policy",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Qualitative", "Quantitative"] },
    minWidth: 140,
    editable: true,
  },
  {
    field: "Criticality",
    headerName: "Criticality",
    type: "number",
    minWidth: 100,
    editable: true,
  },
  {
    headerName: "PSF-Available Time",
    children: [
      { field: "ATNominal", headerName: "Nominal", editable: true },
      { field: "Less than required", editable: true },
      { field: "Higher than required", editable: true },
      { field: "Very High than required", editable: true },
    ],
  },
  {
    headerName: "PSF-Stress",
    children: [
      { field: "Nominal", editable: true },
      { field: "Low", editable: true },
      { field: "Extreme", editable: true },
    ],
  },
];

export const CLcolumnDefs = [
  {
    field: "LMU",
    headerName: "Lowest Maintainable Unit (LMU)",
    minWidth: 80,
    editable: true,
  },
  {
    field: "shipmode",
    headerName: "Ship Mode",
    minWidth: 80,
    editable: true,
  },
  {
    field: "psfcomplexity",
    headerName: "PSF-Complexity",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["1", "2"] },
    minWidth: 80,
    editable: true,
  },
  {
    field: "psfergonomics",
    headerName: "PSF-Ergonomics",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["1", "2"] },
    minWidth: 80,
    editable: true,
  },
  {
    field: "psfprocedure",
    headerName: "PSF-Procedure Available",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["1", "2"] },
    minWidth: 80,
    editable: true,
  },
];
export const CLrowData = [
  {
    LMU: "Water Temperature Gauge",
    shipmode: "Docked",
    psfcomplexity: "",
    psfergonomics: "",
    psfprocedure: "",
  },
];

export const SLMcolumnDefs = [
  {
    field: "component",
    headerName: "Component",
    minWidth: 80,
    editable: true,
  },
  {
    field: "refurbished",
    headerName: "Refurbished",
    minWidth: 100,
    editable: true,
  },
  {
    field: "cannibalised",
    headerName: "Cannibalised",
    minWidth: 80,
    editable: true,
  },
  {
    field: "nonOEM",
    headerName: "Non-OEM/Duplicate",
    minWidth: 80,
    editable: true,
  },
];

export const SLMrowData = [
  {
    component: "DA",
    refurbished: "1",
    cannibalised: "1",
    nonOEM: "1",
  },
];
