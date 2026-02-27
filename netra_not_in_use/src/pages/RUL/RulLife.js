import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import Navigation from "../../components/navigation/Navigation";
import AccessControl from "../Home/AccessControl";
import RULInputs from "./RULInputs";
import styles from "./rul.module.css";
import InfoIcon from "@material-ui/icons/Info";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const useStyles = makeStyles({
  autocomplete: {
    margin: "1rem",
    minWidth: 250,
  },
  btn: {
    margin: "1rem",
    padding: "1rem",
  },
  chip: {
    margin: "0.5rem",
    cursor: "pointer",
  },
  blink: {
    animation: "$blink-animation 1s infinite",
    backgroundColor: "red",
    color: "white",
  },
  "@keyframes blink-animation": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0,

    },
  },
});

export default function RulLife () {
  const [submitted, setSubmitted] = useState(false);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systems",
      showSnackBar: false,
    });
  };
  const [mps, setMps] = useState([]);
  const [dtable, setDtable] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [sensor, setSensor] = useState({ name: "", P: 0, F: 0 });
  
  const classes = useStyles();
  const allEquipmentData = useSelector(
    (state) => state.userSelection.componentsData
  );
  const currentNomenclature = useSelector(
    (state) => state.userSelection.currentSelection.nomenclature
  );
  const currEquipment = useSelector(
    (state) => state.userSelection.currentSelection.equipmentName
  );
  const Sensors = useSelector(
    (state) => state.userSelection.currentSelection.Sensor
  );
  const Eid = useSelector(
    (state) => state.userSelection.currentSelection.equipmentCode
  );

  const lowestSensorValue = Math.min(...Object.values(mps));
  console.log("HELLOWWWW",mps);
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

  const handleChipClick = async (sensor) => {
    const req = {
      equipmentId: Eid,
      parameter: sensor,
    };
    try {
      const response = await fetch("/rul", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.code) {
        setDtable(data.results.Table);
        setOpenDialog(true);
        setSensor({
          name: sensor,
          P: data.results.P,
          F: data.results.F,
        });
      } else {
        setSnackBarMessage({
          severity: "error",
          message: data.message,
          showSnackBar: true,
        });
      }
    } catch (error) {
      console.error("Error in handleClick:", error);

      setSnackBarMessage({
        severity: "error",
        message: "An error occurred while processing the request.",
        showSnackBar: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      const response = await fetch("/rul_equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          equipmentId: Eid,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
debugger;
      const data = await response.json();
      console.log("DATTTAAAAAA",data);
      if (data.code) {
        setMps(data.results);
      } else {
        setSnackBarMessage({
          severity: "error",
          message: data.message,
          showSnackBar: true,
        });
      }
    } catch (error) {
      console.error("Error in handleClick:", error);

      setSnackBarMessage({
        severity: "error",
        message: "An error occurred while processing the request.",
        showSnackBar: true,
      });
    }
  };

  const handleInfo = () => {
    setOpenNoteDialog(true);
  };
console.log("WWWWWWWWWWWWWWW",mps);
  return (
    <>
      <AccessControl allowedLevels={["L0"]}>
        <Navigation />
        <div className={styles.body}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "4rem",
            }}
          >
            <div style={{ display: "flex", flex: "1" }}>
              <RULInputs CData={allEquipmentData} />
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {submitted ? (
                <Card
                  style={{
                    width: "1240px",
                    height: "400px",
                    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
                    marginTop: "4rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "4rem",
                    }}
                  >
                    <Chip
                      label={currentNomenclature || "Equipment"}
                      className={classes.chip}
                      onClick={() =>
                        handleChipClick(currentNomenclature || "Equipment")
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {Sensors?.map((sensor, index) => (
                      <Chip
                        key={index}
                        label={sensor}
                        className={`${classes.chip} ${
                          mps[sensor] === lowestSensorValue ? classes.blink : ""
                        }`}
                        color="secondary"
                        variant="outlined"
                        onClick={() => handleChipClick(sensor)}
                      />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card
                  style={{
                    position: "relative", // Set position to relative
                    width: "1240px",
                    height: "400px",
                    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
                    marginTop: "4rem",
                  }}
                >
                  <Button
                    style={{ position: "absolute", top: 10, right: 10 }} // Set absolute position
                    onClick={handleInfo}
                  >
                    <InfoIcon />
                  </Button>
                  <Typography variant="h3" style={{ padding: "8rem" }}>
                    Fill the above information and click "Submit" to see the
                    RUL.
                  </Typography>
                </Card>
              )}
            </div>
          </div>
        </div>
      </AccessControl>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Remaining Useful Life:- {currEquipment} (
          {currentNomenclature || "Equipment"})
        </DialogTitle>
        <DialogTitle>
          <Typography variant="h5">Sensor:-{sensor.name}</Typography>
          <Typography variant="h6">P:-{sensor.P}</Typography>
          <Typography variant="h6">F:-{sensor.F}</Typography>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Remaining Life (Hours)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dtable &&
                  Object.entries(dtable).map(
                    ([confidence, remainingLife], index) => (
                      <TableRow key={index}>
                        <TableCell>{confidence}</TableCell>
                        <TableCell>{remainingLife}</TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <Dialog open={openNoteDialog} onClose={handleCloseNoteDialog}>
        <DialogTitle>Important Note</DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            For accurate prediction of RUL, at least 15 datasets are required.
          </Typography>
          <Typography variant="h5">
            For fair predictions, at least 10 datasets are required.
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
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
}
