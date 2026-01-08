import { Button, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navigation from "../../components/navigation/Navigation";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import CustomSelect from "../../ui/Form/CustomSelect";
import UserSelection from "../../ui/userSelection/userSelection";
import styles from "./SysDocs.module.css";

const useStyles = makeStyles({
  btn: {
    margin: "0 2.5em",
    // height: "26px"
  },
  tabs: {
    marginTop: "1rem",
  },
  formControl: {
    margin: "2rem",
    minWidth: 200,
  },
  submit: {
    margin: "2rem",
  },
  buttons: {
    minWidth: 150,
    marginLeft: 10,
    marginTop: 15,
    float: "right",
  },
  dottedBorder: {
    padding: "8rem",
    overflowY: "auto",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    borderRadius: "10px",
    border: "2px dotted #000",
  },
  field: {
    display: "flex",
    justifyContent: "center",
  },
});

const SysDocs = () => {
  const classes = useStyles();
  const selectedInputs = useSelector(
    (state) => state.userSelection.currentSelection
  );
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
  const [activeTab, setActiveTab] = useState(0);
  const [questionsOptions, setquestionsOptions] = useState([]);
  const [selectedFileName, setselectedFileName] = useState(null);

  const questionOnChange = (e) => {
    let data = e.target.value;
    setselectedFileName(data);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("system", selectedInputs["equipmentName"]);
    data.append("name", selectedInputs["shipName"]);

    fetch("/api/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("fs", data);
        if (data.status === "success") {
          setSnackBarMessage({
            severity: "success",
            message: `File ${data.name} uploaded successfully!`,
            showSnackBar: true,
          });
        } else {
          setSnackBarMessage({
            severity: "error",
            message: "shyaaaa",
            showSnackBar: true,
          });
        }
      })
      .catch((error) => {
        setSnackBarMessage({
          severity: "error",
          message: "Please choose a file before clicking upload.",
          showSnackBar: true,
        });
        console.error("Upload error:", error);
      });
  };

  const loadFiles = () => {
    fetch("/api/fetch_system_files", {
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
      .then((data) => {
        if (data) {
          setSnackBarMessage({
            severity: "success",
            message: "Equipment Loaded Sucessfully!",
            showSnackBar: true,
          });
        } else {
          setSnackBarMessage({
            severity: "error",
            message: "Error in loading the system!",
            showSnackBar: true,
          });
        }
        setquestionsOptions(data.files);
      });
  };

  const downloadFile = () => {
    let system = selectedInputs["equipmentName"].replace(/\s/g, "");
    let ship_name = selectedInputs["shipName"].replace(/\s/g, "");
    const link = document.createElement("a");
    link.download = selectedFileName;
    link.href = `/${ship_name}_${system}/${selectedFileName}`;
    link.click();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderFormContent = () => {
    if (activeTab === 1) {
      return (
        <>
          <div>
            <CustomSelect
              id="q7"
              name="files"
              label=""
              fields={questionsOptions}
              onChange={questionOnChange}
              value={selectedFileName}
            />
            <Button
              variant="contained"
              component="label"
              className={classes.btn}
              onClick={downloadFile}
              color="primary"
              disabled={!selectedFileName}
            >
              Download File
            </Button>
          </div>
        </>
      );
    }

    if (activeTab === 0) {
      return (
        <>
          <input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            component="label"
            className={classes.btn}
            onClick={handleUploadClick}
            color="primary"
          >
            Upload File
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        <div className={styles.flex}>
          <UserSelection />
          <div className={styles.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttons}
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
            <form
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className={classes.dottedBorder}>
                <div className={classes.field}>{renderFormContent()}</div>
              </div>
            </form>
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
