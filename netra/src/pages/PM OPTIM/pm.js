import React, { useState } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import styles from "./pm.module.css";
import OptiQ from "./OptiQ";
import { getQuestions } from "./Data";
import Navigation from "../../components/navigation/Navigation";
import { Button, Grid, Typography } from "@material-ui/core";
import UserSelection from "../../ui/userSelection/userSelection";
import { useSelector } from "react-redux";

const PM = () => {
  const [selectedOption, setSelectedOption] = useState("option6");
  const [currQ, setCurrQ] = useState([]);
  const SelectedEqId = useSelector((state) => state.treeData.treeData)
  const [eta, setEta] = useState(0);
  const [beta, setBeta] = useState(0);
  const HandleSubmit = () => {
    const componentId = SelectedEqId[0]?.id;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ component_id: componentId }),
    };

    fetch("/fetch_eta_beta", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Process the fetched data (eta and beta values)
        const eta = data.eta;
        const beta = data.beta;
        setEta(data.eta);
        setBeta(data.beta);
        console.log(`ETA: ${eta}, BETA: ${beta}`);
      })
      .catch(error => {
        // Handle errors
        console.error('Fetch error:', error);
      });
  }
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);

    switch (event.target.value) {
      case "option1":
        setCurrQ({ columns: ["beta", "eta", "cf", "cp"], name: "age_based" });
        break;
      case "option2":
        setCurrQ({
          columns: ["beta", "eta", "df", "dp"],
          name: "downtime_based",
        });
        break;
      case "option3":
        setCurrQ({
          columns: ["component", "beta", "eeta", "c", "rt"],
          name: "component_group",
        });
        break;
      case "option4":
        setCurrQ({
          columns: ["component", "beta", "eeta", "rt"],
          name: "downtime_component_group",
        });
        break;
      case "option5":
        setCurrQ({
          columns: ["beta", "eeta", "cf", "cp"],
          name: "calendar_time",
        });
        break;
      case "option6":
        setCurrQ({ columns: ["beta", "eeta", "p"], name: "risk_target" });
        break;
      case "option7":
        setCurrQ({
          columns: ["beta", "eeta", "df", "dp"],
          name: "calender_downtime",
        });
        break;
      default:
        setCurrQ({ columns: ["beta", "eeta", "p"], name: "risk_target" });
        break;
    }
  };

  return (
    <>
      <Navigation />
      <div>
        <div className={styles.userSelect}>
          <UserSelection />
          <Button variant="contained" color="primary" onClick={HandleSubmit}>Submit</Button>
        </div>
        <div className={styles.flex}>
          {/* Use Grid to organize the radio buttons in three columns */}
          <Grid container spacing={2} className={styles.userSelection}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">Risk Based Replacement</Typography>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="option6"
                  control={<Radio color="primary" />}
                  label="Risk Based"
                  name="RiskBasedReplacement"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">Calender Time Based Replacement(Group)</Typography>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="option3"
                  control={<Radio color="primary" />}
                  label="Cost Criterion"
                  name="CalenderTimeBasedReplacemenGroupt1"
                />
                <FormControlLabel
                  value="option4"
                  control={<Radio color="primary" />}
                  label="Downtime Criterion"
                  name="CalenderTimeBasedReplacemenGrouptDowntime"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5">Calender Time Based Replacement</Typography>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="option5"
                  control={<Radio color="primary" />}
                  label="Cost Criterion"
                  name="CalenderTimeBasedReplacement"
                />
                <FormControlLabel
                  value="option7"
                  control={<Radio color="primary" />}
                  label="Downtime Criterion"
                  name="calender_downtime"
                />
              </RadioGroup>
            </Grid>
            {/* Option 6 on a separate row */}
            <Grid item xs={12}>
              <Typography variant="h5">Age Based Replacement</Typography>
              <RadioGroup value={selectedOption} onChange={handleRadioChange}>
                <FormControlLabel
                  value="option1"
                  control={<Radio color="primary" />}
                  label="Cost Criterion"
                  name="age_based"
                />
                <FormControlLabel
                  value="option2"
                  control={<Radio color="primary" />}
                  label="Downtime Criterion"
                  name="AgeBasedReplacementDowntime"
                />
              </RadioGroup>
            </Grid>
          </Grid>


          <div className={`${styles.userSelection} ${styles.flexibleBorders}`}>
            {selectedOption && (
              <OptiQ
                option={selectedOption}
                currQ={currQ}
                name={currQ?.name ||  "risk_target"}
                questions={getQuestions(selectedOption)}
                eta={eta}
                beta={beta}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PM;
