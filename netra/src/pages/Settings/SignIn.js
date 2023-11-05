import React, { useEffect, useState } from 'react'
import styles from './SignIn.module.css'
import { Paper, makeStyles, InputBase, Button, FormControlLabel, Checkbox, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom';
import CustomizedSnackbars from '../../ui/CustomSnackBar';
import { useDispatch } from 'react-redux';
import { setLevel } from '../../store/Levels';
import { useLocation } from 'react-router-dom';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const InputStyles = makeStyles({
  root: {
    margin: '15px 0px 5px 0px',
    paddingRight: 10,
    paddingLeft: 10,
    background: "#ebebeb",
    borderRadius: "5px",
    height: 50,
    // width: '%',
    // boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
  label: {
    fontWeight: 600
  }
});


const SignIn = (props) => {
  if (props.loggedIn) {
    props.history.push('/')
  }


  const location = useLocation();
  const message = location.state?.message;
  const [open, setOpen] = React.useState(!!message);

  const [keepLogin, setKeepLogin] = useState(false);
  const InputClasses = InputStyles();
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleMClose = () => {
    setOpen(false);
  };


  const [showSnackBar, setShowSnackBar] = useState(false);
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

  const dispatch = useDispatch();

  const Login = () => {

    if (userName && password) {
      const data = {
        username: userName, // Replace with the username to check
        password: password  // Replace with the password to check
      };

      fetch("/get_credentials", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log(data)
          if (data.code) {
            localStorage.setItem('login', true);
            const isLoggedIn = localStorage.getItem('login');
            if (isLoggedIn === 'true') {
              props.setLoggedIn(true)
            }
            console.log({ level: data.message.level, value: true })
            dispatch(setLevel({ level: data.message.level, value: true }))
            localStorage.setItem('userData', JSON.stringify({ level: data.message.level, value: true }));
          } else {
            setSnackBarMessage({
              severity: "error",
              message: data.message,
              showSnackBar: true,
            })
          }
        })
      
    }
  }
  return (
    <div className={styles.container}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleMClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleMClose} severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
      <Paper className={styles.SignInPaper} elevation={5}>
        <div className={styles.welcome_text}>
          <img src='/netra-logo-removebg.png' height={300} />
          <div className={styles.netra}>NETRA</div>
        </div>
        <div className={styles.input_fields}>
          <div className={styles.subheading}>
            {/* <h5 style={{ margin: 0 }}>Welcome</h5> */}
            <Typography variant='h4'>Welcome</Typography>
            <Typography variant='h6'>Sign in to your account</Typography>
          </div>
          <InputBase classes={InputClasses} name='username' value={userName} onChange={(e) => setUserName(e.target.value)} id='username' placeholder='User Name' required />
          <InputBase classes={InputClasses} name='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='text' required />
          <Button variant='contained' style={{ backgroundColor: '#1c4199', color: 'white', marginTop: "10px" }} onClick={() => Login()}>Sign In</Button>
          <Link className={styles.links} to="/forgot_password">
            Forgot Password ?
          </Link>
        </div>
      </Paper>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </div>
  )
}

export default SignIn