import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Paper, Slide, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField, makeStyles
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../../components/navigation/Navigation";
import TreeComponent from "../../components/sortableTree/SortableTree";
import { treeDataActions } from "../../store/TreeDataStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import AutoSelect from "../../ui/Form/AutoSelect";
import UserSelection from "../../ui/userSelection/userSelection";
import AccessControl from "../Home/AccessControl";
import RULPredictor from "./RULPredictor";
import styles from "./rul.module.css";

const useStyles = makeStyles({
  buttons: {
    margin: 5,
    minWidth: 170,
    float: "right",
  },
  align: {
    marginBottom: 10,
  },
  blinkingRow: {
    animation: '$blinking 1s infinite',
  },
  '@keyframes blinking': {
    '0%': {
      background: '#ef5350',
      color: "white"
    },
    '50%': {
      background: 'transparent',
    },
    '100%': {
      background: '#ef5350',
      color: "white"
    },
  },
});



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const BlinkingTableRow = ({ row, lowestValue }) => {
  const isLowestValue = row.value === lowestValue;
  const classes = useStyles();

  return (
    <TableRow className={isLowestValue ? classes.blinkingRow : ''}>
      <TableCell style={{fontSize: "18px"}}>{row.key}</TableCell>
      <TableCell style={{fontSize: "18px"}}>{row.value}</TableCell>
    </TableRow>
  );
};


const BlinkingTable = ({ data, handleClose}) => {
  const rows = Object.entries(data.results).map(([key, value]) => ({ key, value }));
  const lowestValue = Math.min(...rows.map(row => row.value));

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">RUL OF ALL SENSORS OF EQUIPMENT</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: "18px", width: "40%", fontWeight: "bold"}}>Sensor Name</TableCell>
                  <TableCell style={{ fontSize: "18px" , fontWeight: "bold"}}>Remaining Useful Life (RUL) Confidence(90%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <BlinkingTableRow key={index} row={row} lowestValue={lowestValue} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const RulLife = () => {
  const [paramOptions, setParamOptions] = useState([]);
  const [selectedParameterName, setParameterName] = useState("");
  const [selectedEqName, setEquipmentName] = useState([]);
  const [para, setPara] = useState([]);
  const [prevrul, setPrevrul] = useState();
  const [isRulOpen, setRulOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [P, setP] = useState(0);
  const [F, setF] = useState(0);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [jsonData, setJsonData] = useState({});

  // Function to handle file upload
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    console.log(uploadedFile);
    const formData = new FormData();
    formData.append("file", file);

    fetch("/csv_upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data); // Response from the server
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  };

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
    accept: ".csv", // Accept only CSV files, you can modify this to accept other file types
    multiple: false, // Allow only one file to be uploaded at a time
  });

  const dispatch = useDispatch();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  let fData = useSelector((state) => state.treeData.treeData);
  console.log(selectedParameterName);
  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentNomenclature = currentSelection["nomenclature"];
  const matchingItems = sData.filter(item => item.nomenclature === currentNomenclature);

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
  };

  const handlePrevRul = (e, p) => {
    e.preventDefault();
    console.log(para)
    const filteredObjects = para.filter(obj => obj.name === p);
    let equipmentId = null;
    if (filteredObjects.length > 0) {
      equipmentId = filteredObjects[0].equipment_id;
    }
    console.log(matchingItems, "matching items")
    // fetch("/prev_rul", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     parameter: p,
    //     equipment_id: equipmentId
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setPrevrul(data);
    //     setRulOpen(true);
    //     console.log("RUL DATA",data);
    //   })
    //   .catch((error) => {
    //     console.error("Fetch Error:", error);
    //     throw error;
    //   });
    setSelectedEquipmentId(equipmentId);

    fetch("/get_pf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: selectedParameterName,
        equipment_id: equipmentId
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.code && data.results.length == 1) {
          setP(data.results[0].P)
          setF(data.results[0].F)
        } else if (data.results.length == 0) {
          setSnackBarMessage({
            severity: "error",
            message: "Please Fill The Information",
            showSnackBar: true,
          });
        }
        else {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        }

      })

  };

  useEffect(() => {
    fetch("/cm_dashboard", {
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
        const params = data["parameters"];
        console.log("luck", params);
        setPara(params);
      })
      .catch((error) => {
        // Handle fetch error
      });
  }, [selectedEqName]);

  useEffect(() => {
    console.log("s");
    const selectedEqNameArray = Object.values(selectedEqName).map(
      (equipment) => equipment
    );
    console.log(selectedEqNameArray);

    const filteredArray = para.filter((item) =>
      selectedEqNameArray.includes(item.equipment_id)
    );

    console.log(filteredArray, "nafkja");

    const filteredNames = filteredArray.map((item) => item.name);
    setParamOptions(filteredNames);
  }, [selectedEqName, para]);

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

  const classes = useStyles();


  const handleClick = () => {
    console.log(selectedEquipmentId)
    fetch("/rul_equipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        equipmentId: selectedEquipmentId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setJsonData(data);
        } else {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        }
        setShowTable(true); // Moved inside the promise chain
      })
  };

  const handleClose = () => {
    setShowTable(false);
  };

  

  return (
    <>
      <AccessControl allowedLevels={['L1', 'L5']}>
        <Navigation />
        <div className={styles.userSelection}>
          <UserSelection />
          <div>
            <Button
              className={classes.buttons}
              onClick={onLoadTreeStructure}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.tree}>
            <div className={styles.treeChild}>
              <TreeComponent></TreeComponent>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.userSelection}>
              <div className={styles.selectContainer}>
                <div className={styles.selectC}>
                  Select Component
                  <AutoSelect
                    fields={fData}
                    onChange={(e, value) => setEquipmentName(value)}
                    value={selectedEqName}
                  ></AutoSelect>
                </div>
                <div>
                  Select Parameter
                  <Autocomplete
                    className={styles.SelectP}
                    id="tags-standard"
                    options={paramOptions}
                    // getOptionLabel={(option) => option.name}
                    value={selectedParameterName}
                    onChange={(e, value) => setParameterName(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                        }}
                        variant="standard"
                      />
                    )}
                  />
                </div>
                {/* <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button
                  className={classes.buttons}
                  variant="contained"
                  color="primary"
                >
                  Upload File
                </Button>
              </div> */}
                <div className={styles.importBtnContainer}>
                  <Button
                    className={classes.buttons}
                    variant="contained"
                    color="primary"
                    onClick={(e) => handlePrevRul(e, selectedParameterName)}
                  >
                    Fetch P & F
                  </Button>
                </div>
              </div>
            </div>
            {/* {isRulOpen && ( */}
            <RULPredictor equipmentId={selectedEquipmentId} parameter={selectedParameterName} P={P} F={F} />
            {/* )} */}
            <Button variant="contained" color="primary" onClick={handleClick} style={{marginTop: "15px"}}>
              Most Prominent Sensor
            </Button>
            {showTable && <BlinkingTable data={jsonData} handleClose={handleClose} equipmentName={selectedEqName}/>}
          </div>
        </div>

        {SnackBarMessage.showSnackBar && (
          <CustomizedSnackbars
            message={SnackBarMessage}
            onHandleClose={onHandleSnackClose}
          />
        )}
      </AccessControl>
    </>
  );
};

export default RulLife;