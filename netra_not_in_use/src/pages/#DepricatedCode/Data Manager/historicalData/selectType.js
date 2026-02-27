import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

const SelectStyles = makeStyles({
    button: {
      position: "absolute",
      top: 0,
    },
  });
  

 function SelectType() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const SelectClasses = SelectStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={SelectStyles.button}>
      <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained"
        color="primary" onClick={handleClick}>
        Open Historical Data Type
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data">
            Failure Data Point
        </MenuItem>
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data/oem">
            OEM
        </MenuItem>
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data/oem_expert">
            OEM + Expert
        </MenuItem>
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data/expert_judgement">
            Expert Judgement
        </MenuItem>
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data/probability_failure">
            Probability of Failure
        </MenuItem>
        <MenuItem 
        onClick={handleClose} 
        component={Link}
        to="/data_manager/historical_data/nprd">
            NPRD
        </MenuItem>
      </Menu>
    </div>
  );
}
export default SelectType;