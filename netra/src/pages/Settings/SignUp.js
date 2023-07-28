import React,{ useState } from 'react'
import styles from './SignUp.module.css'
import { Paper,makeStyles,InputBase,Button,FormControlLabel,Checkbox,InputAdornment,IconButton} from '@material-ui/core'
import { Link } from 'react-router-dom';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const InputStyles = makeStyles({
    root: {
        paddingRight: 10,
        paddingLeft: 10,
        background: "#fff",
        border:'1px solid #0263a1',
        borderRadius: "5px",
        height: 40,
        boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
        width:'100%'
      },
  });

const SignUp=()=>{
    const[showPassword,setShowPassword]=useState(false);
    const[fname,setFname]=useState('');
    const[lname,setLname]=useState('');
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[confirmPassword,setConfirmPassword]=useState('');
    const InputClasses=InputStyles();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return(
        <div className={styles.container}>
        <Paper className={styles.SignUpPaper} elevation={5}>
            <div>
                <img src='/netra-logo.png' width={60} height={60}/>
                <div className={styles.netra}>NETRA</div>
            </div>
            <div style={{textAlign:'center'}}>
                <h4 style={{margin:0}}>Create Your Account</h4>
            </div>
            <form id={styles.signUpForm}>
            <div className={styles.flex}>
                <InputBase classes={InputClasses} name='firstname' value={fname} onChange={(e)=>{setFname(e.target.value)}} id='firstname' placeholder='First Name' required/>
                <InputBase classes={InputClasses} name='lastname' value={lname} onChange={(e)=>{setLname(e.target.value)}} id='lastname' placeholder='Last Name' required/>
            </div>
            <div className={styles.flex}>
                <InputBase 
                classes={InputClasses} 
                name='username' 
                id='username' 
                value={username} 
                onChange={(e)=>{setUsername(e.target.value)}}
                placeholder='Username' 
                endAdornment={
                    <InputAdornment position="end">
                      @netra.com
                    </InputAdornment>
                  }
                required/>
            </div>
            <div className={styles.flex} style={{marginLeft:'2%'}}>
            You can use letters,numbers,periods.
            </div>
            <div className={styles.flex}>
                <InputBase 
                classes={InputClasses} 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                id='password' 
                placeholder='Password' 
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
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                id='confirm-password' 
                placeholder='Confirm Password' 
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
            </div>
            <div className={styles.flex} style={{marginLeft:'2%'}}>
            Use 8 or more characters with a mix of letters,numbers & symbols
            </div>
            </form>
            <Button 
            variant='contained' 
            style={{backgroundColor:'#1c4199',color:'white'}}
            onClick={()=>{console.log(fname,lname,username,password,confirmPassword)}}
            >Create Account</Button>
        </Paper>
    </div>
    )
}

export default SignUp;