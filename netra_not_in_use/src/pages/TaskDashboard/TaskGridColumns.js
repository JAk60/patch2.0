import React from "react";
import { AgGridColumn } from "ag-grid-react";

export const taskTableColumns = [
  <AgGridColumn
    field="shipName"
    headerName="Ship Name"
    headerTooltip="Ship Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="taskName"
    headerName="Task Name"
    headerTooltip="Task Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="rel"
    headerName="Reliability (User Selection)"
    headerTooltip="Reliability (User Selection)"
    type="number"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="cal_rel"
    headerName="Reliability (NETRA Recommendation)"
    headerTooltip="Reliability (NETRA Recommendation)"
    width={100}
    editable={true}
  />,
];
export const taskMissionTableColumns = [
  <AgGridColumn
    field="shipName"
    headerName="Ship Name"
    headerTooltip="Ship Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="taskName"
    headerName="Task Name"
    headerTooltip="Task Name"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="missionType"
    headerName="Mission Type"
    headerTooltip="Mission Type"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="ComponentMission"
    headerName="Component/Mission Type"
    headerTooltip="Component/Mission Type"
    width={100}
    editable={true}
  />,
  <AgGridColumn
    field="rel"
    headerName="Reliability"
    headerTooltip="Reliability"
    type="number"
    width={100}
    editable={true}
  />,
];
