import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
const useStyles = makeStyles({
  root: {
    color: "green",
    "&$checked": {
      color: "green",
    },
  },
});
const RadioButton = (props) => {
  const classes = useStyles();

  return (
    <Radio className={classes.root} disableRipple color="default" {...props} />
  );
};
export default RadioButton;
