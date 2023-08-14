import React, { useState } from 'react';
import styles from './SignUp.module.css';
import CustomizedSnackbars from '../../ui/CustomSnackBar';
import {
  Paper,
  makeStyles,
  InputBase,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Typography,
  TextField, // Import the TextField component
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const InputStyles = makeStyles({
  root: {
    paddingRight: 10,
    paddingLeft: 10,
    background: '#fff',
    border: '1px solid #0263a1',
    borderRadius: '5px',
    height: 40,
    boxShadow: '2px 3px 5px -1px rgba(0,0,0,0.2)',
    width: '100%',
  },
});

const SignUp = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  // const [fname, setFname] = useState('');
  // const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState(''); // Add state for access level
  const InputClasses = InputStyles();
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
      username: username,   // Replace with the new username to insert
      password: password, // Replace with the new password to insert
      level: accessLevel, // Replace with the new level to insert
    };

    fetch("/insert_user", {
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
        history.push('/sign_in', { message: "user created successfully" });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackBarMessage({
          severity: "error",
          message: "user is already exist",
          showSnackBar: true,
        })
      });
  }

  return (
    <div className={styles.container}>
      <Paper className={styles.SignUpPaper} elevation={5}>
        <div>
        <img src='/netra-logo-removebg.png' height={300} />
          <div className={styles.netra}>NETRA</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography variant='h4'>Sign in to your account</Typography>
        </div>
        <form id={styles.signUpForm}>
          <div className={styles.flex}>
            <InputBase
              classes={InputClasses}
              name='username'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              className={styles.inputField}
              required
            />
          </div>
  
          <div className={styles.flex}>
            <InputBase
              classes={InputClasses}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              placeholder='Password'
              className={styles.inputField}
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
              classes={InputClasses}
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id='confirm-password'
              placeholder='Confirm Password'
              className={styles.inputField}
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
          </div>
        
          <div className={styles.flex}>
            {/* Level of Access input */}
            <TextField
              select
              label="Level of Access"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              variant="outlined"
              className={`${styles.accessLevelInput} ${styles.inputField}`}
            >
              <option value="L1">Ship HoD</option>
              <option value="L2">Ship CO</option>
              <option value="L3">Fleet/ Command HQ</option>
              <option value="L4">NHQ</option>
              <option value="L5">Admin/ INSMA</option>
              <option value="L6">OEM</option>
            </TextField>
          </div>
        </form>
        <Button
          variant='contained'
          style={{ backgroundColor: '#1c4199', color: 'white' }}
          onClick={handleCreateAccount}
        >
          Create Account
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

export default SignUp;