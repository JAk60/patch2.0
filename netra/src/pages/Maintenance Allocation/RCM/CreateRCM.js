import React, { useState } from 'react'
import Navigation from '../../../components/navigation/Navigation';
import styles from "../CreateMaintenance/CreateMaintenance.module.css";
import UserSelection from '../../../ui/userSelection/userSelection'
import { Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import TreeComponent from '../../../components/sortableTree/SortableTree';
import { useSelector, useDispatch } from 'react-redux';
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from '../../../ui/Form/AutoSelect';
import { Route, useHistory } from 'react-router';
// import { useHistory } from "react-router-dom";
// import {useNavigate} from 'react-router-dom'
// import AssignType from './AssignType';
import AssignType from '../CreateMaintenance/AssignType';
import CustomizedSnackbars from '../../../ui/CustomSnackBar';



const CreateRCM = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  let fData = useSelector((state) => state.treeData.treeData);
  debugger;
  fData = fData.filter(x => x.parentName === currentSelection["equipmentName"] || x.parentId === null)
  //console.log(fData);
  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentEquipmentName = currentSelection["equipmentName"];
  const matchingItems = sData.filter(item => item.name === currentEquipmentName);
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
    fetch("/fetch_system", {
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

    setSnackBarMessage({
      severity: "success",
      message: "System is Loaded For RCM Analysis",
      showSnackBar: true,
    });
  };

  const [selectedComponent, setComponent] = useState([])
  const selectOnChange = (e, value) => {
    setComponent(value)
  }

  const nextLevelBtn = () => {
    history.push('/maintenance_allocation/conduct_rcm_analysis/critical_comp')
  }

  const SaveAssemplyHandler = () => {
    // alert("Hello");
    console.log(selectedComponent);
    fetch("/save_assembly_rcm", {
      method: "POST",
      body: JSON.stringify({
        system: currentSelection["equipmentName"],
        ship_name: currentSelection["shipName"],
        asm_data: selectedComponent
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        // alert(d.message)
        setSnackBarMessage({
          severity: "success",
          message: d.message,
          showSnackBar: true,
        });
      })
  }

  return (
    <>
      <Navigation />
      <div className={styles.userSelection}>
        <UserSelection />
        <Button className={styles.btn} onClick={onLoadTreeStructure} variant='contained' color='primary'>Load System</Button>
        {/* <Route exact path='/maintenance_allocation/create'>
          
          </Route> */}
      </div>
      {/* <Route exact path='/maintenance_allocation/create'>
          
          
      </Route> */}
      <div className={styles.content}>
        <div className={styles.tree}>
          <div className={styles.treeChild}>
            {/* <FullscreenIcon style={{ float: "right", marginRight: "25px" }} /> */}
            <TreeComponent height='600px'></TreeComponent>
            {/* <div></div> */}
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.selectComponent}>
            Select Assemblies to be included for RCM Analysis
            <AutoSelect
              multiple="multiple"
              fields={fData}
              onChange={selectOnChange}
              value={selectedComponent}
            ></AutoSelect>
          </div>
          <Button className={styles.nextbtn} onClick={nextLevelBtn} variant='contained' color='primary'>Add Information for Critical Components</Button>
          <Button className={styles.nextbtn} onClick={SaveAssemplyHandler} style={{ marginRight: "2rem" }} variant='contained' color='primary'>Save</Button>
        </div>
      </div>
      {/* <Route exact path='/maintenance_allocation/create/assignMaintenance'>
          <AssignType selectedComponent={selectedComponent}/>
      </Route> */}
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
}
export default CreateRCM;