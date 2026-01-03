import { Button } from '@material-ui/core';
import { AgGridColumn } from 'ag-grid-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../../../components/navigation/Navigation';
import TreeComponent from '../../../components/sortableTree/SortableTree';
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from '../../../ui/Form/AutoSelect';
import Table from '../../../ui/Table/Table';
import UserSelection from '../../../ui/userSelection/userSelection';
import styles from "./ModifyandDisplayMaintenance.module.css";

const ModifyandDisplayMaintenance = (props) => {

  // const rowData = []
  const [rowData, setRowData] = useState([])
  const [tableRows, setTableRows] = useState([])
  const DCcolumnDefs = [
    <AgGridColumn
      field="name"
      headerName="Parameter Name"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="failure_mode_id"
      headerName="Failure Mode"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="level"
      headerName="Level Name"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="min_value"
      headerName="Min Value"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="max_value"
      headerName="Max Value"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="unit"
      headerName="Unit"
      type="number"
      width={500}
      editable={true}
    />,
    <AgGridColumn
      field="threshold"
      headerName="Threshold"
      type="number"
      width={500}
      editable={true}
    />,
  ];
  const dispatch = useDispatch();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  let fData = useSelector((state) => state.treeData.treeData);
  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentEquipmentName = currentSelection["equipmentName"];
  const matchingItems = sData.filter(item => item.name === currentEquipmentName);

  const matchingId = matchingItems[0]?.id;
  const onLoadTreeStructure = () => {
    const payload = {
      system: currentSelection["equipmentName"],
      ship_name: currentSelection["shipName"],
    };

    if (matchingId) {
      payload.component_id = matchingId;
    }
    console.log(payload)
    fetch("/api/fetch_system", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        let treeD = d["treeD"];
        let failureModes = d["failureMode"];
        console.log(failureModes)
        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
          }),
        );
        dispatch(
          treeDataActions.setFailureModes(failureModes)
        )
      });
  };
  const [selectedComponent, setComponent] = useState(null)
  const selectOnChange = (e, value) => {
    debugger
    setComponent(value)
  }
  const updateFinalRowData = (allRows) => {
    setTableRows(allRows);
  };
  const deleteProfile = () => {
    if (selectedComponent != null) {
      fetch("/api/fetch_condition_monitoring", {
        method: "POST",
        body: JSON.stringify({
          system: selectedComponent,
          type: "delete"
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((d) => {
          console.log(d)
        });
    } else {
      alert("Please select component first!!")
    }
  }
  const updateTable = () => {
    fetch("/api/fetch_condition_monitoring", {
      method: "POST",
      body: JSON.stringify({
        system: tableRows,
        type: "update"
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        console.log(d)
      });
  }
  const submitForDisplay = () => {
    debugger;
    if (selectedComponent == null) {
      alert("Please select component")
    } else {
      fetch("/api/fetch_condition_monitoring", {
        method: "POST",
        body: JSON.stringify({
          system: selectedComponent,
          type: "display"
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((d) => {
          setRowData(d)
        });
    }
  }


  return (
    <>
      <Navigation />
      <div className={styles.userSelection}>
        <UserSelection />
        <Button className={styles.btn} onClick={onLoadTreeStructure} variant='contained' color='primary'>Submit</Button>
      </div>

      <div className={styles.content}>
        <div className={styles.tree}>
          <div className={styles.treeChild}>
            {/* <FullscreenIcon style={{ float: "right", marginRight: "25px" }} /> */}
            <TreeComponent height='600px'></TreeComponent>
            {/* <div></div> */}
          </div>
        </div>
        <div className={styles.rightSection}>
          <div>
            <div className={styles.selectComponent}>
              Select Component
              <AutoSelect
                fields={fData}
                onChange={selectOnChange}
                value={selectedComponent}
              ></AutoSelect>
            </div>
            <Button className={styles.submitbtn} onClick={submitForDisplay} variant='contained' color='primary' >Submit</Button>
            <Button className={styles.submitbtn} onClick={updateTable} variant='contained' color='primary' >Update</Button>
            <Button className={styles.submitbtn} onClick={deleteProfile} variant='contained' color='primary' >Delete Param Profile</Button>
          </div>
          <div className={styles.tablediv}>
            <Table columnDefs={DCcolumnDefs}
              rowData={rowData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </div>
      </div>

    </>
  );
}
export default ModifyandDisplayMaintenance;