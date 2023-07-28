import React from 'react'
import styles from "./MaintenanceAllocation.module.css";
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


const RCMMain=(props)=> {
    return <div className={styles.container}>
  
  <div className={styles.homeLinks}>
        <Link to="/maintenance_allocation/conduct_rcm_analysis/create">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          RCM Analysis
        </Link>
        {/* <Link to="/maintenance_allocation/conduct_rcm_analysis/critical_comp">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Select Critical Components
        </Link>
        <Link to="/maintenance_allocation/display">
          <div className={styles.circleIcon}>
            <i class="fas fa-microchip"></i>
          </div>
          Create RCM Analysis
        </Link> */}
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" width={200} height={200} />
        <div>NETRA</div>
      </div>
    </div>;
  }
  export default RCMMain;