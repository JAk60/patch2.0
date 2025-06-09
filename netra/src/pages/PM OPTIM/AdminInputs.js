import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useSelector } from "react-redux";
import styles from "./pm.module.css";

export default function AdminInputs({ setSelectedComponentId, HandleSubmit }) {
  const systemDirectChildrens = useSelector((state) => state.treeData.treeData);

  const onEquipmentChange = (e, selectedoption) => {
    const filteredChild = systemDirectChildrens.filter(
      (x) => x?.id === selectedoption?.id
    );
    setSelectedComponentId(filteredChild);
    console.log(filteredChild, "filteredChild");
    // setHistoricalChildData(filteredChild);
  };

  return (
    <div className={styles.mprofile}>
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

      <Button variant="contained" color="primary" onClick={HandleSubmit}>
        Submit
      </Button>
    </div>
  );
}
