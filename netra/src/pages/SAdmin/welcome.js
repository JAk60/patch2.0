import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  logo: {
    marginBottom: "20px",
  },
  logoImage: {
    width: "100%",
    height: "400px",
  },
  heading: {
    fontSize: "24px",
  },
  card: {
    margin: "10px",
    minWidth: "250px",
    padding: "20px 20px 30px 20px",
    borderRadius: "10px",
    marginTop: "30px",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    fontSize: "24px",
    background: "rgb(73,143,232)",
    color:"white",
    background: "linear-gradient(90deg, rgba(73,143,232,1) 5%, rgba(42,42,114,1) 100%)"
  },
};

const CardItem = ({ title, count }) => {
  return (
    <Grid item>
      <Card style={styles.card}>
        <CardHeader title={title} />
        <CardContent>{count}</CardContent>
      </Card>
    </Grid>
  );
};

const WelcomePage = ({cardData}) => {

  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <img src="./20240312_110939.jpg" alt="Logo" style={styles.logoImage} />
      </div>
      {/* <h1 style={styles.heading}>Welcome to Dashboard</h1> */}
      <Typography variant="h3" style={{ color: "#344B99" }}>
        Welcome to Dashboard
      </Typography>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {cardData.map((item, index) => (
          <CardItem key={index} title={item.title} count={item.count} />
        ))}
      </Grid>
    </div>
  );
};



export default WelcomePage;
