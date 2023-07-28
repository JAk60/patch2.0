import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Grid } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import CustomTextInput from "../../ui/Form/CustomTextInput";
import CustomSelect from "../../ui/Form/CustomSelect";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const CreateProfile = (props) => {
  const [open, setOpen] = React.useState(false);
  const [stageInput, setStageInput] = useState([]);
  const [missionName, setMissionName] = useState("");
  const [targetReliability, setTargetReliability] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setStageInput([])
    setMissionName("")
    setTargetReliability("")
  };

  const onAddNewStage = () => {
    setStageInput((prevstate) => {
      // const stateLen = prevstate.length;
      // // return [...prevstate, stateLen + 1];
      return [...prevstate, { stageName: "", duration: "" }];
    });
    console.log(stageInput);
  };
  const onDeleteStage = (index) => {
    debugger;
    const stageCopy = [...stageInput];
    stageCopy.splice(index, 1);
    setStageInput(stageCopy);
  };
  const handleStageChange = (index, e) => {
    let newArr = [...stageInput];
    newArr[index][e.target.name] = e.target.value;
    setStageInput(newArr);
  };
  const saveProfile = () => {
    let saveObject = {
      missionName: missionName,
      tar_rel: targetReliability,
      stages: stageInput,
    };
    props.saveTempMission(saveObject);
    setMissionName("");
    setTargetReliability("");
    setStageInput([]);
    handleClose();
  };
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        style={{
          marginTop: "2rem",
          borderRadius: "100px",
        }}
      >
        Create Temporary Mission Profile
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Temporary Mission Profile
        </DialogTitle>
        <DialogContent>
          <Grid container item spacing={4}>
            <Grid item xs={5} style={{ marginTop: "10px" }}>
              <CustomTextInput
                style={{ minWidth: 320 }}
                label="Mission Name"
                id="mission-name"
                name="missionName"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
              />
            </Grid>
            <Grid item xs={5} style={{ marginTop: "10px" }}>
              <CustomTextInput
                style={{ minWidth: 320 }}
                label="Set Target Reliability(%)"
                id="set-target-reliability"
                name="targetReliability"
                value={targetReliability}
                onChange={(e) => setTargetReliability(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container>
            {stageInput.map((stage, id) => {
              return (
                <Grid container item key={id} spacing={4}>
                  <Grid item xs={5} style={{ marginTop: "10px" }}>
                    <CustomSelect
                      label="Stage"
                      id="stage"
                      onChange={(e) => {
                        handleStageChange(id, e);
                      }}
                      // className={PhaseClasses.formControl}
                      name="stageName"
                      value={stage.stageName}
                      fields={[
                        "Harbor",
                        "Entry Leaving Harbor",
                        "Cruise",
                        "Defense Station",
                        "Action Station",
                      ]}
                    />
                  </Grid>
                  <Grid item xs={5} style={{ marginTop: "10px" }}>
                    <CustomTextInput
                      style={{ width: 320 }}
                      label="Duration"
                      id="duration"
                      name="duration"
                      value={stage.duration}
                      onChange={(e) => {
                        handleStageChange(id, e);
                      }}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <div
                      onClick={() => {
                        onDeleteStage(id);
                      }}
                      style={{ marginTop: "100%" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-trash"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#0d1a45"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <line x1="4" y1="7" x2="20" y2="7" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </div>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Button
            style={{
              float: "right",
              margin: "2rem 0 0 0",
            }}
            variant="contained"
            color="primary"
            onClick={() => onAddNewStage()}
          >
            Add Stage
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={saveProfile}
            color="primary"
          >
            Save as temporary mission profile
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CreateProfile;
