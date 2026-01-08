import React from "react";
import { Button } from "@material-ui/core";
import styles from "../../CreateMaintenance/CreateMaintenance.module.css";

const RCMActions = ({
  onSaveAndGenerate,
  onDownload,
  onOptimize,
  hasResults,
}) => {
  return (
    <div className={styles.rcmbtns} style={{ marginTop: "2rem" }}>
      <Button
        className={styles.nextbtn}
        onClick={onOptimize}
        style={{ marginRight: "2rem" }}
        variant="contained"
        color="primary"
      >
        Optimize
      </Button>

      <Button
        className={styles.nextbtn}
        onClick={onDownload}
        style={{ marginRight: "2rem" }}
        variant="contained"
        color="primary"
      >
        Download Report
      </Button>
      <Button
        className={styles.nextbtn}
        onClick={onSaveAndGenerate}
        style={{ marginRight: "2rem" }}
        variant="contained"
        color="primary"
        disabled={!hasResults}
      >
        Save & Generate Report
      </Button>

    </div>
  );
};

export default RCMActions;
