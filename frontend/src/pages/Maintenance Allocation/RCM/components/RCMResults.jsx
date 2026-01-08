// ============================================================================
// Results Component
// ============================================================================
// components/RCMResults.jsx

import React from "react";
import { Typography } from "@material-ui/core";
import styles from "../../CreateMaintenance/CreateMaintenance.module.css";

const RCMResults = ({ currentSelection, finalRCMAns }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <div className={styles.horizontalTable}>
        <div className={styles.horizontalTableCell}>
          <Typography variant="h6">
            <strong>Ship Name:</strong> {currentSelection["shipName"]}
          </Typography>
        </div>
        <div className={styles.horizontalTableCell}>
          <Typography variant="h6">
            <strong>Component Name:</strong> {currentSelection["equipmentName"]}
          </Typography>
        </div>
        <div className={styles.horizontalTableCell}>
          <Typography variant="h6">
            <strong>RCM Analysis:</strong> {finalRCMAns}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default RCMResults;
