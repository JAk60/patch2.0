import { useState } from 'react';
import { Switch, FormGroup, FormControlLabel } from '@material-ui/core';
import styles from './Home.module.css';

const Login = ({ setLoggedIn }) => {
  const [toggles, setToggles] = useState({
    L1: false,
    L2: false,
    L3: false,
    L4: false,
    L5: false,
  });

  const handleToggleChange = (toggleName) => (event) => {
    setToggles({ ...toggles, [toggleName]: event.target.checked });
  };

  return (
    <div className={styles.container}>
      <div className={styles.homeNav}>
        <div className={styles.netra}>
          <img src="/images/netra-logo-removebg.png" width={200} height={200} />
          <div>NETRA</div>
        </div>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={toggles.L1} onChange={handleToggleChange('L1')} />}
            label="L1"
          />
          <FormControlLabel
            control={<Switch checked={toggles.L2} onChange={handleToggleChange('L2')} />}
            label="L2"
          />
          <FormControlLabel
            control={<Switch checked={toggles.L3} onChange={handleToggleChange('L3')} />}
            label="L3"
          />
          <FormControlLabel
            control={<Switch checked={toggles.L4} onChange={handleToggleChange('L4')} />}
            label="L4"
          />
          <FormControlLabel
            control={<Switch checked={toggles.L5} onChange={handleToggleChange('L5')} />}
            label="L5"
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default Login;
