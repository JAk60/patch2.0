import { makeStyles, InputBase } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const LabelStyles = makeStyles({
  root: {
    color: "black",
    fontWeight: "bold",
    fontSize: "1.3rem",
    position: "unset",
    marginBottom: 10,
  },
});
const InputStyles = makeStyles({
  root: {
    paddingRight: 10,
    paddingLeft: 10,
    background: "#fff",
    border:'1px solid #0263a1',
    borderRadius: "5px",
    // height: 40,
    boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
  },
});

export default function AutoSelect(props) {
  debugger;
  const options = props.fields?.map((option) => {
    //const firstLetter = option.parentName.toUpperCase();
    // firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
    return {
      ...option,
    };
  });
  const Labelclasses = LabelStyles();
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
