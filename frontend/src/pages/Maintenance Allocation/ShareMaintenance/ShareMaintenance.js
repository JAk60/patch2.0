import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../../../components/navigation/Navigation';
import TreeComponent from '../../../components/sortableTree/SortableTree';
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from '../../../ui/Form/AutoSelect';
import UserSelection from '../../../ui/userSelection/userSelection';
import styles from "./ShareMaintenance.module.css";



const ShareMaintenance = (props) => {
  const dispatch = useDispatch();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  let fData = useSelector((state) => state.treeData.treeData);
  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentNomenclature = currentSelection["nomenclature"];
  const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature);

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

    setComponent(value)
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
          <div className={styles.selectComponent}>
            Select Component
            <AutoSelect
              multiple={true}
              fields={fData}
              onChange={selectOnChange}
              value={selectedComponent}
            ></AutoSelect>
          </div>
        </div>
      </div>

    </>
  );
}
export default ShareMaintenance;