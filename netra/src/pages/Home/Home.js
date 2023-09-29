import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Menu, MenuItem, Typography, IconButton, Avatar, ButtonBase, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ExitToApp, VpnKey, AccountCircle } from "@material-ui/icons"; // Remove the import for AlignVerticalBottomSharp
import EqualizerIcon from '@material-ui/icons/Equalizer';// Add the import for AlignVerticalBottomSharp
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import MuiAlert from "@mui/material/lab/Alert";
import { userActions } from "../../store/ApplicationVariable";
import { resetLevels } from "../../store/Levels";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import DirectionsBoatOutlinedIcon from '@material-ui/icons/DirectionsBoatOutlined';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import ShowChartOutlinedIcon from '@material-ui/icons/ShowChartOutlined';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import AlarmAddOutlinedIcon from '@material-ui/icons/AlarmAddOutlined';

const iconMappings = {
  SystemConfiguration: SettingsIcon,
  MissionConfiguration: DirectionsBoatOutlinedIcon,
  MaintenanceAllocation: BuildOutlinedIcon,
  ViewOrUpdateData: RateReviewOutlinedIcon,
  ReliabilityDashboard: BarChartOutlinedIcon,
  MonitoringDashboard: ShowChartOutlinedIcon,
  MissionReliabilityDashboard: TableChartOutlinedIcon,
  TimeToFailureRUL: AlarmAddOutlinedIcon,
};

const useStyles = makeStyles((theme) => ({
  linkbtn: {
    backgroundColor: "white",
    padding: "10px",
    display: "flex",
    marginRight: "40px",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: " #004d90",
    objectFit: "cover"
  },
  txt: {
    color: "white"
  },
  logoImg: {
    marginTop: "40px",
    marginLeft: "70px",
    maxWidth: "70%",
    height: "auto",
  }
}));

const Home = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = useState(!!message); // Set open state based on the presence of the message
  const level = useSelector((state) => state.LevelsData);
  const trueLevels = Object.keys(level).filter((key) => level[key] === true);
  const featureAccess = [
    { feature: "SystemConfiguration", levels: ["L1", "L5", "L6"] },
    { feature: "MissionConfiguration", levels: ["L1", "L5"] },
    { feature: "MaintenanceAllocation", levels: ["L1", "L5", "L6"] },
    { feature: "ViewOrUpdateData", levels: ["L1", "L5"] },
    { feature: "ReliabilityDashboard", levels: ["L1", "L2", "L3", "L4", "L5"] },
    { feature: "MonitoringDashboard", levels: ["L1", "L2", "L5"] },
    { feature: "MissionReliabilityDashboard", levels: ["L1", "L2", "L4", "L3", "L5"] },
    { feature: "TimeToFailureRUL", levels: ["L1", "L5"] },
  ];

  const featurePaths = {
    SystemConfiguration: "/system_config",
    ReliabilityDashboard: "/rDashboard",
    MonitoringDashboard: "/CDashboard",
    MissionReliabilityDashboard: "/TaskDashboard",
    MissionConfiguration: "/dnd",
    ViewOrUpdateData: "/view_data",
    MaintenanceAllocation: "/maintenance_allocation",
    TimeToFailureRUL: "/rul",
  };

  console.log("level", level, trueLevels);

  const handleMClose = () => {
    setOpen(false);
  };

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
  }, [props.loggedIn, props.history]);

  const dispatch = useDispatch();

  const Logout = () => {
    localStorage.setItem("login", false);
    const isLoggedIn = localStorage.getItem("login");
    if (isLoggedIn === "false") {
      props.setLoggedIn(false);
    }
    props.history.push("/sign_in");
    dispatch(resetLevels({
      L1: false,
      L2: false,
      L3: false,
      L4: false,
      L5: false,
      L6: false,
    }));
  };

  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeNav}>
        <Link onClick={() => Logout()}>
          <i class="fas fa-sign-out-alt"></i>Logout
        </Link>
        {/* <Link onClick={() => props.history.push("/configure_history2")}>
          <i class="fas fa-history"></i>Configuration History
        </Link> */}
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
        {featureAccess.map((featureObj) => {
          const isAllowed = featureObj.levels.some(level => trueLevels.includes(level));
          const IconComponent = iconMappings[featureObj.feature];
          if (isAllowed && IconComponent) {
            return (
              <Link
                key={featureObj.feature}
                to={featurePaths[featureObj.feature]}
                onClick={resetUserSelection}
              >
                <Button disableRipple={true}>
                  <IconComponent className={`${classes.linkbtn}`} />
                  <Typography variant="h5" className={classes.txt}>
                    {featureObj.feature !== "TimeToFailureRUL"
                      ? featureObj.feature.replace(/([A-Z])/g, ' $1')
                      : "Time To Failure / RUL"}
                  </Typography>
                </Button>
              </Link>
            );
          }
          return null;
        })}
      </div>
      <div className={styles.netra}>
        <img src="/netra-logo-removebg.png" alt="Netra Logo" className={classes.logoImg} />
        <div className={styles.logotxt}>NETRA</div>
      </div>
    </div>
  );
};

export default Home;