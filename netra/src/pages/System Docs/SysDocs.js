import React, { useEffect, useState } from "react";
import NewModule from "../../components/module/NewModule";
import Navigation from "../../components/navigation/Navigation";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./SysDocs.module.css";
import ustyles from '../systen_configuration/SystemConfiguration.module.css'
import { AgGridColumn } from "ag-grid-react";
import Table from "../../ui/Table/DataManagerTable";
import { Button, makeStyles, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

//From Add new equipment form
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import classes from "./EqptStructuring.module.css";
import LabelToolTip from "../../components/main/EqptStructuring/LabelToolTip/LabelToolTip";
// import Tree from "./Tree";
// import TreeComponent from "../../sortableTree/SortableTree";
import CustomTextInput from "../../ui/Form/CustomTextInput";
import CustomSelect from "../../ui/Form/CustomSelect";
import AutoSelect from "../../ui/Form/AutoSelect";
import { useFormik } from "formik";
import { v4 as uuid } from "uuid"; 
const useStyles = makeStyles({
    root: {
      margin: "0 2.5em",
    },
  });
  
const SystemStyles = makeStyles({
  formControl: {
    margin: "2rem",
    minWidth: 200,
  },
  Submit: {
    margin: "2rem",
  },
  buttons: {
    minWidth: 150,
    marginLeft: 10,
    marginTop: 15,
    float: "right",
  },
});
const SysDocs = (props) => {
  const SystemClasses = SystemStyles();
  const dispatch = useDispatch();
  const selectedInputs = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const [disableButton, setDisableButton] = useState(false);
  let fData = useSelector((state) => state.treeData.treeData);
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    // alert("fghfgh")
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadClick = () => {
    const data = new FormData() 
    data.append('file', file)
    data.append("system", selectedInputs["equipmentName"])
    data.append("name", selectedInputs["shipName"])
    // if (!file) {
    //   return;
    // }

    // // 👇 Uploading the file using the fetch API to the server
    fetch('/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log("fs")
      });
    });
  };
//   const [gridApi, setGridApi] = useState(null);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Close",
      showSnackBar: false,
    });
  };
  const [parentFiledValue, setParentFieldValue] = useState({
    title: "",
    name: "",
    children: [],
    id: "",
    eqType: "",
    parentName: "",
    parentId: "",
    lmu: 1,
  });
  const[questionsOptions,setquestionsOptions]=useState([]);
  const[selectedFileName,setselectedFileName]=useState(null);
  const questionOnChange = (e) => {
    debugger;
    let data = e.target.value;
    let name = e.target.name;
    setselectedFileName(data)
  }
  const classesButton = useStyles();
  const parentOnChange = (e, value) => {
    debugger
    setParentFieldValue(value);
  };
  const clearForm = (e) => {
    e.preventDefault();
    setDisableButton(false);
    dispatch(treeDataActions.setTreeData({ treeData: [] }));
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
        command: "",
      ship_name: "",
      department: "",
      shipClass: "",
      shipC: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values, {resetForm}) => {
      // alert(JSON.stringify(values, null, 2));
      debugger;
    //   const { platform, platformType, system, systemType } = values;
      console.log(values);
      fetch("/addUserSelectionData", {
        method: "POST",
        body: JSON.stringify({values}),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
            if (data.code == 1){
                // resetForm()
              setSnackBarMessage({
                severity: "success",
                message: data.message,
                showSnackBar: true,
          });
        }else{
            setSnackBarMessage({
                severity: "error",
                message: data.message,
                showSnackBar: true,
          });
        }
        })
    //   
    //   const platformId = uuid();
    //   const systemId = uuid();
    //   debugger;
    //   const treeNodes = [
    //     {
    //       name: system,
    //       id: systemId,
    //       eqType: systemType,
    //       parentName: selectedInputs["shipName"],
    //       parentId: null,
    //       parent: null,
    //       children: [],
    //       lmu: 1,
    //       command: selectedInputs["command"],
    //       department: selectedInputs["department"],
    //       shipCategory: selectedInputs["shipCategory"],
    //       shipClass: selectedInputs["shipClass"],
    //       shipName: selectedInputs["shipName"],
    //     },
    //   ];
    //   const updateEqStore = {
    //     equipmentName: system,
    //     equipmentCode: systemType,
    //   };
    //   const filteredData = {
    //     equipmentName: [system],
    //     equipmentCode: [systemType],
    //   };
    //   dispatch(treeDataActions.addElement({ data: treeNodes }));
    //   dispatch(
    //     userActions.onAddingEquipmentName({
    //       selectedData: updateEqStore,
    //       filteredData: filteredData,
    //     })
    //   );
    //   setDisableButton(true);
    },
  });

  const loadFiles = () => {
    fetch("/fetch_system_files", {
      method: "POST",
      body: JSON.stringify({"system": selectedInputs["equipmentName"], "ship_name": selectedInputs["shipName"]}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      }).then((d) => {
        // debugger;
        setquestionsOptions(d.files)
      })
  }

  //handle download
  const downloadFile = () => {
    let system = selectedInputs["equipmentName"].replace(/\s/g,'')
    let ship_name = selectedInputs["shipName"].replace(/\s/g,'')
    let nnn = selectedFileName
    // alert(questionsOptions)
    const link = document.createElement('a');
    link.download = `${selectedFileName}`;
    //       // 👇️ set to relative path
    link.href = `/${ship_name}_${system}/${selectedFileName}`;
    link.click();
  }
  //Save Button Handler
 

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        {/* <div className={styles.module}>
          <NewModule />
        </div> */}
        {/* <div className={styles.user}>
          <Button
            variant="contained"
            color="primary"
            className={SystemClasses.buttons}
            onClick={onSaveButtonClickHandler}
          >
            Save
          </Button>
        </div> */}
        <div className={ustyles.flex} style={{ marginTop: "5rem" }}>
          <div className={ustyles.user} ><UserSelection /></div>
          <div className={styles.buttons}>
          <Button
                variant="contained"
                color="primary"
                className={SystemClasses.buttons}
                onClick={loadFiles}
              >
                Load System
              </Button>
        </div>
          </div>

        <div className={styles.table}>
          {/* <Table
            rowData={rowState}
            columnDefs={MProfileColumns}
            tableUpdate={setFinalTableData}
            setGrid={setGridApi}
            gridApi={gridApi}
          /> */}
         <div className={classes.form}>
      <div className={classes.header}>Previously Added Documents</div>
        <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
          <div className={classes.formrow1}>
            <div className={classes.field1}>
              {/* <LabelToolTip label="Command Name" info="Info" /> */}
              <CustomSelect
                style={{ width: '100%'}}
                id="q7"
                name= ""
                label=""
                fields={questionsOptions}
                onChange={questionOnChange}
                value={''}

                />
            </div>
            
          </div>
          
          <div className={classes.formrow1}>
          <div className={classes.field1}>
          <input type="file" onChange={handleFileChange} />
            </div>  
          <div className={classes.field1}>
          <Button
                variant="contained"
                component="label"
                className={classesButton.root}
                onClick={downloadFile}
              >
                Download File
              </Button>
          </div>
            <div className={classes.field1}>
              <Button
                variant="contained"
                component="label"
                className={classesButton.root}
                onClick={handleUploadClick}
              >
                Upload File
              </Button>
            </div>
          </div>
        </form>
       
      </div>
          {/* <div className={styles.tableFooter}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="secondary"
              onClick={() => AddRow()}
            >
              Add Row
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              onClick={() => deleteRows()}
            >
              Delete Rows
            </Button>
          </div> */}
        </div>
      </div>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};

export default SysDocs;
