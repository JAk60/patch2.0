import React from "react";
import styles from './rDashboard.module.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
const MissionSlider=(props)=>{
    const prev =()=>{
        let index = props.currentMission;
        let length = props.missions.length;
        if(index < 1) {
            index = length - 1;
        }
        else{
            index--;
        }
        props.setMission(index);
    }
    const next =()=>{
        let index = props.currentMission;
        let length = props.missions.length;
        if(index == length - 1) {
            index = 0;
        }
        else{
            index++;
        }
        props.setMission(index);
    }
    return(
        <div className={styles.missionName}>
        <button className={styles.calBack} onClick={()=>prev()}><ArrowBackIcon fontSize="inherit"/></button>
        <div > {props.missions[props.currentMission].name} </div>
        <button className={styles.calBack} onClick={()=>next()}><ArrowForwardIcon fontSize="inherit"/></button>
        </div>
    )
}

export default MissionSlider;