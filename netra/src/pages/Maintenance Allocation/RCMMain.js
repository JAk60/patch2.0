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
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" width={200} height={200} alt='NetraLogo'/>
        <div>NETRA v2.0</div>
      </div>
    </div>;
  }
  export default RCMMain;