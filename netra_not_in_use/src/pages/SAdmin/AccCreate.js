import React, { useState } from "react";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import {
  Paper,
  makeStyles,
  InputBase,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  TextField,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  paper: {
    width: "70%",
    textAlign: "center",
    padding: "20px 20px 30px 20px",
    borderRadius: "10px",
    marginTop: "30px",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
  },
  input: {
    margin: "15px 0px",
    paddingRight: "10px",
    paddingLeft: "10px",
    background: "#ebebeb",
    borderRadius: "5px",
    height: "50px",
    width: "30%",
    fontSize: "16px",
  },
  level: {
    borderRadius: "5px",
    background: "#ebebeb",
    width: "30%",
  },
  button: {
    backgroundColor: "#1c4199",
    color: "white",
    marginTop: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    fontSize: "16px",
    border: "1px solid black",
  },
});

const AccCreate = () => {
  const classes = useStyles();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "",
    showSnackBar: false,
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "",
      showSnackBar: false,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCreateAccount = () => {
    const data = {
      username: username,
      password: password,
      level: accessLevel,
    };

    fetch("/insert_user", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 1) {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
          setTimeout(() => {
            history.push('/sign_in', { message: data.message });
          }, 2000); // 2000 milliseconds = 2 seconds
        } else if (data.code === 0 || data.code === 400 || data.code === 409) {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        } else {
          // Catch-all for unexpected codes
          setSnackBarMessage({
            severity: "warning",
            message: "Unexpected response from server.",
            showSnackBar: true,
          });
        }
      })
      .catch(error => {
        console.error("Error creating account:", error);
        setSnackBarMessage({
          severity: "error",
          message: "An error occurred while creating the account. Please try again later.",
          showSnackBar: true,
        });
      });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        <div>
          <div>
            <Typography variant="h4">Welcome</Typography>
            <Typography variant="h6">Create account</Typography>
          </div>
          <form className={classes.form}>
            <InputBase
              className={classes.input}
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <InputBase
              className={classes.input}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              required
            />
            <InputBase
              className={classes.input}
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              placeholder="Confirm Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              required
            />
            <TextField
              select
              label="Level of Access"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              variant="outlined"
              className={classes.level}
            >
              <option value="L0" className={classes.option}>
                Developer Mode
              </option>
              <option value="L1" className={classes.option}>
                Ship HoD
              </option>
              <option value="L2" className={classes.option}>
                Ship CO
              </option>
              <option value="L3" className={classes.option}>
                Fleet/ Command HQ
              </option>
              <option value="L4" className={classes.option}>
                NHQ
              </option>
              <option value="L5" className={classes.option}>
                Admin/ INSMA
              </option>
              <option value="L6" className={classes.option}>
                OEM
              </option>
            </TextField>
          </form>
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </div>
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

export default AccCreate;
