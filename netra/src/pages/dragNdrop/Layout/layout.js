import ComponentDetails from "../ComponentDetails/ComponentDetails";
import Flow from "../Flow/flow";
import classes from "./layout.module.css";
import Sidebar from "../SideBar/Sidebar";
import { elementActions } from "../../../store/elements";
import { useDispatch, useSelector } from "react-redux";
import UserSelection from "../../../ui/userSelection/userSelection";
import { useEffect, useRef, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import { TextField,Button, Select } from "@material-ui/core";
import { treeDataActions } from "../../../store/TreeDataStore";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import { filter } from "lodash";

const Layout = (props) => {
  const [isNodeAddedMap, setIsNodeAddedMap] = useState({});
  useEffect(()=>{
    fetch("/fetch_tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        
        setTaskNames(data['tasks'])
        console.log(data['tasks'])
      });
  },[])
  const [taskNames,setTaskNames]=useState([])
  // Snackbar
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };
  const history=useHistory()
  const dispatch = useDispatch();
  const allElements = useSelector((state) => state.elements);
  const components = useSelector((state) => state.userSelection.componentsData);
  const currentSelection = useSelector((state) => state.userSelection.currentSelection);
  // console.log(components);
  const onSaveHandler = () => {
    // const stringObject = JSON.stringify(allElements);
    // localStorage.setItem("flow", stringObject);
    // console.log(prompt("Enter Task Name"))

    //SAVE TO DB LOGIC - NOW USING SAVE TO FILE
    // let edges=allElements.elements.filter(data=>data.dtype==='edge')
    // let finalData=allElements.elements.filter(data=>data.dtype==='node').map(
    //   node=>{
    //     if(node.type==='component'){
    //       let edge=edges.filter(edge=>edge.target===node.id)[0]
    //       let newnode={...node,parentId:edge.source,equipmentId:components.filter(x=>x.name===node.data.label)[0].id}
    //       return newnode
    //     }
    //     else if(node.type==='systemNode'){
    //       let newnode={...node,data:{label:taskName}}
    //       return newnode
    //     }
    //   }
    // )
    // console.log(finalData);

    //SAVING TO FILE DIRECTLY
    debugger;
    fetch("/save_task_configuration", {
      method: "POST",
      body: JSON.stringify({
        taskData: allElements['elements'],
        taskName: taskName
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
        if (data.error) {
          setSnackBarMessage({
            severity: "warning",
            message: data.error.message, // Access the error message here
            showSnackBar: true,
          });
        } else {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
        }
      })
      .catch((error) => {
        setSnackBarMessage({
          severity: "error",
          message: error.message, // Update this line to access the error message
          showSnackBar: true,
        });
      });
    setOpen(false);
    }    
  const onLoadHandler = () => {
    console.log(loadname);
    // const ele = JSON.parse(localStorage.getItem("flow"));

    fetch("/load_task_configuration", {
      method: "POST",
      body: JSON.stringify({
        taskName:loadname
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
        dispatch(elementActions.onRestoreHandler({ elements: data }));
        setSnackBarMessage({
          severity: "success",
          message: "Data loaded successfully",
          showSnackBar: true,
        });
      })
      .catch((error) => {
        setSnackBarMessage({
          severity: "error",
          message: "Some Error Occured. " + error,
          showSnackBar: true,
        })
      })
      handleLoadClose()
  };
  const [value, setValue] = useState([]);
  const systemData = useSelector((state) => state.treeData.treeData);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    // alert(newValue);
    setValue(newValue);
  };
  console.log(value);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [taskName,setTaskName] = useState("")
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  // const currentSelection = useSelector(
  //   (state) => state.userSelection.currentSelection
  // );
  const options=customSelectData["equipmentName"]
  const ship_name = currentSelection["shipName"]
  // console.log(currentSelection)
  const AddNodes = () => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
  
    // Check if "Task Name" node has already been added
    const isTaskNameAdded = isNodeAddedMap["Task Name"];
  
    if (!isTaskNameAdded) {
      // Create the "Task Name" node
      const newNodeTaskName = {
        id: uuid(),
        type: "systemNode",
        position: reactFlowInstance.project({
          x: reactFlowBounds.left + 600,
          y: reactFlowBounds.top + 600,
        }),
        data: { label: "Task Name" },
        dtype: "node",
        shipName: ship_name,
      };
  
      dispatch(elementActions.addElement({ ele: newNodeTaskName }));
      setIsNodeAddedMap((prevMap) => ({ ...prevMap, "Task Name": true }));
    }
  
    let i = 50; // Initialize i for positioning equipment nodes
    value.forEach((equipment) => {
      if (!isNodeAddedMap[equipment]) {
        // Create equipment nodes
        const style = {
          border: "1px solid black",
          borderRadius: "5px",
          background: "#DCFFC0",
          borderColor: "black",
          padding: "20px",
        };
  
        const position = reactFlowInstance.project({
          x: reactFlowBounds.left + i,
          y: reactFlowBounds.top + i,
        });
  
        const newNodeEquipment = {
          id: uuid(),
          type: "component",
          position,
          data: { label: equipment },
          dtype: "node",
          style: style,
          shipName: ship_name,
          metaData: currentSelection,
        };
  
        dispatch(elementActions.addElement({ ele: newNodeEquipment }));
        setIsNodeAddedMap((prevMap) => ({ ...prevMap, [equipment]: true }));
      }
  
      i += 50; // Increment the positioning index for the next node
    });
  };
  

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loadopen, setLoadOpen] = useState(false);
  const handleLoadClickOpen = () => setLoadOpen(true);
  const handleLoadClose = () => setLoadOpen(false);
  const [loadname,setLoadName]=useState('')
  const [showDetails,setShowDetails]=useState(false)

  return (
    <div className={classes.parent}>
        {/* <div className={classes.text_div}>
          <Sidebar></Sidebar>
          <div className={classes.buttonDiv}>
          <button onClick={onSaveHandler} className={classes.savebtn}>
            Save
          </button>
          <button onClick={onRestoreHandler} className={classes.restorebtn}>
            Restore
          </button>
        </div>
        </div> */}
        <div className={classes.flow_div}>
          <Flow reactFlowInstance={reactFlowInstance} reactFlowWrapper={reactFlowWrapper} setReactFlowInstance={setReactFlowInstance}></Flow>
        </div>
      <div className={classes.sidebar}>
      <div className={classes.buttonDiv}>
          <button onClick={()=>history.push("/")} className={classes.savebtn}>
            Home
          </button>
          <button onClick={handleClickOpen} className={classes.restorebtn}>
            Save
          </button>
          <button onClick={handleLoadClickOpen} className={classes.restorebtn}>
            Load
          </button>
          {showDetails?<button onClick={()=>{setShowDetails(false)}} className={classes.restorebtn}>
            Back
          </button>:<button onClick={()=>{setShowDetails(true)}} className={classes.restorebtn}>
            Component Details
          </button>}
          {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Save
      </Button> */}
      <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter task name</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task name"
            type="text"
            fullWidth
            value={taskName}
            onChange={(e)=>setTaskName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSaveHandler} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth='sm' fullWidth open={loadopen} onClose={handleLoadClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Task</DialogTitle>
        <DialogContent dividers>
          
          <Autocomplete
            value={loadname}
            options={taskNames}
            onChange={(value,newValue)=>setLoadName(newValue)}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
            />
            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoadClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onLoadHandler} color="primary">
            Load
          </Button>
        </DialogActions>
      </Dialog>
     
        </div>
        {/* <p>Here the details of each component goes!!</p> */}
       {showDetails?<ComponentDetails></ComponentDetails>:<><UserSelection alignment="vertical" inputWidth="250px"/>
        
        <Autocomplete
        multiple
      options={options}
      //value={value}
      onChange={handleChange}
      // groupBy={(option) => option.parentName}
      // getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Equipments"
          variant="outlined"
        />
        
      )}  
    />
    <Button
                variant="contained"
                color="primary"
                onClick={()=>AddNodes()}
              >
                Load Equipments
              </Button>
    </>}
    
    
      </div>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </div>
    
  );
};

export default Layout;
