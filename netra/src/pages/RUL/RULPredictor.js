import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { Container } from "@material-ui/core";

import styles from "./rul.module.css";

const RULPredictor = ({ prevRul,P,F }) => {
  const [sensorValue, setSensorValue] = useState("");
  const [prediction, setPrediction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // New state variables
  const [T0, setT0] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState(0.9);

  const handlePredict = async () => {
    const { operating_hours } = prevRul;
    const requestData = {
      vc: parseFloat(sensorValue),
      t0: parseFloat(T0),
      tp: parseFloat(operating_hours),
      p: parseFloat(P),
      f: parseFloat(F),
      confidence: parseFloat(confidenceLevel),
    };

    try {
      const response = await fetch("/rul", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to get RUL prediction.");
      }

      const data = await response.json();
      setPrediction(data.remaining_life);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching RUL prediction:", error);
      // Handle the error state here if needed
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container className={styles.userSelection}>
      <Grid >
            <h1>Time Till Failure/RUL</h1>
        <Grid item xs={12} sm={6} md={4} style={{display: "flex",justifyContent: "center", width: "550px"}}>
          <div>
            <div>
              <TextField
                type="number"
                step="any"
                label="Sensor data"
                value={sensorValue}
                onChange={(e) => setSensorValue(e.target.value)}
                required
                fullWidth
              />
            </div>
            <div>
              <TextField
                type="number"
                step="any"
                label="P"
                value={P}
                required
                fullWidth
              />
            </div>
            <div>
              <TextField
                type="number"
                step="any"
                label="F"
                value={F}
                required
                fullWidth
              />
            </div>
            <div>
              <TextField
                type="number"
                step="any"
                label="T0"
                value={T0}
                onChange={(e) => setT0(e.target.value)}
                required
                fullWidth
              />
            </div>
            <div>
              <TextField
                type="number"
                step="any"
                label="Confidence Level"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                required
                fullWidth
              />
            </div>
            {/* End of new input fields */}

            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              fullWidth
              style={{marginTop: "20px"}}
            >
              Calculate
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Remaining Useful Life is :</DialogTitle>
              <DialogContent>{prediction}</DialogContent>
            </Dialog>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RULPredictor;
