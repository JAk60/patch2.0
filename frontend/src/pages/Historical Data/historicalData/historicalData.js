import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import ImportData from "./importData";
import RepairableOverhaul from "../../DataManager/repairableOverhaul/repairableOverhaul";
import Expert from "./expert";
import FailureDataPoint from "./failureDataPoint";
import IntervalDataPoint from "./IntervalData";
import NPRD from "./nprd";
import OEM from "./oem";
import OEMExpert from "./oemExpert";
import ProbabilityFailure from "./probabilityFailure";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(8),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  table: {
    gridRow: "4",
    gridColumn: "2/13",
    marginLeft: "1%",
    width: "98%",
    justifySelf: "center",
    alignSelf: "center",
    marginBottom: "70px",
  },
  inRow: {
    width: "94%",
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "4%",
    paddingLeft: "2rem",
    marginRight: "5%",
    alignItems: "center",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)"
  },
  OverhaulParent: {
    gridColumn: "2/13",
    gridRow: "2/5",
  }
}));
function HistoricalData(props) {
  const classes = useStyles();
  const [historicalChildData, setHistoricalChildData] = useState([]);
  const [type, setType] = useState("");
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const systemDirectChildrens = useSelector(
    (state) => state.treeData.treeData);
  console.log(systemDirectChildrens);
  const systemConfigurationTreeData = useSelector(
    (state) => state.treeData.sortTreeData
  );
  let systemRepairTypeBool = false;

  const handleChange = (event) => {
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
    } else if (event.target.value === "NPRD") {
      props.handleDropdown("nprd");
    }
  };
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

  configureRepairTypeOptions();

  const onEquipmentChange = (e, selectedoption) => {
    ;
    const filteredChild = systemDirectChildrens.filter(
      (x) => x.id === selectedoption.id
    );
    console.log(filteredChild, "filteredChild");
    setHistoricalChildData(filteredChild);
  };

  const updateFinalRowData = (allRows, dataType) => {
    console.log(allRows)
    props.tableUpdate(allRows, dataType);
  };

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };

  return (
    <>
      <div className={classes.OverhaulParent}>
        {systemRepairTypeBool && ( // Only render if systemRepairTypeBool is true
          <div className={classes.inRow}>
            <div>
              <Autocomplete
                id="combo-box-dem"
                groupBy={(option) => option.parentName}
                options={systemDirectChildrens}
                getOptionLabel={(option) => option.nomenclature}
                style={{ width: 300 }}
                onChange={onEquipmentChange}
                renderInput={(params) => (
                  <TextField {...params} label="Select Assembly" variant="outlined" />
                )}
              />
            </div>
            <div>{systemRepairedReplaceableOptions}</div>
          </div>
        )}
        {historicalDataRoutes()}
      </div>
      {!systemRepairTypeBool &&
        <Redirect to="/historical_data/repairable_overhaul"></Redirect>
      }
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );

  function historicalDataRoutes() {
    return <Switch>
      <Route path="/historical_data/import_data" exact={true}>
        <div className={classes.table}>
          <ImportData
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route
        path="/historical_data/failure_datapoint"
        exact={true}
      >
        <div className={classes.table}>
          <FailureDataPoint
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route
        path="/historical_data/interval_datapoint"
        exact={true}
      >
        <div className={classes.table}>
          <IntervalDataPoint
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route path="/historical_data/oem" exact={true}>
        <div className={classes.table}>
          <OEM
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route path="/historical_data/oem_expert" exact={true}>
        <div className={classes.table}>
          <OEMExpert
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route
        path="/historical_data/expert_judgement"
        exact={true}
      >
        <div className={classes.table}>
          <Expert
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route
        path="/historical_data/probability_failure"
        exact={true}
      >
        <div className={classes.table}>
          <ProbabilityFailure
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route path="/historical_data/nprd" exact={true}>
        <div className={classes.table}>
          <NPRD
            childList={historicalChildData}
            tableUpdate={updateFinalRowData} />
        </div>
      </Route>
      <Route
        path="/historical_data/repairable_overhaul"
        exact={true}
      >
        <div className={classes.Table}>
          <RepairableOverhaul tableUpdate={updateFinalRowData} />
        </div>
      </Route>
    </Switch>;
  }

  function configureRepairTypeOptions() {
    if (systemConfigurationTreeData.length > 0) {
      const EquipRtype = systemConfigurationTreeData[0]?.repairType;
      systemRepairTypeBool =
        EquipRtype === "Replaceable" ? true : false;
      console.log(systemRepairTypeBool);
      if (!systemRepairTypeBool) {
        <Redirect to="/historical_data/repairable_overhaul"></Redirect>;
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
                to="/historical_data/import_data"
                value={"Import Data"}
              >
                Input Parameters
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/failure_datapoint"
                value={"Failure Data Point"}
              >
                Actual Data Point
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/interval_datapoint"
                value={"Interval Data Point"}
              >
                Interval Data Point
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/oem"
                value={"oem"}
              >
                OEM
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/oem_expert"
                value={"OEM + Expert"}
              >
                OEM + Expert
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/expert_judgement"
                value={"Expert Judgement"}
              >
                Expert Judgement
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/probability_failure"
                value={"Probability Failure"}
              >
                Probability Failure
              </MenuItem>
              <MenuItem
                component={Link}
                to="/historical_data/nprd"
                value={"NPRD"}
              >
                NPRD
              </MenuItem>

            </Select>
          </FormControl>
        );
      }
    }
  }
}
export default HistoricalData;
