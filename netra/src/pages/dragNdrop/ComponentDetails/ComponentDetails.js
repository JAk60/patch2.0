import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import customclasses from "./ComponentDetails.module.css";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { elementActions } from "../../../store/elements";
import randomColor from "randomcolor";

import GroupData from "./GroupData";

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
  const allElements = useSelector((state) => state.elements.elements);
  const edgesN = allElements
    .filter((x) => x.dtype === "edge")
    .map((x) => x.source);

  const groupDataKN = GroupData();
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
  const knP = useRef();
  const classes = useStyles();

  const accordionClasses = AccordionStyles();
  const data = useSelector((state) => state.elements.node.data);

  const [inputValues, setInputValues] = useState({
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
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
      }),
      setInputValues({
        k: "",
        k_elh: "",
        k_c: "",
        k_ds: "",
        k_as: "",
      })
    );

    kRef.current.value = "";
    kRefELH.current.value = "";
    kRefC.current.value = "";
    kRefDS.current.value = "";
    kRefAS.current.value = "";
    p_selectRef.current.state.value = null;
  };

  const onHandleUpdateKN = () => {
    const color = randomColor({ luminosity: "bright", format: "rgb" });
    const nodes = knP.current.state.value;
    dispatch(
      elementActions.onUpdateKNHandler({
        nodes: nodes,
        color: color,
      })
    );
  };

  return (
    <div className={classes.root}>
      <Accordion
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
      </Accordion>
      <Accordion square elevation={0} classes={accordionClasses}>
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
                isSearchable
              />
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
            </label>
            <label className={customclasses.inputlabel}>
              <input
                className={customclasses.input}
                type="number"
                placeholder="Enter N value"
                disabled={true}
                style={{ background: "rgb(235, 235, 228)" }}
              ></input>
            </label>
            <button
              className={`${
                customclasses.savebtn
              } ${!isSaveDisabled ? customclasses.disabledButton : ""}`}
              onClick={onHandleButtonClick}
              disabled={!isSaveDisabled}
            >
              Save Details
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ComponentDetails;
