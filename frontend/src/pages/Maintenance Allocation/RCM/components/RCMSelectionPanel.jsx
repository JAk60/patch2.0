import AutoSelect from "../../../../ui/Form/AutoSelect";
import styles from "../../CreateMaintenance/CreateMaintenance.module.css";

const RCMSelectionPanel = ({
  fData,
  fDataCritical,
  selectedComponent,
  selectedCriticalComponent,
  onComponentChange,
  onCriticalComponentChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-evenly",
        marginTop: "1rem",
      }}
    >
      <div className={styles.selectComponent}>
        Select Assemblies to be included for RCM Analysis:
        <AutoSelect
          fields={fData}
          onChange={(e, value) => onComponentChange(value)}
          value={selectedComponent}
        />
      </div>

      <div className={styles.selectComponent}>
        Select Component for criticality:
        <AutoSelect
          multiple="multiple"
          fields={fDataCritical}
          onChange={(e, value) => onCriticalComponentChange(value)}
          value={selectedCriticalComponent}
        />
      </div>
    </div>
  );
};

export default RCMSelectionPanel;
