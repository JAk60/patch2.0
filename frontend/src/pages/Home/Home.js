import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExitToApp,
  HelpOutline,
  VpnKey
} from "@material-ui/icons"; // Remove the import for AlignVerticalBottomSharp
import AccountBalanceOutlinedIcon from "@material-ui/icons/AccountBalanceOutlined";
import AlarmAddOutlinedIcon from "@material-ui/icons/AlarmAddOutlined";
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined";
import BuildOutlinedIcon from "@material-ui/icons/BuildOutlined";
import DirectionsBoatOutlinedIcon from "@material-ui/icons/DirectionsBoatOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import ShowChartOutlinedIcon from "@material-ui/icons/ShowChartOutlined";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { userActions } from "../../store/ApplicationVariable";
import { resetLevels } from "../../store/Levels";
import SAdmin from "../SAdmin/SAdmin";
import styles from "./Home.module.css";

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
    justifyContent: "center",
    alignItems: "center",
    color: " #004d90",
    objectFit: "cover",
  },
  txt: {
    color: "white",
  },
  logoImg: {
    maxWidth: "40%",
    height: "auto",
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = useState(!!message); // Set open state based on the presence of the message
  const level = useSelector((state) => state.LevelsData);
  const trueLevels = Object.keys(level).filter((key) => level[key] === true);
  const featureAccess = [
    { feature: "SystemConfiguration", levels: ["L0"] },
    { feature: "MissionConfiguration", levels: ["L0", "L1", "L5"] },
    { feature: "MaintenanceAllocation", levels: ["L0"] },
    { feature: "ViewOrUpdateData", levels: ["L0", "L1", "L5", "L6"] },
    { feature: "ReliabilityDashboard", levels: ["L0", "L1", "L2", "L3", "L4", "L5"] },
    { feature: "MonitoringDashboard", levels: ["L0"] },
    {
      feature: "MissionReliabilityDashboard",
      levels: ["L0", "L1", "L2", "L4", "L3", "L5"],
    },
    { feature: "TimeToFailureRUL", levels: ["L0"] },
  ];

  const speedDialActions = [
    { icon: <ExitToApp />, name: "Logout", onClick: () => Logout() },
    // {
    //   icon: <VpnKey />,
    //   name: "Admin",
    //   onClick: () => props.history.push("/sign_up"),
    // },
    {
      icon: <HelpOutline />,
      name: "Help",
      onClick: () => props.history.push("/know_netra"),
    },
  ];


  if (trueLevels.includes("L0") || trueLevels.includes("L5")) {
    speedDialActions.push({
      icon: <VpnKey />,
      name: "Admin",
      onClick: () => props.history.push("/sign_up"),
    });
  }

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
    dispatch(
      resetLevels({
        L0: false,
        L1: false,
        L2: false,
        L3: false,
        L4: false,
        L5: false,
        L6: false,
      })
    );
  };

  const resetUserSelection = () => {
    dispatch(userActions.onReset());
  };

  if (trueLevels.includes("S")) {
    return <SAdmin logout={Logout} />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.homeNav}>
        <SpeedDial
          ariaLabel="SpeedDial"
          icon={
            <SpeedDialIcon
              openIcon={<AccountBalanceOutlinedIcon />}
            />
          }
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          direction="down"
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
            />
          ))}
        </SpeedDial>
      </div>
      <div className={styles.homeLinks}>
        {featureAccess.map((featureObj) => {
          const isAllowed = featureObj.levels.some((level) =>
            trueLevels.includes(level)
          );
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
                      ? featureObj.feature.replace(/([A-Z])/g, " $1")
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
        <img
          src="/images/netra-logo-removebg.png"
          alt="Netra Logo"
          className={classes.logoImg}
        />
        <div className={styles.logotxt}>NETRA v2.6</div>
      </div>
    </div>
  );
};

export default Home;
