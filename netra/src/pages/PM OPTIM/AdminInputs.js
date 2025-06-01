import { Button, TextField, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/ApplicationVariable";
import styles from './pm.module.css';
const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
  },
  autocomplete: {
    margin: "1rem",
    minWidth: 250,
  },
  deleteButton: {
    margin: "1rem",
  },
});

export default function AdminInputs({ HandleSubmit, onSelectionChange }) {
  const [selectedOptimizationType, setSelectedOptimizationType] = useState("");
  const [selectedOptimizationSubtype, setSelectedOptimizationSubtype] = useState("");

  const optimization_subtypes = ["Risk based", "Cost Criterion", "Downtime Criterion"];
  const optimization_types = ["Risk Based Replacement", "Calendar Time Based Replacement(Group)", "Calendar Time Based Replacement", "Age Based Replacement"];
  const systemDirectChildrens = useSelector(
    (state) => state.treeData.treeData);
  const classes = useStyles();
  const dispatch = useDispatch();



  // Effect to call onSelectionChange when both selections are made
  useEffect(() => {
    if (selectedOptimizationType && selectedOptimizationSubtype && onSelectionChange) {
      onSelectionChange(selectedOptimizationType, selectedOptimizationSubtype);
    }
  }, [selectedOptimizationType, selectedOptimizationSubtype, onSelectionChange]);

  const onEquipmentChange = (e, selectedoption) => {
    const filteredChild = systemDirectChildrens.filter(
      (x) => x.id === selectedoption.id
    );
    console.log(filteredChild, "filteredChild");
    // setHistoricalChildData(filteredChild);
  };

  const optimizationTypeChange = (e, value) => {
    setSelectedOptimizationType(value);
    // Reset dependent selections
    setSelectedOptimizationSubtype("");

    const data = { optimizationType: value };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };

  const optimizationSubtypeChange = (e, value) => {
    setSelectedOptimizationSubtype(value);
    const data = { optimizationSubtype: value };
    dispatch(userActions.onChangeCurrentSelection({ selectedData: data }));
  };


  // Filter subtypes based on selected optimization type
  const getFilteredSubtypes = () => {
    if (selectedOptimizationType === "Risk Based Replacement") {
      return optimization_subtypes.filter(subtype => subtype === "Risk based");
    }
    return optimization_subtypes.filter(subtype => subtype !== "Risk based");
  };

  return (
    <div className={styles.mprofile}>
      <Autocomplete
        className={classes.autocomplete}
        options={optimization_types}
        value={selectedOptimizationType}
        getOptionLabel={(option) => option}
        onChange={optimizationTypeChange}
        renderInput={(params) => (
          <TextField {...params} label="Optimization type" variant="outlined" />
        )}
      />

      <Autocomplete
        className={classes.autocomplete}
        options={getFilteredSubtypes()}
        value={selectedOptimizationSubtype}
        getOptionLabel={(option) => option}
        onChange={optimizationSubtypeChange}
        renderInput={(params) => (
          <TextField {...params} label="Optimization subtype" variant="outlined" />
        )}
      />
      <Autocomplete
        options={systemDirectChildrens}
        groupBy={(option) => option.parentName}
        getOptionLabel={(option) => option.nomenclature}
        style={{ width: 300 }}
        onChange={onEquipmentChange}
        renderInput={(params) => (
          <TextField {...params} label="Select Assembly" variant="outlined" />
        )}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={HandleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}