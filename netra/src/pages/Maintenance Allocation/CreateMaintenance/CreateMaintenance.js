import React,{useState} from 'react'
import Navigation from '../../../components/navigation/Navigation';
import styles from "./CreateMaintenance.module.css";
import UserSelection from '../../../ui/userSelection/userSelection'
import { Button,RadioGroup,FormControlLabel,Radio } from '@material-ui/core';
import TreeComponent from '../../../components/sortableTree/SortableTree';
import { useSelector,useDispatch } from 'react-redux';
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from '../../../ui/Form/AutoSelect';
import { Route } from 'react-router';
import AssignType from './AssignType';
import CustomizedSnackbars from '../../../ui/CustomSnackBar';



const CreateMaintenance=(props)=> {
    const dispatch = useDispatch();
    const currentSelection = useSelector(
        (state) => state.userSelection.currentSelection
      );
    let fData = useSelector((state) => state.treeData.treeData);
    //console.log(fData);
    const sData = useSelector((state) => state.userSelection.componentsData);

    const currentNomenclature = currentSelection["nomenclature"];
    const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature);
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
        nomenclature: currentSelection["nomenclature"],
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

      const[selectedComponent,setComponent]=useState(null)
      const selectOnChange=(e,value)=>{
        setComponent(value)
      }
    return (
      <>
      <Navigation/>
      <div className={styles.userSelection}>
          <UserSelection/>
          <Route exact path='/maintenance_allocation/create'>
            <Button className={styles.btn} onClick={onLoadTreeStructure} variant='contained' color='primary'>Submit</Button>
          </Route>
          <Route exact path='/maintenance_allocation/create/assignMaintenance'>
            <Button className={styles.btn} onClick={onLoadTreeStructure} variant='contained' color='primary'>Submit</Button>
          </Route>
      </div>
      <Route exact path='/maintenance_allocation/create'>
          
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
                    fields={fData}
                    onChange={selectOnChange}
                    value={selectedComponent}
                  ></AutoSelect>
              </div>
              
              <Button className={styles.nextbtn} onClick={()=>{
                if(selectedComponent!=null){
                  props.history.push(`/maintenance_allocation/create/assignMaintenance`)
                  }else{
                    alert('Select a component')
                  }}} variant='contained' color='primary'>Next</Button>
            </div>
          </div>
      </Route>
      <Route exact path='/maintenance_allocation/create/assignMaintenance'>
          <AssignType selectedComponent={selectedComponent}/>
      </Route>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
    );
  }
  export default CreateMaintenance;