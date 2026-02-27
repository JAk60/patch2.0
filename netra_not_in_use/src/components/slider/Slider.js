import CustomizedSlider from "./SliderData";
import classes from "./Slider.module.css";
const Slider = (props) => {
  return (
    <div className={classes.slider}>
      <div className={classes.sliderdiv}>
        <CustomizedSlider
          marks={props.marks}
          default={props.default}
        ></CustomizedSlider>
      </div>
    </div>
  );
};
export default Slider;
