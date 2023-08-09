import React, { useState, useEffect } from "react";
import styles from "./ViewData.module.css";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { userActions } from "../../store/ApplicationVariable";
import { useDispatch } from "react-redux";
import AccessControl from "../Home/AccessControl";

const ViewData = (props) => {
  // useEffect(()=>{
  //     console.log(props.settings)
  // })
  const Logout = () => {
    props.setLoggedIn(false);
    props.history.push("/sign_in");
  };
  const dispatch = useDispatch();
  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };
  return (
    <AccessControl allowedLevels={["L1", "L5"]}>
      <div className={styles.container}>
        <div className={styles.viewDataNav}>
          <Link onClick={() => Logout()}>
            <i class="fas fa-sign-out-alt"></i>Logout
          </Link>
        </div>
        <div className={styles.viewDataLinks}>
          <Link to="/data_manager" onClick={() => resetUserSelection()}>
            <div className={styles.circleIcon}>
              <i className="fas fa-database"></i>
            </div>
            Data Manager
          </Link>
          <Link
            to="/data_manager/historical_data"
            onClick={() => resetUserSelection()}
          >
            <div className={styles.circleIcon}>
              <i className="fas fa-wrench"></i>
            </div>
            Equipment related data
          </Link>
          <Link to="/mission_profile" onClick={() => resetUserSelection()}>
            <div className={styles.circleIcon}>
              <i className="far fa-chart-bar"></i>
            </div>
            Mission profile
          </Link>
          <Link
            to="/user_selection_config"
            onClick={() => resetUserSelection()}
          >
            <div className={styles.circleIcon}>
              <i className="far fa-chart-bar"></i>
            </div>
            User Selection Config
          </Link>

          <Link to="/add_system_doc" onClick={() => resetUserSelection()}>
            <div className={styles.circleIcon}>
              <i className="far fa-chart-bar"></i>
            </div>
            Add System Documents
          </Link>

          <Link
            to="/maintenance_allocation/add_data"
            onClick={() => resetUserSelection()}
          >
            <div className={styles.circleIcon}>
              <i className="far fa-chart-bar"></i>
            </div>
            Add Sensor Data
          </Link>

          {/* <Link to="/health_prediction_input" onClick={()=>resetUserSelection()}><div className={styles.circleIcon}>
                    <i className="far fa-chart-bar"></i>
                    </div>Bayesian Health Inputs</Link> */}
        </div>
        <div className={styles.netra}>
          <img src="/netra-logo-removebg.png" width={200} height={200} />
          <div>NETRA</div>
        </div>
      </div>
    </AccessControl>
  );
};

export default ViewData;
