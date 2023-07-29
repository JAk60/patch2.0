import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch } from "react-redux";


const Home = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
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
  const Logout = () => {
    props.setLoggedIn(false);
    props.history.push("/sign_in");
  };
  
  const dispatch = useDispatch();
  const resetUserSelection=()=>{
    dispatch(
      userActions.onReset()
    )
  }
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
        <Link to="/system_config" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="fas fa-cog"></i>
          </div>
          System Configuration
        </Link>
        <Link to="/rDashboard" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="far fa-chart-bar"></i>
          </div>
          Reliability Dashboard
        </Link>
        <Link to="/CDashboard" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="far fa-chart-bar"></i>
          </div>
          Monitoring Dashboard
        </Link>
        <Link to="/TaskDashboard" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="far fa-chart-bar"></i>
          </div>
          Task Reliability Dashboard
        </Link>
        <Link to="/dnd" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="far fa-chart-bar"></i>
          </div>
          Task Configuration
        </Link>
        <Link to="/view_data" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="fas fa-database"></i>
          </div>
          View/Update Data
        </Link>
        <Link to="/maintenance_allocation" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Maintenance Allocation
        </Link>
        <Link to="/rul" onClick={resetUserSelection}>
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Time To Failure/RUL
        </Link>
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" width={200} height={200} />
        <div>NETRA</div>
      </div>
    </div>
  );
};

export default Home;