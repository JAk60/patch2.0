export const ODcolumnDefs = [
  {
    field: "DateTime",
    headerName: "Date & Time",
    width: 250,
    cellEditor: "datePicker",
    editable: true,
  },
  {
    field: "Day",
    headerName: "Day",
    width: 200,
    editable: true,
  },
  {
    field: "Load",
    headerName: "Load",
    width: 200,
    editable: true,
  },
  {
    field: "ShipMode",
    headerName: "Ship Mode",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["A", "B"] },
    width: 200,
    editable: true,
  },
];

export const ODrowData = [
  {
    DateTime: "10/08/2021 10:30",
    Day: "Monday",
    Load: "Load",
    ShipMode: "A",
  },
];

export const IDcolumnDefs = [
  {
    field: "ComponentName",
    headerName: "Component Name",
    minWidth: 200,
    editable: true,
  },
  {
    field: "ScaleParameter",
    headerName: "Scale Parameter",
    minWidth: 200,
    type: "number",
    editable: true,
  },
  {
    field: "ShapeParameter",
    headerName: "Shape Parameter",
    minWidth: 200,
    type: "number",
    editable: true,
  },
];

export const IDrowData = [
  {
    ComponentName: "Pressure Cap",
    ScaleParameter: "145",
    ShapeParameter: "185",
  },
  {
    ComponentName: "Tank",
    ScaleParameter: "165",
    ShapeParameter: "205",
  },
];

export const PEcolumnDefs = [
  {
    field: "LMU",
    headerName: "Lowest Maintainable Unit",
    minWidth: 200,
    editable: true,
  },
  {
    field: "ScaleParameter",
    headerName: "Scale Parameter",
    minWidth: 200,
    type: "number",
    editable: true,
  },
  {
    field: "ShapeParameter",
    headerName: "Shape Parameter",
    minWidth: 200,
    type: "number",
    editable: true,
  },
];

export const PErowData = [
  {
    LMU: "Pressure Cap",
    ScaleParameter: "145",
    ShapeParameter: "185",
  },
  {
    LMU: "Tank",
    ScaleParameter: "165",
    ShapeParameter: "205",
  },
];

export const MDcolumnDefs = [
  {
    field: "LMU",
    headerName: "Lowest Maintainable Unit",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Fresh Water Cooling"] },
    minWidth: 100,
    editable: true,
  },
  {
    field: "EventType",
    headerName: "EventType",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Preventive"] },
    minWidth: 100,
    editable: true,
  },
  {
    field: "DateTime",
    headerName: "Date & Time",
    width: 200,
    cellEditor: "datePicker",
    editable: true,
  },
  {
    field: "MaintainanceType",
    headerName: "Maintenance Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Replaced"] },
    minWidth: 100,
    editable: true,
  },
  {
    field: "ReplaceType",
    headerName: "Replace Component Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["OEM", "Duplicate"] },
    minWidth: 100,
    editable: true,
  },
  {
    field: "CannibalisedAge",
    headerName: "Cannibalised Age",
    type: "number",
    minWidth: 100,
    editable: true,
  },
  {
    field: "MaintenanceDuration",
    headerName: "Maintenance Duration",
    type: "number",
    minWidth: 100,
    editable: true,
  },
  {
    field: "FM",
    headerName: "Failure Mode",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Failure Mode 1", "Failure Mode 2", "Failure Mode 3"],
    },
    minWidth: 100,
    editable: true,
  },
  {
    field: "Remark",
    headerName: "Remark",
    cellEditor: "agLargeTextCellEditor",
    minWidth: 100,
    editable: true,
  },
];

export const MDrowData = [
  {
    LMU: "Pressure Cap",
    EventType: "Preventive",
    DateTime: "10/08/2021 10:30",
    MaintainanceType: "Replaced",
    ReplaceType: "OEM",
    CannibalisedAge: "2",
    MaintenanceDuration: "10",
    FM: "Failure Mode 1",
    Remark: "Enter remarks here...",
  },
];
