import { Button, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import CustomTextInput from "../../../ui/Form/CustomTextInput";
import Table from "../../../ui/Table/DataManagerTable";
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "10px",
  },
  paper: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(40),
      height: theme.spacing(5),
      background: "#048ee7",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  row: {
    display: "flex",
    width: "98%",
    marginLeft: "1%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    marginLeft: "50%",
  },
  input: {
    width: "100%",
    marginBottom: "20px",
  },
  tableFooter: {
    float: "right",
  }
}));

function OEMExpert(props) {
  const [gridApi, setGridApi] = useState(null);
  const rows = props.childList.map((x) => {
    return { name: x?.name, id: x?.id };
  });
  const [lifeEstimateValue, setLifeEstimateValue] = useState("L");
  const [columnDefs, setColdefs] = useState([
    <AgGridColumn
      field="ComponentName"
      headerName="Component Name"
      editable={true}
      width={200}
      checkboxSelection={true}
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: rows.map((x) => x.name),
      }}
    />,
    <AgGridColumn
      field="MostLikely"
      headerName="Most Likely Life"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="MaxLife"
      headerName="Maximum Life"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="MinLife"
      headerName="Minimum Life"
      width={150}
      editable={true}
    />,
    <AgGridColumn
      field="componentFailure"
      headerName="Number of Component seen withour Failure"
      editable={true}
    />,
    <AgGridColumn
      field="time_wo_failure"
      headerName="Total time without Failure"
      editable={true}
    />,
  ]);
  const classes = useStyles();
  const rowState= [];

  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "oemE");
  };
  const AddRow = () => {
    if (columnDefs.length >= 6) {
      const lifeEstimateName = columnDefs[1].props.field;
      const defaultRow = [
        {
          id: rows[0].id,
          ComponentName: rows[0].name,
          MostLikely: "",
          MaxLife: "",
          MinLife: "",
          componentFailure: "",
          time_wo_failure: "",
          // Replacements: "1",
        },
      ];
      defaultRow[0][lifeEstimateName] = "";
      gridApi.applyTransaction({
        add: defaultRow,
      });
      const allRowData = [];
      gridApi.forEachNode((node) => allRowData.push(node.data));
      updateFinalRowData(allRowData);
    } else {
      alert("Please Add Life Estimate!!");
    }
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  const submitLifeEstimates = () => {
    debugger;
    const coldefs = [...columnDefs];
    if (columnDefs[1].props.field[0] === "L") {
      if (!coldefs.some((e) => e.props.headerName === lifeEstimateValue)) {
        const item = (
          <AgGridColumn
            field={lifeEstimateValue}
            headerName={lifeEstimateValue}
            editable={true}
            width={50}
          />
        );
        console.log(coldefs);
        coldefs.splice(1, 1, item);
        setColdefs(coldefs);
      }
    } else {
      if (!coldefs.some((e) => e.props.headerName === lifeEstimateValue)) {
        const item = (
          <AgGridColumn
            field={lifeEstimateValue}
            headerName={lifeEstimateValue}
            editable={true}
            width={50}
          />
        );
        console.log(coldefs);
        coldefs.splice(1, 0, item);
        setColdefs(coldefs);
      }
    }
  };
  const onChangeLifeEsti = (e) => {
    setLifeEstimateValue(e.target.value);
  };
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.paper}>
          <Paper elevation={3} variant="outlined">
            OEM + Expert Judgement
          </Paper>
        </div>
        <div className={classes.value}>
          <Typography align="center" variant="caption">
            Specify the Available Life Estimates
          </Typography>
          <div className={classes.input}>
            <CustomTextInput
              value={lifeEstimateValue}
              onChange={onChangeLifeEsti}
            />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={submitLifeEstimates}
        >
          Submit
        </Button>
      </div>
      <Table
        columnDefs={columnDefs}
        setGrid={setGridApi}
        gridApi={gridApi}
        rowData={rowState}
        tableUpdate={updateFinalRowData}
      ></Table>
      <div className={classes.tableFooter}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="secondary"
          onClick={() => AddRow()}
        >
          Add Row
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={() => deleteRows()}
        >
          Delete Rows
        </Button>
      </div>
    </div>
  );
}

export default OEMExpert;
