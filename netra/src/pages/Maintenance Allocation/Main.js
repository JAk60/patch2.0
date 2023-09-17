import React from "react";
import styles from "./MaintenanceAllocation.module.css";
import { Link } from "react-router-dom";
import AccessControl from "../Home/AccessControl";
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';
import { Button, Typography, makeStyles } from "@material-ui/core";

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
      display: "flex",
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
    { name: "Create Maintenance Plan", path: "/maintenance_allocation/create", icon: <BuildOutlinedIcon /> },
    { name: "Conduct Rcm Analysis", path: "/maintenance_allocation/conduct_rcm_analysis", icon: <TableChartSharpIcon /> },
    // Add more links as needed
  ];

  return (
    <AccessControl allowedLevels={['L1', 'L5', 'L6']}>
      <div className={styles.container}>
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
          <img src="/netra-logo-removebg.png" width={300} height={400} alt="Netra Logo" />
          <div className={styles.logotxt}>NETRA</div>
        </div>
      </div>
    </AccessControl>
  );
};
export default Main;
