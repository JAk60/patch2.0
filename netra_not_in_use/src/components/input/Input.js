import classes from "./Input.module.css";
import CustomButton from "../../ui/Button";

const Input = () => {
  return (
    <div className={classes.input}>
      <div className={classes.parent}>
        <div className={classes.buttonp}>
          <div>
            <CustomButton>Replicate</CustomButton>
            <CustomButton>Save</CustomButton>
            <CustomButton>Next Stage</CustomButton>
          </div>
          {/* <div className={classes.platform_text}>
            Platform name - Talwar | System name - DA
          </div> */}
        </div>
        {/* <div className={classes.inputf}>
          <div className={classes.inputcomponent}>
            <SelectComponent></SelectComponent>
            <SelectComponent></SelectComponent>
            <SelectComponent></SelectComponent>
          </div>
          <div className={classes.inputfbutton}>
            <CustomButton>Submit</CustomButton>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Input;
