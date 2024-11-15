import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import randomColor from "randomcolor";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { elementActions } from "../../../store/elements";
import customclasses from "./ComponentDetails.module.css";


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
    width: "100%",
    "& .MuiAccordionDetails-root": {
      "flex-direction": "column",
    },
    "& .MuiFormControl-root": {
      margin: "5px",
    },
    "& .MuiFormLabel-root": {
      fontSize: "0.8rem",
    },
    "& .MuiInputBase-input": {
      height: "0.6rem",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const AccordionStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid gray",
    borderRadius: "10px",
    marginTop: 20,
  },
}));

const ComponentDetails = (props) => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state) => state.elements.node);


  const parentName = useSelector(
    (state) => state.elements.selectedNodeParentName
  );
  let filteredOptions = useSelector(
    (state) => state.elements.selectedNodeSiblings
  );
  filteredOptions = filteredOptions.map((x) => {
    return { value: x.id, label: x.data.label };
  });
  const p_selectRef = useRef();
  const kRef = useRef();
  const kRefELH = useRef();
  const kRefC = useRef();
  const kRefDS = useRef();
  const kRefAS = useRef();
  const nodeNameRef = useRef();
  const classes = useStyles();

  const accordionClasses = AccordionStyles();

  const [inputValues, setInputValues] = useState({
    k: "",
    k_elh: "",
    k_c: "",
    k_ds: "",
    k_as: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    k: "",
    k_elh: "",
    k_c: "",
    k_ds: "",
    k_as: "",
  });

  const onHandleChange = (e) => {
    dispatch(
      elementActions.onHandleNameChange({
        nodeName: nodeNameRef.current.value,
        node: selectedNode,
      })
    );
  };

  const onHandleInputChange = (e) => {
    const { name, value } = e.target;

    if (/^[0-9]?$/.test(value)) {
      setInputValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [name]: "Please enter a number between 0 and 9.",
      }));
    }
  };

  const isSaveDisabled =
    inputValues.k !== "" &&
    inputValues.k_elh !== "" &&
    inputValues.k_c !== "" &&
    inputValues.k_ds !== "" &&
    inputValues.k_as !== "";
  console.log(isSaveDisabled);

  const onHandleButtonClick = () => {
    const parallel_comp = p_selectRef.current.state.value;
    const color = randomColor({ luminosity: "bright", format: "rgb" });

    dispatch(
      elementActions.updateParallelComponent({
        k: kRef.current.value,
        k_elh: kRefELH.current.value,
        k_c: kRefC.current.value,
        k_ds: kRefDS.current.value,
        k_as: kRefAS.current.value,
        parallel_comp: parallel_comp,
        color: color,
      })
    );

    setInputValues({
      k: "",
      k_elh: "",
      k_c: "",
      k_ds: "",
      k_as: "",
    });

    kRef.current.value = "";
    kRefELH.current.value = "";
    kRefC.current.value = "";
    kRefDS.current.value = "";
    kRefAS.current.value = "";
    p_selectRef.current.state.value = null;
  };
  return (
    <div className={classes.root}>
      {BasicDetailsAccordion()}
      {AdvanceDetailsAccordion()}
    </div>
  );

  function BasicDetailsAccordion() {
    return <Accordion
      square
      elevation={0}
      classes={accordionClasses}
      defaultExpanded={true}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Basic Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className={customclasses.inputlabel}>
                Name
                <input
                  className={customclasses.input}
                  ref={nodeNameRef}
                  type="text"
                  placeholder="Name"
                  value={selectedNode.data.label}
                  onChange={onHandleChange}
                ></input>
              </label>
              <label className={customclasses.inputlabel}>
                Parent Name
                <input
                  className={customclasses.input}
                  type="text"
                  placeholder="Parent Name"
                  value={parentName}
                  readOnly
                  disabled
                ></input>
              </label>
            </div>
          </form>
        </div>
      </AccordionDetails>
    </Accordion>;
  }

  function AdvanceDetailsAccordion() {
    return <Accordion
      square
      elevation={0}
      classes={accordionClasses}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography className={classes.heading}>
          Advance Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <label className={customclasses.inputlabel}>
            Please Select Parallel Components
            <Select
              ref={p_selectRef}
              options={filteredOptions}
              isMulti
              isSearchable />
          </label>
          <label className={customclasses.inputlabel}>
            <input
              className={customclasses.input}
              name="k"
              ref={kRef}
              type="number"
              placeholder="Enter K-Harbour value"
              value={inputValues.k}
              onChange={onHandleInputChange}
            ></input>
            {errorMessages.k && (
              <span className={customclasses.error}>{errorMessages.k}</span>
            )}
          </label>
          <label className={customclasses.inputlabel}>
            <input
              className={customclasses.input}
              name="k_elh"
              ref={kRefELH}
              type="number"
              placeholder="Enter K- Entry Leaving Harbour value"
              value={inputValues.k_elh}
              onChange={onHandleInputChange}
            ></input>
            {errorMessages.k_elh && (
              <span className={customclasses.error}>
                {errorMessages.k_elh}
              </span>
            )}
          </label>
          <label className={customclasses.inputlabel}>
            <input
              className={customclasses.input}
              name="k_c"
              ref={kRefC}
              type="number"
              placeholder="Enter K-Cruise value"
              value={inputValues.k_c}
              onChange={onHandleInputChange}
            ></input>
            {errorMessages.k_c && (
              <span className={customclasses.error}>{errorMessages.k_c}</span>
            )}
          </label>
          <label className={customclasses.inputlabel}>
            <input
              className={customclasses.input}
              name="k_ds"
              ref={kRefDS}
              type="number"
              placeholder="Enter K-Defense Station value"
              value={inputValues.k_ds}
              onChange={onHandleInputChange}
            ></input>
            {errorMessages.k_ds && (
              <span className={customclasses.error}>
                {errorMessages.k_ds}
              </span>
            )}
          </label>
          <label className={customclasses.inputlabel}>
            <input
              className={customclasses.input}
              name="k_as"
              ref={kRefAS}
              type="number"
              placeholder="Enter K-Action Station value"
              value={inputValues.k_as}
              onChange={onHandleInputChange}
            ></input>
            {errorMessages.k_as && (
              <span className={customclasses.error}>
                {errorMessages.k_as}
              </span>
            )}
          </label>
          <button
            className={`${customclasses.savebtn} ${!isSaveDisabled ? customclasses.disabledButton : ""}`}
            onClick={onHandleButtonClick}
            disabled={!isSaveDisabled}
          >
            Save Details
          </button>
        </div>
      </AccordionDetails>
    </Accordion>;
  }
};

export default ComponentDetails;
