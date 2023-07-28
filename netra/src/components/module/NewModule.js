import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import clsx from 'clsx';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styles from "./Module_radio.module.css";

const StepperStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    background:'#ebebed',
    borderRadius: '5px',
    height:"18px",
    justifyContent:'space-between',
    padding:'15px'
  },
  active: {
    color: '#000',
  }
}));
const CustomIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    padding:'10px',
  },
  active: {
    // position: 'relative',
    // // backgroundColor: '#3ae711',
    // left: '5px',
    // top: '5px',
    // width: '15px',
    // height: '15px',
    // borderRadius:'50%',
    // zIndex: 1,
    // boxShadow: '3px 3px 10px 0px rgba(0,0,0,0.3)',
    height: '25px',
    width: '25px',
    borderRadius:'50%',
    boxShadow: '0px 4px 14px 0px rgba(0,0,0,0.2)',
    backgroundColor: '#ffffff',
  },
  circle: {
    height: '25px',
    width: '25px',
    borderRadius:'50%',
    boxShadow: '0px 4px 14px 0px rgba(0,0,0,0.2)',
    backgroundColor: '#ffffff',
},
  
  completed: {
    position: 'relative',
    backgroundColor: '#00dffe',
    left: '5px',
    top: '5px',
    width: '15px',
    height: '15px',
    borderRadius:'50%',
    zIndex: 1,
    fontSize: 18,
    boxShadow: '3px 3px 10px 0px rgba(0,0,0,0.3)',
  },
});

function CustomIcon(props) {
  const classes = CustomIconStyles();
  const { active, completed } = props;
  debugger;
  return (
    <div
      className={classes.root}
    > 
      {completed ? <div className={classes.circle}><div className={classes.completed} /></div> : <div className={classes.circle}><div className={clsx({
        [classes.active]: active,
      })}/></div>}
    </div>
  );
}

function getSteps() {
  return [
    "System Configuration",
    "Phase Manager",
    "HEP",
    "Data Manager",
    "Mission Profile"
  ];
}

export default function NewModule() {
  const classes = StepperStyles();
  const [activeStep, setActiveStep] = React.useState(1);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  debugger;
  return (
    <div className={styles.module}>
      <Stepper classes={classes}  activeStep={activeStep}  connector={null}>
        {steps.map((label) => (
          <Step key={label} >
            <StepLabel StepIconComponent={CustomIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {/* <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
