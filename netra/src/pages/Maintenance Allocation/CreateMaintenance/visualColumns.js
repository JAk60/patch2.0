const visualWearColumnDefs = [
    <AgGridColumn
      field="level"
      headerName="Level"
      headerTooltip="Level"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="wear"
      headerName="Wear"
      headerTooltip="Wear"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="image"
      headerName="Image"
      headerTooltip="Image"
      //minWidth={100}
      editable={true}
    />,
  ];

  const visualActionsCols = [
    <AgGridColumn
      field="wear"
      headerName="Wear"
      headerTooltip="Wear"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="corrosion"
      headerName="Corrosion"
      headerTooltip="Corrosion"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="alarm"
      headerName="Alarms"
      headerTooltip="Alarms"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: ["Show on dashboard", "Alarm1", "Alarm2", "Alarm3"],
      }}
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      headerName="Invalid"
      field="invalid"
      //editable={true}
      cellRenderer={(params) => {
        var input = document.createElement("input");
        input.type = "checkbox";
        input.checked = params.value;
        input.addEventListener("click", function (event) {
          params.value = !params.value;
          params.node.data.invalid = params.value;
        });
        return input;
      }}
    />,
  ];

  const visualCorrosionColumnDefs = [
    <AgGridColumn
      field="level"
      headerName="Level"
      headerTooltip="Level"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="corrosion"
      headerName="Corrosion"
      headerTooltip="Corrosion"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="image"
      headerName="Image"
      headerTooltip="Image"
      //minWidth={100}
      editable={true}
    />,
  ];


  const lvlwiseColumnDefs = [
    <AgGridColumn
      field="name"
      headerName="Name"
      headerTooltip="Name"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="level"
      headerName="Level"
      headerTooltip="Level"
      //minWidth={100}
      editable={true}
    />,
    <AgGridColumn
      field="threshold"
      headerName="Threshold"
      headerTooltip="Threshold"
      //minWidth={100}
      editable={true}
    />,
  ];