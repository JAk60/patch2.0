import React, { useEffect, useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import classes from "./configureHistory2.module.css";
import Button from "@material-ui/core/Button";
import CustomSelect from "../../ui/Form/CustomSelect";
import { components } from "../../ui/userSelection/userSelectionData";
import { Grid, makeStyles, Slider } from "@material-ui/core";

const useStyles = makeStyles({
  slider: {
    padding: "22px 0px",
  },
  sliderTrack: {
    height: 5,
  },
});
const ConfigureHistory2 = () => {
  const [platformName, setPlatformName] = useState([
    "Talwar 1",
    "Talwar 2",
    "Kamorta 1",
    "Kamorta 2",
    "Vikrant",
  ]);
  const [eqData, setEqData] = useState(["DA1", "DA2", "DA3", "DA4", "DA5"]);
  // useEffect(() => {
  //   fetch("/fetch_user_selection", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const userData = data["data"];
  //       const shipName = userData.map((x) => x.shipName);
  //       setEqData(data["eqData"]);
  //       setPlatformName(shipName);
  //     });
  // }, [eqData, platformName, setEqData, setPlatformName]);
  const Sliderclasses = useStyles();
  const marks = [
    {
      value: 15,
      label: "Configure New System",
    },
    {
      value: 40,
      label: "Phase Definition",
    },
    {
      value: 65,
      label: "Extrinsic Factor Definition ",
    },
    {
      value: 90,
      label: "Data Manager",
    },
  ];
  const subsystem = [
    { name: "Fresh Water Cooling" },
    { name: "Sea Water Cooling" },
  ];
  const onChange = (e) => {
    console.log(e);
  };
  return (
    <div
      className={classes.background}
      style={{
        backgroundImage: "url(/wave.svg)",
      }}
    >
      <div className={classes.flex}>
        <Navigation />
        <div className={classes.table}>
          <div className={classes.button}>
            <Button variant="contained" color="primary">
              Configuration History
            </Button>
          </div>
          <div className={classes.dropdown}>
            <div>
              <CustomSelect
                style={{ width: "300px" }}
                id="platformname"
                label="Platform Name"
                fields={platformName}
                // onChange={onChange}
              />
            </div>
            <div className={classes.spacing}>
              <CustomSelect
                style={{ width: "300px" }}
                id="systemname"
                label="System Name"
                fields={eqData}
              />
            </div>
            <div className={classes.submit}>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </div>
          </div>
          <Grid>
            <Grid container spacing={3} className={classes.grid}>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: "100%" }}
                >
                  Sub System Name
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: "100%" }}
                >
                  Module Name
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: "100%" }}
                >
                  Action
                </Button>
              </Grid>
              {subsystem.map((item, index) => (
                <div className={classes.row}>
                  <Grid item xs={6} sm={3}>
                    <h3>{item.name}</h3>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Slider
                      classes={{
                        container: Sliderclasses.slider,
                        track: Sliderclasses.sliderTrack,
                      }}
                      defaultValue={40}
                      marks={marks}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Button variant="contained" color="primary">
                      Redirect
                    </Button>
                  </Grid>
                </div>
              ))}
            </Grid>
          </Grid>
        </div>
        <div className={classes.img}>
          <img src="/netra-logo-removebg.png" width={60} height={60} />
        </div>
      </div>
    </div>
  );
};
export default ConfigureHistory2;
