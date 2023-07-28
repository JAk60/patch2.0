import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Paper,InputBase,Button,InputAdornment,IconButton} from '@material-ui/core'
import styles from './ChangePass.module.css'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const InputStyles = makeStyles({
    root: {
        margin:'15px 0px 5px 0px',
        paddingRight: 10,
        paddingLeft: 10,
        background: "#ebebeb",
        borderRadius: "5px",
        height: 40,
        width: '70%',
        boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
    },
    label:{
        fontWeight: 600
    }
  });

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const BackStyles = makeStyles((theme) => ({
    root: {
        background:'linear-gradient(210deg, rgba(41,41,113,0.85) 0%, rgba(4,142,231,0.85) 100%)'
    }
  }));

const PassModal = (props) => {
  const classes = useStyles();

  const bgClasses= BackStyles();
  
  const InputClasses=InputStyles();

  const[showPassword,setShowPassword]=useState(false);

  const[password,setPassword]=useState('');

  const[confirmPassword,setConfirmPassword]=useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };  

  return (
    <div>
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.passModal}
        onClose={props.handlePassClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          classes:bgClasses
        }}
      >
        <Fade in={props.passModal}>
        <Paper className={styles.PassPaper} elevation={5}>
            <div>
            <img src='/netra-logo.png' width={60} height={60}/>
            <div className={styles.netra}>NETRA</div>
            </div>
            <div style={{textAlign:'center'}}>
            <h5 style={{margin:0}}>Create a strong password</h5>
            </div>
            <InputBase 
            classes={InputClasses} 
            name='password' 
            id='password' 
            placeholder='Password' 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
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
            required/>
            <InputBase 
            classes={InputClasses} 
            name='conf-password' 
            id='conf-password' 
            placeholder='Confirm Password' 
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
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
            required/>
            Use 8 or more characters with a mix of letters,numbers & symbols
            <Button variant='contained' style={{backgroundColor:'#1c4199',color:'white'}} >Save Password</Button>
            
            
            
        </Paper>
        </Fade>
      </Modal>
    </div>
  );
}
export default PassModal;