import React, { useState } from "react";
import { Button, makeStyles, Tab, Tabs } from "@material-ui/core";
import Navigation from "../../components/navigation/Navigation";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import UserSelection from "../../ui/userSelection/userSelection";
import ustyles from "../systen_configuration/SystemConfiguration.module.css";
import styles from "./SysDocs.module.css";
import { useDispatch, useSelector } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";
import classes from "./EqptStructuring.module.css";
import { useFormik } from "formik";
import CustomSelect from "../../ui/Form/CustomSelect";

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
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
  const classesButton = useStyles();
  const dispatch = useDispatch();
  const selectedInputs = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const [disableButton, setDisableButton] = useState(false);
  const [file, setFile] = useState();
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
  const [activeTab, setActiveTab] = useState(0);
  const [questionsOptions, setquestionsOptions] = useState([]);
  const [selectedFileName, setselectedFileName] = useState(null);

  const questionOnChange = (e) => {
    let data = e.target.value;
    let name = e.target.name;
    setselectedFileName(data);
  };

  const parentOnChange = (e, value) => {
    setParentFieldValue(value);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    const data = new FormData();
    data.append("file", file);
    data.append("system", selectedInputs["equipmentName"]);
    data.append("name", selectedInputs["shipName"]);

    fetch("/upload", {
      method: "POST",
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log("fs");
      });
    });
  };

  const formik = useFormik({
    initialValues: {
      command: "",
      ship_name: "",
      department: "",
      shipClass: "",
      shipC: "",
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      fetch("/addUserSelectionData", {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 1) {
            setSnackBarMessage({
              severity: "success",
              message: data.message,
              showSnackBar: true,
            });
          } else {
            setSnackBarMessage({
              severity: "error",
              message: data.message,
              showSnackBar: true,
            });
          }
        });
    },
  });

  const loadFiles = () => {
    fetch("/fetch_system_files", {
      method: "POST",
      body: JSON.stringify({
        system: selectedInputs["equipmentName"],
        ship_name: selectedInputs["shipName"],
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        setquestionsOptions(d.files);
      });
  };

  const downloadFile = () => {
    let system = selectedInputs["equipmentName"].replace(/\s/g, "");
    let ship_name = selectedInputs["shipName"].replace(/\s/g, "");
    let nnn = selectedFileName;
    const link = document.createElement("a");
    link.download = `${selectedFileName}`;
    link.href = `/${ship_name}_${system}/${selectedFileName}`;
    link.click();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        <div className={ustyles.flex} style={{ marginTop: "5rem" }}>
          <div className={ustyles.user}>
            <UserSelection />
          </div>
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            indicatorColor="primary"
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            className={classes.tabs}
          >
            <Tab label="UPLOAD" />
            <Tab label="DOWNLOAD" />
          </Tabs>
        </div>
        <div className={styles.table}>
          <div className={classes.root}>
            {activeTab === 1 && ( // Check for the active tab index
              <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                <div className={classes.formrow1}>
                  <div className={classes.field1}>
                    <CustomSelect
                      style={{ width: "100%" }}
                      id="q7"
                      name=""
                      label=""
                      fields={questionsOptions}
                      onChange={questionOnChange}
                      value={""}
                    />
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
                </div>
              </form>
            )}

            {activeTab === 0 && ( // Check for the active tab index
              <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
                <div className={classes.formrow1}>
                  <div className={classes.field1}>
                    <input type="file" onChange={handleFileChange} />
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
            )}
          </div>
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
