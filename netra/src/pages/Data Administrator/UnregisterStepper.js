import { Snackbar } from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepConnector from "@material-ui/core/StepConnector";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SettingsIcon from "@material-ui/icons/Settings";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import { Alert } from "@material-ui/lab";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    transition: "all 0.3s ease", // Added CSS transition
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  connector: {
    height: "3px",
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    transition: "all 0.3s ease", // Added CSS transition
  },
}));

function getSteps() {
  return ["System Configuration", "Sensor Data", "Historical Data"];
}

function UnregisterStepper({ time, start, msg ,setStart}) {
  const history=useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    let timerId;

    if (start && activeStep < getSteps().length) {
      timerId = setTimeout(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }, time);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [activeStep, start, time]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  useEffect(() => {
    if (activeStep === getSteps().length) {
      setShowSnackbar(true);
    }
  }, [activeStep]);

  const handleSnackbarExited = () => {
    // Reset the active step when the Snackbar closes
    setStart(false);
    setActiveStep(0);
    history.push('/administrator')
  };

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {getSteps().map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Typography className={classes.instructions}>{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        onExited={handleSnackbarExited}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
      <div></div>
    </div>
  );
}

UnregisterStepper.propTypes = {
  time: PropTypes.number.isRequired,
  start: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
};

export default UnregisterStepper;