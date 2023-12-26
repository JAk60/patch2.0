import { Button, Tab, Tabs, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navigation from "../../components/navigation/Navigation";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import styles from "./Admin.module.css";
import AdminInputs from "./AdminInputs";
import DelSpecific from "./DelSpecific";
import EtlEquipment from "./EtlEquipment";
import UnregisterStepper from "./UnregisterStepper";
import RegisterEquipment from "./RegisterEquipment";

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
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const componentsData = useSelector(
    (state) => state.userSelection.componentsData
  );

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
  const [start, setStart] = useState(false);
  const [msg, setMsg] = useState("");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDelete = () => {
    const component = componentsData.filter((equipment) => {
      return equipment.name === currentSelection["equipmentName"];
    });
    console.log(component);
    const values = {
      component_id: component[0]?.id,
    };
    fetch("/unregister_equipment", {
      method: "POST",
      body: JSON.stringify({ values }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setMsg(data.message)
        setStart(true)
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
            <Tab label="Register Equipment" />
            <Tab label="Unregister Equipment" />
            <Tab label="Delete Specific Information" />
            <Tab label="Register Equipment For ETL" />
          </Tabs>
        </div>
        <div>
          {activeTab === 0 && <RegisterEquipment classes={classes} />}
          {activeTab === 3 && <EtlEquipment classes={classes} />}
          {activeTab === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <AdminInputs />
                <Button
                  className={classes.deleteButton}
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete}
                >
                  Unregister Equipment
                </Button>
              </div>
              <UnregisterStepper time={3000} start={start} msg={msg} setSnackBarMessage={setSnackBarMessage}/>
            </>
          )}
          {activeTab === 2 && <DelSpecific />}
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
