import React, { useState } from "react";
import Table from "../../../ui/Table/Table";
import { AgGridColumn } from "ag-grid-react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SelectEquipment from "../selectEquipment/selectEquipment";
import { useSelector, useDispatch } from "react-redux";
import { treeDataActions } from "../../../store/TreeDataStore";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";

const ParameterStyles = makeStyles({
  dropdown: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: "10px",
  },
});
function ParameterEstimation(props) {
  const dispatch = useDispatch();
  debugger;
  const [gridApi, setGridApi] = useState(null);
  const [selectedEquipmentList, setSelectedEquipmentList] = useState([]);
  const ParameterClasses = ParameterStyles();
  const [rowState, setRows] = useState([]);
  let systemRepairTypeBool = false;
  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.treeData
  );
  if (systemConfigurationTreeData.length > 0) {
    const equipment = selectedEquipmentList.map((e) => e.repairType)[0]
    console.log(equipment);
    systemRepairTypeBool =
      equipment === "Replaceable" ? true : false;
  }
  let ParameterColumns = [];
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systems",
      showSnackBar: false,
    });
  };
  if (!systemRepairTypeBool) {
    // Repairable Data
    ParameterColumns = [
      <AgGridColumn
        colId="EquipmentName"
        field="EquipmentName"
        headerName="Equipment Name"
        minWidth={200}
        editable={true}
      />,
      <AgGridColumn
        colId="alpha"
        field="alpha"
        headerName="alpha"
        minWidth={200}
        type="number"
        editable={false}
      />,
      <AgGridColumn
        colId="beta"
        field="beta"
        headerName="beta"
        minWidth={200}
        type="number"
        editable={false}
      />,
    ];
  } else {
    ParameterColumns = [
      <AgGridColumn
        colId="EquipmentName"
        field="EquipmentName"
        headerName="Equipment Name"
        minWidth={200}
        editable={true}
      />,
      <AgGridColumn
        colId="eta"
        field="eta"
        headerName="eta"
        minWidth={200}
        type="number"
        editable={false}
      />,
      <AgGridColumn
        colId="beta"
        field="beta"
        headerName="beta"
        minWidth={200}
        type="number"
        editable={false}
      />,
    ];
  }


  const onHandleSubmitClick = () => {
    const rowD = selectedEquipmentList.map((ele) => {
      if (!systemRepairTypeBool) {
        return {
          id: ele.id,
          EquipmentName: ele.nomenclature,
          eta: "-",
          beta: "-",
        };
      } else {
        return {
          id: ele.id,
          EquipmentName: ele.nomenclature,
          alpha: "-",
          beta: "-",
        };
      }
    });
    debugger
    setRows(rowD);
    dispatch(
      treeDataActions.setP(selectedEquipmentList)
    )
    console.log(rowD)
  };


  const onUpdateSelectedEquipmentList = (d) => {
    setSelectedEquipmentList(d);
  };
  console.log(selectedEquipmentList)

  const updateFinalRowData = (allRows) => {
    console.log("This");
    console.log(allRows);
  };
  const onHandleUpdateEtaBetaDB = () => {
    fetch("/update_parameters", {
      method: "POST",
      body: JSON.stringify({
        data: rowState,
        isReplacable: systemRepairTypeBool,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
          return res.json();
      })
      .then((data) => {
        if(data.code !== 0){
          setSnackBarMessage({
            severity: "success",
            message: "Reestimated Parameters Successfully",
            showSnackBar: true,
          });
          setRows(data)
        }else{
          setSnackBarMessage({
            severity: "error",
            message: "Error Occured During Fetching Parameters",
            showSnackBar: true,
          });
        }
      })
  };

  return (
    <div>
      <div className={ParameterClasses.dropdown}>
        <div>
          <SelectEquipment
            list={props.list}
            onUpdateSelectedEquipmentList={onUpdateSelectedEquipmentList}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={onHandleSubmitClick}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={onHandleUpdateEtaBetaDB}
          >
            Restimate Parameters
          </Button>

          {/* <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "20px" }}
            onClick={onHandleUpdateEtaBetaDB}
          >
            Update Parameters from Database
          </Button> */}
        </div>
      </div>
      <div>
        <Table
          columnDefs={ParameterColumns}
          setGrid={setGridApi}
          gridApi={gridApi}
          rowData={rowState}
          tableUpdate={updateFinalRowData}
        ></Table>
        <div>
          <Button
            style={{ float: "right" }}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/data_manager/historical_data"
          >
            Add Data
          </Button>
        </div>
      </div>
      {/* <Button
        variant='contained'
        startIcon={<AddIcon />}
        color="secondary"
        onClick={()=>AddRow()}
        >Add Row</Button>
        <IconButton>
        <DeleteIcon />
        </IconButton> */}
        {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </div>
  );
}

export default ParameterEstimation;
