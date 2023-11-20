import React, {
    useEffect,
    useState,
    useImperativeHandle,
    useRef,
    forwardRef,
  } from "react";
  import Autocomplete from "@material-ui/lab/Autocomplete";
  import TextField from "@material-ui/core/TextField";
  import { useDispatch, useSelector } from "react-redux";
  import { useLocation } from "react-router";
  
  const RenderMultipleComponent = forwardRef((props, ref, isMultiple = true) => {
    debugger;
    const [value, setValue] = useState([]);
    const refInput = useRef(null);
    const location = useLocation();
    //   alert(location.pathname);
    let potentialParallelComponents = [];
    const systemData = useSelector((state) => state.treeData.treeData);
    const taskData = useSelector((state) => state.taskData.taskData);
    const currentShip = useSelector((state) => state.taskData.currentShip);
    console.log(currentShip)
    const currentTaskName = useSelector((state) => state.taskData.currentTaskName);
    console.log(currentTaskName)
    const filteredData = taskData?.tasks_data.filter(
      (x) => x.ship_name === currentShip && x.task_name === currentTaskName
    );
    console.log(taskData)
    console.log(filteredData)
    // debugger;
    // const userSelection = useSelector(
    //   (state) => state.userSelection.userSelection
    // );
    // const currentSelection = useSelector(
    //   (state) => state.userSelection.currentSelection
    // );
    // const componentsData = useSelector(
    //   (state) => state.userSelection.componentsData
    // );
    // const selectedEquipment = props.data.EquipmentName;
    debugger;
    const selectedEquipmentId = props.data.id;
    
    // potentialParallelComponents = systemData.filter(
    //   (x) => x.name !== selectedEquipment
    // );
  
    const handleChange = (event, newValue) => {
      // debugger;
      setValue(newValue);
    };
  
    // useEffect(() => {
    //   // focus on the input
    //   //setTimeout(() => refInput.current.focus());
    //   console.log(potentialParallelComponents);
    // }, []);
  
    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          debugger;
          //console.log(value);
          let valueStr = [];
          let ids = [];
          // if (location.pathname === "/system_config/additional_info") {
          //   value.forEach((element) => {
          //     valueStr = [...valueStr, element.name];
          //   });
          // } else
          props.data.components = []
          value.forEach((element) => {
            debugger;
            ids = [...ids, element.EquipmentId];
            valueStr = [...valueStr, element.name];
            props.data.components.push(element)
          });
          props.setParallelIds(ids);
          // if (location.pathname === "/system_config/failure_mode") {
          //   ids = [value.id];
          //   valueStr = [value.name];
          //   props.data["rEquipmentId"] = ids[0];
          // } else {
            
           
          // }
          return valueStr.toString();
        },
        isPopup() {
          return true;
        },
        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return false;
        },
  
        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        // isCancelAfterEnd() {
        //     // our editor will reject any value greater than 1000
        //     return value > 1000;
        // }
      };
    });
  
    return (
      // <input type="number"
      //        ref={refInput}
      //        value={value}
      //        onChange={event => setValue(event.target.value)}
      //        style={{width: "100%"}}
      // />
      <Autocomplete
        id={selectedEquipmentId}
        options={filteredData[0]?.task_data || []}
        //value={value}
        multiple={props.isMultiple}
        onChange={handleChange}
        // groupBy={(option) => option.name}
        getOptionLabel={(option) => option.name}
        style={{ width: 850 }}
        renderInput={(params) => (
          <TextField
            {...params}
            ref={refInput}
            label={props.label}
            variant="outlined"
          />
        )}
      />
    );
  });
  export default RenderMultipleComponent;
  