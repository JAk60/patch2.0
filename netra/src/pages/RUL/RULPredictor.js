import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import styles from "./rul.module.css";

const RULPredictor = ({ parameter, equipmentId, P, F }) => {
  const [sensorValue, setSensorValue] = useState("");
  const [prediction, setPrediction] = useState([]);
  const [openRULDialog, setOpenRULDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const confidance_levels = [0.8, 0.85, 0.9, 0.95];

  const customTableStyle = {
    fontSize: "16px", // Adjust the font size as needed
  };

  const [T0, setT0] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState(0.9);

  const handlePredict = async () => {
    const requestData = {
      vc: parseFloat(sensorValue),
      p: parseFloat(P),
      f: parseFloat(F),
      parameter: parameter,
      equipmentId: equipmentId,
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
      setOpenRULDialog(true);
    } catch (error) {
      console.error("Error fetching RUL prediction:", error);
    }
  };

  const handleCloseRULDialog = () => {
    setOpenRULDialog(false);
  };

  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
    if (dontShowAgain) {
      localStorage.setItem("dontShowDialogAgain", "true");
    }
  };

  const handleCheckboxChange = () => {
    setDontShowAgain(!dontShowAgain);
  };

  useEffect(() => {
    const dontShowAgain = localStorage.getItem("dontShowDialogAgain");
    if (dontShowAgain === "true") {
      setOpenNoteDialog(false);
    }
  }, []);

  return (
    <>
      <div style={{ marginTop: "50px" }} className={styles.Selection}>
        <Grid>
          <Typography variant="h4">
            Time Till Failure/RUL
            <sup>
              <button className={styles.infobtn} onClick={()=>setOpenNoteDialog(!openNoteDialog)}>i</button>
            </sup>
          </Typography>

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <div className={styles.horizontalTable}>
                <div className={styles.horizontalTableCell}>
                  <Typography variant="h6">
                    <strong>P:{P}</strong>
                  </Typography>
                </div>
                <div className={styles.horizontalTableCell}>
                  <Typography variant="h6">
                    <strong>F:{F}</strong>
                  </Typography>
                </div>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={handlePredict}
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Calculate
              </Button>
              <Dialog open={openRULDialog} onClose={handleCloseRULDialog}>
                <DialogTitle>
                  Remaining Useful Life for Different Confidence Levels:
                </DialogTitle>
                <DialogContent>
                  <TableContainer component={Paper} style={customTableStyle}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Confidence Level</TableCell>
                          <TableCell>Remaining Life(Hours)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prediction.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{confidance_levels[index]}</TableCell>
                            <TableCell>{entry}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>
              </Dialog>
              <Dialog open={openNoteDialog} onClose={handleCloseNoteDialog}>
                <DialogTitle>Important Note</DialogTitle>
                <DialogContent>
                  <Typography variant="h5">
                    For accurate prediction of RUL, at least 15 datasets are
                    required. 
                    </Typography>
                    <Typography variant="h5">
                    For fair predictions, at least 10 datasets are
                    required.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dontShowAgain}
                        onChange={handleCheckboxChange}
                        color="primary"
                      />
                    }
                    label="Don't show me this again"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default RULPredictor;
