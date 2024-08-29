import React,{useEffect} from "react";
import Navigation from "../../components/navigation/Navigation";
import StageSlider from "../../components/slider/NewSlider";
import Table2 from "../../ui/Table/Table2";
import { useState } from "react";
import { Switch, Route, Link,useLocation } from "react-router-dom";
import NewModule from "../../components/module/NewModule";
import UserSelection from "../../ui/userSelection/userSelection";
import { v4 as uuid } from "uuid";
import {
  Button,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import styles from "./HEP.module.css";
import {
  ELcolumnDefs,
  ELrowData,
  CLrowData,
  CLcolumnDefs,
  SLMcolumnDefs,
  SLMrowData,
} from "./HEPData";
import LensIcon from "@material-ui/icons/Lens";
import EquipmentLevelHEP from "./EquipmentLevel/EquipmentLevel";
import HEPLifeMultiplier from "./LifeMultiplier/LifeMultiplier";
import HEPComponentLevel from "./ComponentLevel/componentLevel";
import CHEP from "./CommanHEP/CommanHEP";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import { useSelector,useDispatch } from "react-redux";
import { treeDataActions } from "../../store/TreeDataStore";


const HEPStyles = makeStyles({
  Pbuttons: {
    margin:10,
    float:'right',
    minWidth:200
  },
});

const HEP = (props) => {
  const [Stage, setStage] = useState(0);
  const HEPClasses = HEPStyles();
  const location=useLocation();
  const dispatch = useDispatch();
  const systemData = useSelector((state) => state.treeData.treeData);
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const currentSelectedSystem = useSelector(
    (state) => state.userSelection.currentSelection.equipmentName
  );

  let finalTableData = [];
  const setFinalTableData = (d) => {
    finalTableData = d;
    if (finalTableData.length > 0) {
      console.log("Hi");
    }
  };
  const [experience,setExperience]=useState({low:0,nominal:100,high:0})
  const [workCulture,setWorkCulture]=useState('nominal')
  const [fitness,setFitness]=useState({low:0,nominal:100,high:0})
  const [saveExt, setSaveExt] = useState(true)

  const handleExp=(e,psfType)=>{
    setExperience({...experience,[psfType]:e.target.value})
  }

  useEffect(() => {
    let sum=Number(experience.low)+Number(experience.high)+Number(experience.nominal)
    //console.log(sum);
    if(sum!=100){
      document.querySelectorAll('.experience').forEach(input=>{
        input.style.border='red 1px solid'
        setSaveExt(false)
      })
    }else{
      document.querySelectorAll('.experience').forEach(input=>{
        input.style.border='black 1px solid'
        setSaveExt(true)
      })
    }
  }, [experience])

  const handleWC=(e)=>{
    setWorkCulture(e.target.value)
  }

  const handleFit=(e,psfType)=>{
    setFitness({...fitness,[psfType]:e.target.value})
  }

  useEffect(() => {
    let sum=Number(fitness.low)+Number(fitness.high)+Number(fitness.nominal)
    //console.log(sum);
    if(sum!=100){
      document.querySelectorAll('.fitness').forEach(input=>{
        input.style.border='red 1px solid'
        setSaveExt(false)
      })
    }else{
      document.querySelectorAll('.fitness').forEach(input=>{
        input.style.border='black 1px solid'
        setSaveExt(true)
      })
    }
  }, [fitness])

  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "This is awesome",
    showSnackBar: false,
  });
  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "Please Add Systemss",
      showSnackBar: false,
    });
  };
  const sData = useSelector((state) => state.userSelection.componentsData);

  const currentEquipmentName = currentSelection["equipmentName"];
  const matchingItems = sData.filter(item => item.name === currentEquipmentName);

  const matchingId = matchingItems[0]?.id;
  const onLoadTreeStructure = () => {
    const payload = {
      system: currentSelection["equipmentName"],
      ship_name: currentSelection["shipName"],
    };
  
    if (matchingId) {
      payload.component_id = matchingId;
    }
    console.log(payload)
    fetch("/fetch_system", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        console.log(d);
        let treeD = d["treeD"];
        let failureModes = d["failureMode"];
        console.log(failureModes)
        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
          }),
        );
        dispatch(
          treeDataActions.setFailureModes(failureModes)
        )
      });
  };

  const onSaveButtonClickHandler = () => {
    const currentLocation = location.pathname;
    let newTdata = [];
    let dType = "";
    //console.log(currentLocation);
    if (currentLocation === "/HEP") {
     if(currentSelectedSystem){ 
       const ComponentId = systemData.filter(
        (x) => x.name === currentSelectedSystem
      )[0].id;
      newTdata = finalTableData.map((x) => {
        return { ...x, ComponentId: ComponentId };
      });
      dType = "insertHEP";}
    } else if (currentLocation === "/HEP/component_level") {
      newTdata=finalTableData;
      dType = "insertComponentLevel";
    } else if (currentLocation === "/HEP/ext_factors") {
      if(saveExt){
        if(currentSelectedSystem){
          const ComponentId = systemData.filter(
          (x) => x.name === currentSelectedSystem
        )[0].id;
        newTdata=[{
          id:uuid(),
          ComponentId: ComponentId,
          expNominal:experience.nominal,
          expLow:experience.low,
          expHigh:experience.high,
          workCulture:workCulture,
          fitNominal:fitness.nominal,
          fitLow:fitness.low,
          fitHigh:fitness.high
        }]};
        dType = "insertExtFactors";
      }
    } else if (currentLocation === "/HEP/swlife_multiplier") {
      newTdata=finalTableData;
      dType = "insertLifeMultiplier";
    } 
    debugger;
    //Else End
    if (newTdata.length > 0) {
      fetch("/save_hep", {
        method: "POST",
        body: JSON.stringify({
          flatData: newTdata,
          dtype: dType,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
        })
        .catch((error) => {
          setSnackBarMessage({
            severity: "error",
            message: "Some Error Occured. " + error,
            showSnackBar: true,
          });
        });
    } else {
      setSnackBarMessage((prevState) => {
        const data = {
          ...prevState,
          message: "This is error",
          showSnackBar: true,
        };
        return data;
      });
    }
  };

  const NextStage = () => {
    if (Stage === 0) {
      setStage(1);
      props.history.push("/HEP/swlife_multiplier");
    }
  };

  let marks = [
    {
      value: 30,
      label: "HEP Modelling",
    },

    {
      value: 85,
      label: "Spare Wise Life Multiplier",
    },
  ];

  const nextModule = (settings) =>{
    if(settings.DataManager){
      props.history.push("/data_manager")
    }
    else if(settings.ReliabilityDashboard){
      props.history.push("/rDashboard")
    }
  }

  return (
    <>
      <Navigation />
      {/* <Module/> */}
      {/* <NewModule /> */}
      {/* <Slider marks={marks} default={marks[0]["value"]}/> */}
      <StageSlider marks={marks} default={marks[Stage]["value"]} />
      <div className={styles.flex1}>
        <UserSelection/>
        <div>
          <Route
            exact
            path={["/HEP", "/HEP/ext_factors", "/HEP/component_level"]}
          >
            <Button
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
              onClick={onLoadTreeStructure}
            >
              Load Equipment
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
            >
              Select PSF Criteria
            </Button>
          </Route>
          <Button
            variant="contained"
            color="primary"
            className={HEPClasses.Pbuttons}
            onClick={()=>onSaveButtonClickHandler()}
          >
            Save
          </Button>
          <Route exact path="/HEP">
            <Button
              component={Link}
              to="/HEP/component_level"
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
            >
              Next
            </Button>
          </Route>
          <Route exact path="/HEP/component_level">
            <Button
              component={Link}
              to="/HEP/ext_factors"
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
            >
              Next
            </Button>
          </Route>
          <Route exact path="/HEP/ext_factors">
            <Button
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
              onClick={() => NextStage()}
            >
              Next Stage
            </Button>
          </Route>
          <Route exact path="/HEP/swlife_multiplier">
            <Button
                variant="contained"
                color="primary"
                className={HEPClasses.Pbuttons}
                onClick={onLoadTreeStructure}
              >
                Load Equipment
            </Button>
            <Button
              onClick={()=>nextModule(props.settings)}
              variant="contained"
              color="primary"
              className={HEPClasses.Pbuttons}
            >
              Next Module
            </Button>

          </Route>
        </div>
      </div>
      <Switch>
        <Route exact path="/HEP">
          <EquipmentLevelHEP
            tableUpdate={setFinalTableData}
          ></EquipmentLevelHEP>
        </Route>
        <Route path="/HEP/ext_factors" exact={true}>
          <CHEP
          experience={experience}
          handleExp={handleExp}
          workCulture={workCulture}
          handleWC={handleWC}
          fitness={fitness}
          handleFit={handleFit}
          ></CHEP>
        </Route>

        <Route path="/HEP/component_level" exact>
          <HEPComponentLevel
            tableUpdate={setFinalTableData}
          ></HEPComponentLevel>
        </Route>
        <Route path="/HEP/swlife_multiplier" exact>
          <HEPLifeMultiplier
            tableUpdate={setFinalTableData}
          ></HEPLifeMultiplier>
        </Route>
      </Switch>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};

export default HEP;
