import React from 'react';

const WelcomePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <img src="/NavyMan.png" alt="Logo" style={styles.logoImage} />
      </div>
      <h1 style={styles.heading}>Welcome to Dashboard</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  logo: {
    marginBottom: '20px',
  },
  logoImage: {
    width: '450px', // Adjust the width of the logo as needed
    height: '500px', // Adjust the height of the logo as needed
  },
  heading: {
    fontSize: '24px',
  },
};

export default WelcomePage;
