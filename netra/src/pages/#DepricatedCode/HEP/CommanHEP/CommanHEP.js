import { FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Radio } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { RadioGroup } from "@material-ui/core";
import { useState } from "react";
import styles from "../HEP.module.css";

const radioLabel = makeStyles({
  label: {
    minWidth: 80,
    border: "rgb(116, 114, 114) 1px solid",
    borderRadius: "5px",
    textAlign: "center",
    background: "#ebebeb",
    fontWeight: "bold",
  },
  labelPlacementStart: {
    marginLeft: 1,
  },
});
const radioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    border: "1px solid black",
    borderRadius: 5,
    width: 24,
    height: 22,
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    border: "1px solid black",
    borderRadius: 5,
    "&:before": {
      display: "block",
      width: 24,
      height: 22,
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
});

function StyledRadio(props) {
  const radioClasses = radioStyles();

  return (
    <Radio
      className={radioClasses.root}
      disableRipple
      color="default"
      checkedIcon={<span className={radioClasses.checkedIcon} />}
      icon={<span className={radioClasses.icon} />}
      {...props}
    />
  );
}

const CHEP = ({experience,workCulture,fitness,handleExp,handleWC,handleFit}) => {
  const radioLabelStyle = radioLabel();

  return (
    <div className={styles.midSection}>
      
        <div className={styles.sectionHeader}>
          External Factor/PSF-Experience
        </div>
      <div className={styles.Qcard}>
        <div>
          <div className={styles.QcardHeader}>
            What percentage of time does a maintenance personnel with following
            experience perform the task?
          </div>
          <div className="Qcard-content">
            <div className={styles.cardItem}>
              <label className='experience' htmlFor="expnominal">Nominal</label>
              <input className='experience' type="number" id="expnominal" value={experience.nominal} onChange={(e)=>handleExp(e,'nominal')}></input>
            </div>
            <div className={styles.cardItem}>
              <label className='experience' htmlFor="explow">Low</label>
              <input className='experience' type="number" id="explow" value={experience.low} onChange={(e)=>handleExp(e,'low')}></input>
            </div>
            <div className={styles.cardItem}>
              <label className='experience' htmlFor="exphigh">High</label>
              <input className='experience' type="number" id="exphigh" value={experience.high} onChange={(e)=>handleExp(e,'high')}></input>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sectionHeader}>
        External Factor/PSF-Work Culture
      </div>
      <div className={styles.Qcard}>
        <div className={styles.QcardHeader}>
          How do you rate the work culture of your organisation?
        </div>
        <div className="Qcard-content">
          <FormControl>
            <RadioGroup aria-label="work-culture" value={workCulture} onChange={handleWC} name="psf-work-culture">
              <FormControlLabel
                classes={radioLabelStyle}
                value="nominal"
                control={<StyledRadio />}
                label="Nominal"
                labelPlacement="start"
              />
              <FormControlLabel
                classes={radioLabelStyle}
                value="low"
                control={<StyledRadio />}
                label="Low"
                labelPlacement="start"
              />
              <FormControlLabel
                classes={radioLabelStyle}
                value="high"
                control={<StyledRadio />}
                label="High"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className={styles.sectionHeader}>
        External Factor/PSF-Fitness for Duty
      </div>
      <div className={styles.Qcard}>
        <div className={styles.QcardHeader}>
          What percentage of time does a maintenance personnel with following
          fitness level perform the task?
        </div>
        <div className="Qcard-content">
          <div className={styles.cardItem}>
            <label className='fitness' htmlFor="fitnominal">Nominal</label>
            <input className='fitness' type="number" id="fitnominal" value={fitness.nominal} onChange={(e)=>handleFit(e,'nominal')}></input>
          </div>
          <div className={styles.cardItem}>
            <label className='fitness' htmlFor="fitlow">Low</label>
            <input className='fitness' type="number" id="fitlow" value={fitness.low} onChange={(e)=>handleFit(e,'low')}></input>
          </div>
          <div className={styles.cardItem}>
            <label className='fitness' htmlFor="fithigh">High</label>
            <input className='fitness' type="number" id="fithigh" value={fitness.high} onChange={(e)=>handleFit(e,'high')}></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CHEP;
