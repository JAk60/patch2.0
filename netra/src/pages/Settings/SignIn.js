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
    height: 40,
    width: '70%',
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
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
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          localStorage.setItem('login', true);
          const isLoggedIn = localStorage.getItem('login');
          if(isLoggedIn === 'true'){
            props.setLoggedIn(true)
          }
          console.log({ level: data.level, value: true })
          dispatch(setLevel({ level: data.level, value: true }))
          localStorage.setItem('userData', JSON.stringify({ level: data.level, value: true }));
          // props.history.push('/')
        })
        .catch(error => {
          setSnackBarMessage({
            severity: "error",
            message: "Enter Correct Login details",
            showSnackBar: true,
          })
        });
    }
    else {
      setSnackBarMessage({
        severity: "error",
        message: "Enter Correct Login details",
        showSnackBar: true,
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
        <div>
          <img src='/netra-logo-removebg.png'  height={300} />
          <div className={styles.netra}>NETRA</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          {/* <h5 style={{ margin: 0 }}>Welcome</h5> */}
          <Typography variant='h5'>Welcome</Typography>
          <Typography variant='h6'>Sign in to your account</Typography>
        </div>
        <InputBase classes={InputClasses} name='username' value={userName} onChange={(e) => setUserName(e.target.value)} id='username' placeholder='User Name' required />
        <InputBase classes={InputClasses} name='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='text' required />
        <Button variant='contained' style={{ backgroundColor: '#1c4199', color: 'white' }} onClick={() => Login()}>Sign In</Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
          {/* <FormControlLabel
            classes={{
              label: InputClasses.label
            }}
            style={{ color: '#1c4199' }}
            control={<Checkbox style={{ color: '#1c4199' }} checked={keepLogin} onChange={() => { setKeepLogin(!keepLogin) }} name="checkedA" />}
            label="Keep me logged in"
          />
         */}
        </div>
        <Link className={styles.links} to="/sign_up">
          Create an Account? Sign Up
        </Link>
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