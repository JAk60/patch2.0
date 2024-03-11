import { Button, Container, DialogContentText, Drawer, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { v4 as uuid } from "uuid";
import { elementActions } from "../../../store/elements";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import UserSelection from "../../../ui/userSelection/userSelection";
import ComponentDetails from "../ComponentDetails/ComponentDetails";
import Flow from "../Flow/flow";
import styles from "./layout.module.css";
import BackToHomeFab from "../../../components/navigation/MuiFap";

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: theme.spacing(1),
  },
}));

const Layout = (props) => {
  const muiCss = useStyles();

  const [value, setValue] = useState([]);
  const [isNodeAddedMap, setIsNodeAddedMap] = useState({});
  const [nomenclature, setNomenclature] = useState([]);
  const [boolcanvas, setBoolCanvas] = useState(false);
  const [clearcanvas, setClearCanvas] = useState(false);
  useEffect(() => {
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
        setTaskNames(data["tasks"]);
        console.log(data["tasks"]);
      });
  }, []);
  const [taskNames, setTaskNames] = useState([]);
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
  const history = useHistory();
  const dispatch = useDispatch();
  const allElements = useSelector((state) => state.elements);
  const components = useSelector((state) => state.userSelection.componentsData);
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const currDepartment = currentSelection["department"];
  console.log("currDepartment", currDepartment);
  useEffect(() => {
    // Reset nomenclature and value when department changes
    setNomenclature([]);
    setValue([]);
    setSelectAllNomenclature(false);
    setSelectAllEquipments(false);
    setBoolCanvas(false);
  }, [currDepartment]);
  console.log("currentSelection", currentSelection);
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
        taskData: allElements["elements"],
        taskName: taskName,
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
  };
  const onLoadHandler = () => {
    console.log(loadname);
    // const ele = JSON.parse(localStorage.getItem("flow"));

    fetch("/load_task_configuration", {
      method: "POST",
      body: JSON.stringify({
        taskName: loadname,
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
        });
      });
    handleLoadClose();
  };
  const systemData = useSelector((state) => state.treeData.treeData);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    // alert(newValue);
    setValue(newValue);
  };
  console.log(value);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [taskName, setTaskName] = useState("");
  const customSelectData = useSelector(
    (state) => state.userSelection.userSelection
  );
  const EqipmentsDataArr = useSelector(
    (state) => state.userSelection.componentsData
  );
  console.log(EqipmentsDataArr);
  const options = customSelectData["equipmentName"];
  const selectedship = currentSelection["shipName"];
  // const  nomenclatureOptions =
  let filteredNomenclatures = EqipmentsDataArr.filter(
    (item) => value.includes(item.name) && item.ship_name === selectedship
  ).map((item) => item.nomenclature);
  filteredNomenclatures = [...new Set(filteredNomenclatures)];
  const ship_name = currentSelection["shipName"];
  console.log(filteredNomenclatures, "F");

  console.log("reactFlowInstance,", reactFlowInstance);

  useEffect(() => {
    // This useEffect will run once when the component is mounted
    if (reactFlowInstance) {
      const isTaskNameAdded = isNodeAddedMap["Task Name"];
      if (!isTaskNameAdded) {
        const newNodeTaskName = {
          id: uuid(),
          type: "systemNode",
          position: { x: 500, y: 300 }, // You can set the initial position as per your requirement
          data: { label: "Task Name" },
          dtype: "node",
          shipName: ship_name,
        };

        dispatch(elementActions.addElement({ ele: newNodeTaskName }));
        setIsNodeAddedMap((prevMap) => ({ ...prevMap, "Task Name": true }));

        // Fit the view to include the newly added node
        reactFlowInstance.fitView();
      }
    }
  }, [reactFlowInstance,clearcanvas]);

  const AddNodes = () => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    // Check if "Task Name" node has already been added
    const isTaskNameAdded = isNodeAddedMap["Task Name"];

    if (!isTaskNameAdded) {
      // If "Task Name" node doesn't exist, display a message or take appropriate action
      console.warn("Task Name node does not exist. Please create it first.");
      return;
    }

    let i = 50; // Initialize i for positioning equipment nodes
    nomenclature.forEach((equipment) => {
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

    setBoolCanvas(true);
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loadopen, setLoadOpen] = useState(false);
  const handleLoadClickOpen = () => setLoadOpen(true);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  // Modify the onDeleteHandler function to open the confirmation dialog
  const onDeleteHandler = async () => {
    setDeleteConfirmationOpen(true);
  };

  // Handle the confirmation and perform deletion
  const handleDeleteConfirmation = async () => {
    try {
      const response = await fetch('/del_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: loadname + '.json' }),
      });

      if (response.ok) {
        // File deleted successfully
        console.log(`File ${loadname} deleted successfully`);
        setTaskNames((prevTaskNames) =>
          prevTaskNames.filter((task) => task !== loadname)
        );
        setLoadName("");
      } else {
        // Handle error cases
        const data = await response.json();
        console.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }

    // Close the confirmation dialog
    setDeleteConfirmationOpen(false);
  };

  // Close the confirmation dialog without performing deletion
  const handleDeleteConfirmationCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleLoadClose = () => setLoadOpen(false);
  const [loadname, setLoadName] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const [selectAllNomenclature, setSelectAllNomenclature] = useState(false);

  const handleChangeNomenclature = (e, value) => {
    if (value.includes("Select All")) {
      setSelectAllNomenclature(true);
      setNomenclature(filteredNomenclatures);
    } else {
      setSelectAllNomenclature(false);
      setNomenclature(value.filter((val) => val !== "Select All"));
    }
  };

  const [selectAllEquipments, setSelectAllEquipments] = useState(false);

  const handleChangeEquipments = (e, value) => {
    if (value.includes("Select All")) {
      setSelectAllEquipments(true);
      setValue(options);
    } else {
      setSelectAllEquipments(false);
      setValue(value.filter((val) => val !== "Select All"));
    }
  };

  return (
    <div className={styles.parent}>
      <BackToHomeFab />
      <div className={styles.flow_div}>
        <Flow
          reactFlowInstance={reactFlowInstance}
          reactFlowWrapper={reactFlowWrapper}
          setReactFlowInstance={setReactFlowInstance}
          boolcanvas={boolcanvas}
          setBoolCanvas={setBoolCanvas}
          clearcanvas={clearcanvas}
          setClearCanvas={setClearCanvas}
          setIsNodeAddedMap={setIsNodeAddedMap}
          setNomenclature={setNomenclature}
          setValue={setValue}
          setSelectAllNomenclature={setSelectAllNomenclature}
          setSelectAllEquipments={setSelectAllEquipments}
        ></Flow>
      </div>
      <Drawer
        anchor="right"
        variant="permanent"
        className={muiCss.sidebar}
        classes={{
          paper: muiCss.drawerPaper,
        }}
      >
        <Container>
          <div className={styles.buttonDiv}>
            {/* <button
              onClick={() => history.push("/")}
              className={styles.savebtn}
            >
              Home
            </button> */}
            <button onClick={handleLoadClickOpen} className={styles.restorebtn}>
              Load Saved Tasks
            </button>
            {showDetails ? (
              <>
                <button onClick={handleClickOpen} className={styles.restorebtn}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowDetails(false);
                  }}
                  className={styles.restorebtn}
                >
                  Back
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowDetails(true);
                }}
                className={styles.restorebtn}
              >
                Component Details
              </button>
            )}
            <Dialog
              maxWidth="sm"
              fullWidth
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
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
                  onChange={(e) => setTaskName(e.target.value)}
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

            <Dialog
              maxWidth="sm"
              fullWidth
              open={loadopen}
              onClose={handleLoadClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Select Task</DialogTitle>
              <DialogContent dividers>
                <Autocomplete
                  value={loadname}
                  options={taskNames}
                  onChange={(value, newValue) => setLoadName(newValue)}
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
                <Button onClick={onDeleteHandler} color="primary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteConfirmationCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {loadname} task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
          </div>
          {/* <p>Here the details of each component goes!!</p> */}
          {showDetails ? (
            <ComponentDetails></ComponentDetails>
          ) : (
            <>
              <UserSelection alignment="vertical" inputWidth="250px" />

              <Autocomplete
                multiple
                options={["Select All", ...options]}
                value={selectAllEquipments ? options : value}
                onChange={handleChangeEquipments}
                style={{ width: 250, marginLeft: 10, marginTop: 12 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Equipments"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                multiple
                options={["Select All", ...filteredNomenclatures]}
                value={
                  selectAllNomenclature ? filteredNomenclatures : nomenclature
                }
                onChange={handleChangeNomenclature}
                style={{ width: 250, marginLeft: 10, marginTop: 12 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Nomenclature"
                    variant="outlined"
                  />
                )}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 45, marginTop: 7 }}
                onClick={() => AddNodes()}
                // disabled={boolcanvas}
              >
                Load Equipments
              </Button>
            </>
          )}
        </Container>
      </Drawer>
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
