import React from 'react'
import styles from "./MaintenanceAllocation.module.css";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


const Main=(props)=> {
    return <div className={styles.container}>
  
  <div className={styles.homeLinks}>
        <Link to="/maintenance_allocation/create">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Create Maintenance Plan
        </Link>
        {/* <Link to="/maintenance_allocation/modify">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Modify Maintenance Plan
        </Link>
        <Link to="/maintenance_allocation/display">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Display Maintenance Plan
        </Link>
        <Link to="/maintenance_allocation/share">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Share Maintenance Plan
        </Link> */}
        <Link to="/maintenance_allocation/conduct_rcm_analysis">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Conduct Rcm Analysis
        </Link>
        {/* <Link to="/maintenance_allocation/add_data">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Add Data
        </Link> */}
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" width={200} height={200} />
        <div>NETRA</div>
      </div>
    </div>;
  }
  export default Main;