import { Button, Tab, Tabs, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import styles from "./Admin.module.css";
import AdminInputs from "./AdminInputs";

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
  },
  autocomplete: {
    margin: "1rem",
    minWidth: 200,
  },
  deleteButton: {
    margin: "1rem",
  },
});

const Administrator = (props) => {
  const classes = useStyles();

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDelete = () => {
    // Add your delete logic here
    setSnackBarMessage({
      severity: "success",
      message: "Delete button clicked!",
      showSnackBar: true,
    });
  };

  return (
    <>
      <Navigation />
      <div className={styles.body}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Tabs
            indicatorColor="primary"
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            className={classes.tabs}
          >
            <Tab label="Unregister Equipment" />
            <Tab label="Delete Specific Information" />
          </Tabs>
        </div>
        <div>
          {activeTab === 0 && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AdminInputs />
              <Button
                className={classes.deleteButton}
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          )}
          {activeTab === 1 && <p>hello</p>}
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

export default Administrator;
