import React, { useState, useCallback, useEffect } from "react";
import Navigation from "../../components/navigation/Navigation";
import styles from "./rul.module.css";
import UserSelection from "../../ui/userSelection/userSelection";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import TreeComponent from "../../components/sortableTree/SortableTree";
import { useSelector, useDispatch } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import AutoSelect from "../../ui/Form/AutoSelect";
import { useDropzone } from "react-dropzone";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import RULPredictor from "./RULPredictor";
import AccessControl from "../Home/AccessControl";

const useStyles = makeStyles({
  buttons: {
    margin: 5,
    minWidth: 170,
    float: "right",
  },
  align: {
    marginBottom: 10,
  },
});

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
        if(data.code && data.results.length == 1){
          setP(data.results[0].P)
          setF(data.results[0].F)
        }else if(data.results.length == 0){
          setSnackBarMessage({
            severity: "error",
            message: "Please Fill The Information",
            showSnackBar: true,
          });
        }
        else{
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
            <TreeComponent height="600px"></TreeComponent>
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
                  Calculate RUL
                </Button>
              </div>
            </div>
          </div>
          {/* {isRulOpen && ( */}
            <RULPredictor  equipmentId={selectedEquipmentId} parameter={selectedParameterName} P={P} F={F} />
          {/* )} */}
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