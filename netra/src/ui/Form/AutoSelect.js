import { makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
const InputStyles = makeStyles({
  root: {
    paddingRight: 10,
    paddingLeft: 10,
    background: "#fff",
    border:'1px solid #0263a1',
    borderRadius: "5px",
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
});

export default function AutoSelect(props) {
  debugger;
  const options = props.fields?.map((option) => {
    return {
      ...option,
    };
  });
  const Inputclasses = InputStyles();
  return (
    <Autocomplete
      multiple={props.multiple}
      classes={Inputclasses}
      id="grouped-demo"
      options={options}
      groupBy={(option) => option.parentName}
      // getOptionLabel={(option) => option.name}
      getOptionLabel={(option) => option.nomenclature || ""}
      //style={{ width: 300 }}
      value={props.value || null}
      onChange={props.onChange}
      renderInput={(params) => <TextField  {...params} InputProps={{...params.InputProps, disableUnderline: true}} />}
    />
  );
}
