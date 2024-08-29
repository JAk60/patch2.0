import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridColumn } from "ag-grid-react";
import React, { useState } from "react";
import Table from "../../../ui/Table/DataManagerTable";
import styles from "../DataManager.module.css";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "50px",
    margin: 50,
    height: 1,
  },
  parent: { marginTop: "20px" },
  child1: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(20),
      height: theme.spacing(5),
      background: "#048ee7",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  child2: {
    display: "flex",
    flexDirection: "row",
  },
  paper: {
    display: "flex",
    marginLeft: "3%",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(60),
      height: theme.spacing(3),
      textAlign: "center",
      padding: "10px",
    },
  },
  buttons: {
    marginLeft: "20px",
    marginTop: "25px",
    alignItems: "center",
    height: "40px",
  },
  tableFooter: {
    float: "right",
  }
}));

const OEM = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const rows = props.childList.map((x) => {
    return { name: x.name, id: x.id };
  });
  const [lifeEstimates, setlifeEstimates] = useState(["L10", "L90"]);
  const [columnDefs, setColumnDefs] = useState([
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
  ]);
  // console.log(lifeEstimates);
  const classes = useStyles();
  const [rowState, setRows] = useState([
    {
      id: rows[0]?.id,
      ComponentName: rows[0]?.name,
      L10: "",
      L90: "",
    },
  ]);


  const updateFinalRowData = (allRows) => {
    props.tableUpdate(allRows, "oem");
  };
  const AddRow = () => {
    const defaultRow = [
      {
        id: rows[0].id,
        ComponentName: rows[0].name,
        L10: "",
        L90: "",
      },
    ];
    gridApi.applyTransaction({
      add: defaultRow,
    });
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  const deleteRows = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.applyTransaction({ remove: selectedRows });
    console.log(selectedRows);
    const allRowData = [];
    gridApi.forEachNode((node) => allRowData.push(node.data));
    updateFinalRowData(allRowData);
  };
  const submitLifeEstimates = () => {
    const columns = lifeEstimates.map((c, i) => {
      if (!columnDefs.some((e) => e.props.headerName === c)) {
        return <AgGridColumn field={c} headerName={c} editable={true} />;
      }
    });

    setColumnDefs((prevState) => {
      return [...prevState, ...columns];
    });
  };
  const onChangeTextField = function (e, i) {
    setlifeEstimates((prevState) => {
      let stateCopy = [...prevState];
      stateCopy[i] = e.target.value;
      return [...stateCopy];
    });
  };
  return (
    <div className={classes.parent}>
      <div className={classes.child2}>
        <div className={classes.paper}>
          {lifeEstimates.map((l, i) => {
            return (
              <TextField
                key={i}
                data-index={i}
                onChange={(e) => onChangeTextField(e, i)}
                label="Life Estimate"
                defaultValue={l}
                variant="outlined"
                classes={{ root: classes.root }}
              />
            );
          })}
        </div>
        <Button
          className={classes.buttons}
          onClick={submitLifeEstimates}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </div>
      <div style={{ marginTop: "50px" }}>
        <Table
          columnDefs={columnDefs}
          setGrid={setGridApi}
          gridApi={gridApi}
          rowData={rowState}
          tableUpdate={updateFinalRowData}
        ></Table>
      </div>
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
};

export default OEM;
