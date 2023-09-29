import React from "react";
import styles from "./ViewData.module.css";
import { Link } from "react-router-dom";
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch } from "react-redux";
import AccessControl from "../Home/AccessControl";
import StorageIcon from '@material-ui/icons/Storage';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CreateIcon from '@material-ui/icons/Create';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import WifiTetheringIcon from '@material-ui/icons/WifiTethering';
import { Button, Typography, makeStyles } from "@material-ui/core";

const ViewData = (props) => {
  const useStyles = makeStyles((theme) => ({
    linkbtn: {
      backgroundColor: "white",
      padding: "10px",
      display: "flex",
      marginRight: "40px",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: " #004d90",
      objectFit: "cover"
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
    { name: "Historical Data", path: "/data_manager/historical_data", icon: <HourglassEmptyIcon /> },
    { name: "Add New Ship", path: "/user_selection_config", icon: <CreateIcon /> },
    { name: "Add System Doc", path: "/add_system_doc", icon: <SaveAltIcon /> },
    { name: "Add Sensor Data", path: "/maintenance_allocation/add_data", icon: <WifiTetheringIcon /> },
  ];

  const Logout = () => {
    props.setLoggedIn(false);
    props.history.push("/sign_in");
  };

  const dispatch = useDispatch();
  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };
  const classes=useStyles();
  return (
<AccessControl allowedLevels={["L1", "L5"]}>
      <div className={styles.container}>
        <div className={styles.viewDataNav}>
          <Link onClick={Logout}>
            <i className="fas fa-sign-out-alt"></i>Logout
          </Link>
        </div>
        <div className={styles.viewDataLinks}>
          {ViewDataPaths.map((link, index) => (
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
          ))}
        </div>
        <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" alt="Netra Logo" className={classes.logoImg} />
        <div className={styles.logotxt}>NETRA</div>
      </div>
      </div>
    </AccessControl>
  );
};

export default ViewData;
