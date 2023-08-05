import React, { useEffect, useState } from "react";
import styles from "./SignIn.module.css";
import {
  Paper,
  FormGroup,
  Switch,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import CustomizedSnackbars from '../../ui/CustomSnackBar';
import { useDispatch, useSelector } from "react-redux";
import { setLevel } from "../../store/Levels";

const SignIn = (props) => {
  const [toggles, setToggles] = useState({
    L1: false,
    L2: false,
    L3: false,
    L4: false,
    L5: false,
  });

  // const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const levels = useSelector((state) => state.LevelsData);

  const handleToggleChange = (toggleName) => (event) => {
    const value = event.target.checked;
    setToggles({ ...toggles, [toggleName]: value });

    // Dispatch only true levels
    if (value) {
      dispatch(setLevel({ level: toggleName, value }));
    }
  }

  console.log(levels);

  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "",
    showSnackBar: false,
  });

  useEffect(() => {
    if (props.loggedIn) {
      props.history.push("/");
    }
  }, [props.loggedIn, props.history]);

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "",
      showSnackBar: false,
    });
  };

  const Login = () => {
    props.setLoggedIn(true);
    props.history.push("/");
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.SignInPaper} elevation={5}>
        <div>
          <img src="/netra-logo.png" width={60} height={60} />
          <div className={styles.netra}>NETRA</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <h5 style={{ margin: 0 }}>Welcome</h5>
          <h6 style={{ margin: 0 }}>Sign in to your account</h6>
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={toggles.L1}
                onChange={handleToggleChange("L1")}
              />
            }
            label="L1 - SHIP HOD"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggles.L2}
                onChange={handleToggleChange("L2")}
              />
            }
            label="L2 - SHIP CO"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggles.L3}
                onChange={handleToggleChange("L3")}
              />
            }
            label="L3 - FLEET"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggles.L4}
                onChange={handleToggleChange("L4")}
              />
            }
            label="L4 - NHQ"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggles.L5}
                onChange={handleToggleChange("L5")}
              />
            }
            label="L5 - INSMA"
          />
        </FormGroup>
        <Button
          variant="contained"
          style={{ backgroundColor: "#1c4199", color: "white" }}
          onClick={() => Login()}
        >
          Sign In
        </Button>
      </Paper>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </div>
  );
};

export default SignIn
