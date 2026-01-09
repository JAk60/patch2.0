import React from "react";
import styles from "./MaintenanceAllocation.module.css";
import { Link } from "react-router-dom";
import AccessControl from "../Home/AccessControl";
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';
import { Button, Typography, makeStyles } from "@material-ui/core";
import BackToHomeFab from "../../components/navigation/MuiFap";

const Main = (props) => {
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
      color: "white"
    },
    logoImg: {
      marginTop: "40px",
      maxWidth: "80%",
      height: "auto",
    }
  }));

  const classes = useStyles(); // Apply makeStyles

  const MainLinks = [
    { name: "Create Maintenance Plan", path: "/maintenance_allocation/assignMaintenance", icon: <BuildOutlinedIcon /> },
    { name: "Conduct Rcm Analysis", path: "/maintenance_allocation/conduct_rcm_analysis/critical_comp", icon: <TableChartSharpIcon /> },
  ];

  return (
    <AccessControl allowedLevels={['L0']}>
      <div className={styles.container}>
        <BackToHomeFab />
        <div className={styles.homeLinks}>
          {MainLinks.map((link, index) => (
            <Link key={index} to={link.path} >
              <div className={classes.linkbtn}>
                {link.icon}
              </div>
              <Button disableRipple={true}>
                <Typography variant="h5" className={classes.txt}>
                  {link.name}
                </Typography>
              </Button>
            </Link>
          ))}
        </div>
        <div className={styles.netra}>
          <img src="/images/netra-logo-removebg.png" width={300} height={400} alt="Netra Logo" />
          <div className={styles.logotxt}>NETRA v2.6</div>
        </div>
      </div>
    </AccessControl>
  );
};
export default Main;
