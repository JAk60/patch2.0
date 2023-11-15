import React, { useState } from "react";
import styles from "./ForgotPass.module.css";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import {
  Paper,
  makeStyles,
  InputBase,
  Button,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const InputStyles = makeStyles({
  root: {
    margin: "15px 0px 5px 0px",
    paddingRight: 10,
    paddingLeft: 10,
    background: "#ebebeb",
    borderRadius: "5px",
    height: 50,
  },
});

const ForgotPass = () => {
  const [username, setUsername] = useState("");
  const InputClasses = InputStyles();
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "",
    showSnackBar: false,
  });
  const history = useHistory();

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "",
      showSnackBar: false,
    });
  };

  const handleCreateAccount = () => {
    const managerEmail = "pradeep.patell707@gmail.com"; // Replace with the actual manager's email
    const subject = "Forgot Password";
    const body = `Username: ${username}\nDetails: ...`;

    const mailtoLink = `mailto:${managerEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    // The following code remains unchanged
    const data = {
      username: username,
    };

    fetch("/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.code) {
          history.push("/sign_in", { message: data.message });
        } else {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        }
      });
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.SignUpPaper} elevation={5}>
        <div className={styles.welcome_text}>
          <img src="/netra-logo-removebg.png" height={300} alt="Netra Logo" />
          <div className={styles.netra}>NETRA</div>
        </div>
        <div className={styles.input_fields}>
          <div className={styles.subheading}>
            <Typography variant="h4">Welcome</Typography>
            <Typography variant="h6">Please Fill the below Details</Typography>
          </div>
          <form id={styles.signUpForm}>
            <div className={styles.flex}>
              <InputBase
                classes={InputClasses}
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={styles.inputField}
                required
              />
            </div>
          </form>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#1c4199",
              color: "white",
              marginTop: "10px",
            }}
            onClick={handleCreateAccount}
          >
            Submit
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

export default ForgotPass;
