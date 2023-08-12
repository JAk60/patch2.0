import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { resetLevels } from "../../store/Levels";


const Home = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = React.useState(!!message); // Set open state based on the presence of the message
  const level = useSelector((state) => state.LevelsData);
  const trueLevels = Object.keys(level).filter((key) => level[key] === true);

  const featureAccess = [
    { feature: "SystemConfiguration", levels: ["L1", "L5", "L6"] },
    { feature: "ReliabilityDashboard", levels: ["L1", "L2", "L3", "L4", "L5"] },
    { feature: "MonitoringDashboard", levels: ["L1", "L2", "L5"] },
    { feature: "TaskReliabilityDashboard", levels: ["L1", "L2", "L4","L3", "L5"] },
    { feature: "TaskConfiguration", levels: ["L1", "L5"] },
    { feature: "ViewUpdateData", levels: ["L1"] },
    { feature: "MaintenanceAllocation", levels: ["L1", "L5", "L6"] },
    { feature: "TimeToFailureRUL", levels: ["L1", "L5"] },
  ];

  const featurePaths = {
    SystemConfiguration: "/system_config",
    ReliabilityDashboard: "/rDashboard",
    MonitoringDashboard: "/CDashboard",
    TaskReliabilityDashboard: "/TaskDashboard",
    TaskConfiguration: "/dnd",
    ViewUpdateData: "/view_data",
    MaintenanceAllocation: "/maintenance_allocation",
    TimeToFailureRUL: "/rul",
  };

  console.log("level", level, trueLevels);

  const handleMClose = () => {
    setOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (!props.loggedIn) {
      props.history.push("/sign_in");
    }
  });
  const dispatch = useDispatch();
  const Logout = () => {
    localStorage.setItem('login', false);
    const isLoggedIn = localStorage.getItem('login');
    if(isLoggedIn === 'false'){
      props.setLoggedIn(false);
    }
    props.history.push("/sign_in");
    dispatch(resetLevels({
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      L5: false,
      L6: false,
    }));
  };

  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };
  return (
    <div className={styles.container}>
      <div className={styles.homeNav}>
        <Link onClick={() => Logout()}>
          <i class="fas fa-sign-out-alt"></i>Logout
        </Link>
        <Link onClick={() => props.history.push("/configure_history2")}>
          <i class="fas fa-history"></i>Configuration History
        </Link>
        <Link
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <i class="fas fa-key"></i>User Authentication
        </Link>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => props.history.push("/user_approval")}>
            Account Request
          </MenuItem>
          <MenuItem onClick={() => props.history.push("/edit_profile")}>
            Forgot Password
          </MenuItem>
        </Menu>
      </div>
      <div className={styles.homeLinks}>
        {featureAccess.map((featureObj) => {
           const isAllowed = featureObj.levels.some(level => trueLevels.includes(level));
          if (isAllowed) {
            return (
              <Link
                key={featureObj.feature}
                to={featurePaths[featureObj.feature]}
                onClick={resetUserSelection}
              >
                <div className={styles.circleIcon}>
                  <i className="far fa-chart-bar"></i>
                </div>
                {featureObj.feature != "TimeToFailureRUL" ? featureObj.feature .replace(/([A-Z])/g, ' $1') : "Time To Faliure / RUL"}
              </Link>
            );
          }
          return null;
        })}
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" width={200} height={200} />
        <div>NETRA</div>
      </div>
    </div>
  );
};

export default Home;
