import React from "react";
import styles from "./rDashboard.module.css";

const MissionSlider = (props) => {
  return (
    <div className={styles.missionName}>
      <div> Mission Duration:-{props.missions[props.currentMission].name} </div>
    </div>
  );
};

export default MissionSlider;
