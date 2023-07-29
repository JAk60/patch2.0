import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import { Link, Route, Switch } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import styles from "./historicalData.module.css";
import ImportData from "../importData/importData";
import FailureDataPoint from "./failureDataPoint";
import OEM from "./oem";
import OEMExpert from "./oemExpert";
import Expert from "./expert";
import ProbabilityFailure from "./probabilityFailure";
import NPRD from "./nprd";
import IntervalDataPoint from "./IntervalData";
import { useSelector } from "react-redux";
import RepairableOverhaul from "../repairableOverhaul/repairableOverhaul";
import treeData from "../../../store/TreeDataStore";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // marginTop: theme.spacing(10),
    // marginBottom: theme.spacing(5),
    margin: theme.spacing(8),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
function HistoricalData(props) {
  const classes = useStyles();
  const [historicalChildData, setHistoricalChildData] = useState([]);
  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.sortTreeData
  );
  // let filteredSystemConfigData = [];
  const [type, setType] = React.useState("");

  const handleChange = (event) => {
    debugger;
    // alert(event.target.value);
    setType(event.target.value);
    if (event.target.value === "OEM + Expert") {
      props.handleDropdown("oemE");
    } else if (event.target.value === "Expert Judgement") {
      props.handleDropdown("expert");
    } else if (event.target.value === "oem") {
      props.handleDropdown("oem");
    } else if (event.target.value === "Import Data") {
      props.handleDropdown("import_replacable");
    } else if (event.target.value === "Failure Data Point") {
      props.handleDropdown("fdp");
    } else if (event.target.value === "Interval Data Point") {
      props.handleDropdown("interval");
    } else if (event.target.value === "Probability Failure") {
      props.handleDropdown("prob");
    }else if (event.target.value === "NPRD") {
      props.handleDropdown("nprd");
    }
  };
  let systemRepairTypeBool = false;
  let systemRepairedReplaceableOptions = (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel>Select Historical Data Type </InputLabel>
      <Select
        value={type}
        onChange={handleChange}
        label="Select Historical Data Type"
      >
        <MenuItem value="">
          <em>Select Type</em>
        </MenuItem>
      </Select>
    </FormControl>
  );
  console.log(systemConfigurationTreeData, "system conf")

  if (systemConfigurationTreeData.length > 0) {
    // filteredSystemConfigData = systemConfigurationTreeData.filter(
    //   (x) => x.parentId === null
    // )[0];
    // console.log(equipment)
    // debugger
    const EquipRtype = systemConfigurationTreeData[0]?.repairType
    systemRepairTypeBool =
    EquipRtype === "Replaceable" ? true : false;
      console.log(systemRepairTypeBool);
      if(!systemRepairTypeBool){ 
        <Redirect to="/data_manager/historical_data/repairable_overhaul"></Redirect>
       }
    
    if (EquipRtype === "Replaceable") {
      systemRepairedReplaceableOptions = (
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Select Historical Data Type </InputLabel>
          <Select
            value={type}
            onChange={handleChange}
            label="Select Historical Data Type"
          >
            <MenuItem value="">
              <em>Select Type</em>
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/import_data"
              value={"Import Data"}
            >
              Input Parameters
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/failure_datapoint"
              value={"Failure Data Point"}
            >
              Actual Data Point
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/interval_datapoint"
              value={"Interval Data Point"}
            >
              Interval Data Point
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/oem"
              value={"oem"}
            >
              OEM
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/oem_expert"
              value={"OEM + Expert"}
            >
              OEM + Expert
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/expert_judgement"
              value={"Expert Judgement"}
            >
              Expert Judgement
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/probability_failure"
              value={"Probability Failure"}
            >
              Probability Failure
            </MenuItem>
            <MenuItem
              component={Link}
              to="/data_manager/historical_data/nprd"
              value={"NPRD"}
            >
              NPRD
            </MenuItem>
            
          </Select>
        </FormControl>
      );
    }
  }

  const onEquipmentChange = (e, selectedoption) => {
    debugger;
    const filteredChild = systemConfigurationTreeData.filter(
      (x) => x.id === selectedoption.id
    );
    setHistoricalChildData(filteredChild);
  };

  const updateFinalRowData = (allRows, dataType) => {
    props.tableUpdate(allRows, dataType);
  };
  debugger;

  return (
    <div>
      {systemRepairTypeBool && ( // Only render if systemRepairTypeBool is true
      <div className={`${styles.flex}`}>
        <div>
          <Autocomplete
            id="combo-box-demo"
            groupBy={(option) => option.parentName}
            options={systemConfigurationTreeData}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            onChange={onEquipmentChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Equipment" variant="outlined" />
            )}
          />
        </div>
        <div>{systemRepairedReplaceableOptions}</div>
      </div>
    )}
      <Switch>
        <Route path="/data_manager/historical_data/import_data" exact={true}>
          <div className={styles.table}>
            <ImportData
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route
          path="/data_manager/historical_data/failure_datapoint"
          exact={true}
        >
          <div className={styles.table}>
            <FailureDataPoint
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route
          path="/data_manager/historical_data/interval_datapoint"
          exact={true}
        >
          <div className={styles.table}>
            <IntervalDataPoint
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route path="/data_manager/historical_data/oem" exact={true}>
          <div className={styles.table}>
            <OEM
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route path="/data_manager/historical_data/oem_expert" exact={true}>
          <div className={styles.table}>
            <OEMExpert
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route
          path="/data_manager/historical_data/expert_judgement"
          exact={true}
        >
          <div className={styles.table}>
            <Expert
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route
          path="/data_manager/historical_data/probability_failure"
          exact={true}
        >
          <div className={styles.table}>
            <ProbabilityFailure
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route path="/data_manager/historical_data/nprd" exact={true}>
          <div className={styles.table}>
            <NPRD
              childList={historicalChildData}
              tableUpdate={updateFinalRowData}
            />
          </div>
        </Route>
        <Route
          path="/data_manager/historical_data/repairable_overhaul"
          exact={true}
        >
          <div className={styles.table}>
            <RepairableOverhaul tableUpdate={updateFinalRowData} />
          </div>
        </Route>
      </Switch>
      {!systemRepairTypeBool &&
      <Redirect to="/data_manager/historical_data/repairable_overhaul"></Redirect>
      }
    </div>
  );
}
export default HistoricalData;
