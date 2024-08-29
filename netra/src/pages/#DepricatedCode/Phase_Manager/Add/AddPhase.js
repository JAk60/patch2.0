import { makeStyles } from "@material-ui/core";
import { Button, Grid } from "@material-ui/core";
import { useState } from "react";
import CustomSelect from "../../../ui/Form/CustomSelect";
import CustomTextInput from "../../../ui/Form/CustomTextInput";
import styles from "../Phasemanager.module.css";
import { MProwData } from "../PhasetableData";
import DeleteIcon from "@material-ui/icons/Delete";
const PhaseStyles = makeStyles({
  formControl: {
    // margin: '2rem',
    minWidth: "20%",
  },
  Submit: {
    // margin: '2rem',
    height: 40,
  },
  Pbuttons: {
    marginLeft: 10,
  },
});
const AddPhase = (props) => {
  const PhaseClasses = PhaseStyles();
  // const [RangeInput, setRangeInput] = useState([]);

  // const onAddNewRange = () => {
  //   setRangeInput((prevstate) => {
  //     // const stateLen = prevstate.length;
  //     // // return [...prevstate, stateLen + 1];
  //     return [...prevstate, { Status: "", UBound: "", LBound: "", Desc: "" }];
  //   });
  //   console.log(RangeInput);
  // };
  // const onDeleteRange = (index) => {
  //   debugger;
  //   const rangeCopy = [...RangeInput];
  //   rangeCopy.splice(index, 1);
  //   setRangeInput(rangeCopy);
  // };
  // const handleRangeChange = (index, e) => {
  //   let newArr = [...RangeInput];
  //   newArr[index][e.target.name] = e.target.value;
  //   setRangeInput(newArr);
  // };

  return (
    <div className={styles.addForm}>
      <div>
        <h4>
          Please add only the Medium level phase-range, the system will
          automatically calculate the other two.
        </h4>
      </div>
      <div className={styles.flex} style={{ marginTop: "4rem" }}>
        <CustomTextInput
          label="Parameter Name"
          id="parameter-name"
          className={PhaseClasses.formControl}
          value={props.paramName}
          onChange={props.handleParamNameChange}
        ></CustomTextInput>

        <CustomSelect
          className={PhaseClasses.formControl}
          id="measurement-type"
          label="Measurement Type"
          value={props.MType}
          onChange={props.handleMTypeChange}
          fields={["Quantitative", "Qualitative"]}
        />

        <CustomSelect
          className={PhaseClasses.formControl}
          id="unit"
          label="Unit"
          value={props.Unit}
          onChange={props.handleUnitChange}
          fields={["Km/hr", "M/hr"]}
        ></CustomSelect>
        {/* <Button
          variant="contained"
          color="primary"
          className={PhaseClasses.Submit}
          onClick={() => addRow()}
        >
          Submit
        </Button> */}
      </div>
      <div className={styles.flex} style={{ marginTop: "3rem" }}>
        <Button variant="contained" color="secondary">
          {props.MType} Measurement Type - Range
        </Button>
      </div>
      <div className={styles.flex} style={{ marginTop: "3rem" }}>
        {props.MType === "Qualitative" ? (
          <>
            <CustomTextInput
              style={{ minWidth: "45%" }}
              label="Status"
              id="status"
              className={PhaseClasses.formControl}
              value={props.Status}
              onChange={props.handleStatusChange}
            ></CustomTextInput>
            <CustomTextInput
              style={{ minWidth: "45%" }}
              label="Description"
              id="description"
              className={PhaseClasses.formControl}
              value={props.desc}
              onChange={props.handleDescChange}
            ></CustomTextInput>
          </>
        ) : (
          <>
            <Grid container>
              <Grid container item spacing={4}>
                <Grid item xs={2} style={{ marginTop: "10px" }}>
                  <CustomTextInput
                    label="Phase Range"
                    id="phaserange"
                    className={PhaseClasses.formControl}
                    value={props.PRange}
                    onChange={props.handlePRangeChange}
                  />
                </Grid>
                <Grid item xs={2} style={{ marginTop: "10px" }}>
                  <CustomTextInput
                    label="Lower Bound"
                    id="lowerbound"
                    className={PhaseClasses.formControl}
                    value={props.LBound}
                    onChange={props.handleLBoundChange}
                  />
                </Grid>
                <Grid item xs={2} style={{ marginTop: "10px" }}>
                  <CustomTextInput
                    label="Upper Bound"
                    id="upperbound"
                    className={PhaseClasses.formControl}
                    value={props.UBound}
                    onChange={props.handleUBoundChange}
                  />
                </Grid>
                <Grid item xs={5} style={{ marginTop: "10px" }}>
                  <CustomTextInput
                    label="Description"
                    id="description"
                    style={{ minWidth: "100%" }}
                    className={PhaseClasses.formControl}
                    value={props.desc}
                    onChange={props.handleDescChange}
                  />
                </Grid>
                {/* <Grid item xs={1} style={{ marginTop: "35px" }}>
                  <DeleteIcon
                    fontSize="medium"
                    onClick={() => {
                      onDeleteRange(id);
                    }}
                  />
                </Grid> */}
              </Grid>
            </Grid>
            {/* {props.MType === "Quantitative" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => onAddNewRange()}
              >
                Add
              </Button>
            )} */}
          </>
        )}
      </div>
    </div>
  );
};
export default AddPhase;
