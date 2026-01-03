import { Button, Typography, makeStyles } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import WifiTetheringIcon from '@material-ui/icons/HourglassEmpty';
import StorageIcon from '@material-ui/icons/Storage';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BackToHomeFab from "../../components/navigation/MuiFap";
import { userActions } from "../../store/ApplicationVariable";
import AccessControl from "../Home/AccessControl";
import styles from "./ViewData.module.css";

const ViewData = (props) => {
  const useStyles = makeStyles((theme) => ({
    linkbtn: {
      backgroundColor: "white",
      padding: "10px",
      marginRight: "40px",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: " #004d90",
      objectFit: "cover",
    },
    txt: {
      color: "white"
    },
    logoImg: {
      marginTop: "40px",
      maxWidth: "80%",
      height: "auto",
    }
  }));
  const ViewDataPaths = [
    { name: "Data Manager", path: "/data_manager", icon: <StorageIcon /> },
    { name: "Historical Data", path: "/historical_data", icon: <HourglassEmptyIcon /> },
    { name: "Add New Ship", path: "/user_selection_config", icon: <CreateIcon /> },
    // { name: "Add System Doc", path: "/add_system_doc", icon: <SaveAltIcon /> },
    { name: "Add Sensor Data", path: "/maintenance_allocation/add_data", icon: <WifiTetheringIcon /> },
    { name: "CMMS To NETRA", path: "/administrator", icon: <SystemUpdateAltIcon /> },
  ];


  const userLevel = JSON.parse(localStorage.getItem("userData"))
  console.log(userLevel);

  const dispatch = useDispatch();
  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };
  const classes = useStyles();
  return (
    <AccessControl allowedLevels={['L0', "L1", "L5", "L6"]}>
      <div className={styles.container}>
        <BackToHomeFab />
        <div className={styles.viewDataLinks}>
          {ViewDataPaths.map((link, index) => {
            if (userLevel.level !== "L6" || (userLevel.level === "L6" && link.name !== "Add New Ship")) {
              return (
                <Link key={index} to={link.path} onClick={resetUserSelection}>
                  <div className={classes.linkbtn}>
                    {link.icon}
                  </div>
                  <Button disableRipple={true}>
                    <Typography variant="h5" className={classes.txt}>
                      {link.name}
                    </Typography>
                  </Button>
                </Link>
              );
            }
            return null;
          })}
        </div>
        <div className={styles.netra}>
          <img src="/images/netra-logo-removebg.png" alt="Netra Logo" className={classes.logoImg} />
          <div className={styles.logotxt}>NETRA v2.6</div>
        </div>
      </div>
    </AccessControl>
  );
};

export default ViewData;
