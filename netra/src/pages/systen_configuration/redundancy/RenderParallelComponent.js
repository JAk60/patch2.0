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

const RenderParallelComponent = forwardRef((props, ref, isMultiple = true) => {
  const [value, setValue] = useState([]);
  const refInput = useRef(null);
  const location = useLocation();
  //   alert(location.pathname);
  let potentialParallelComponents = [];
  const systemData = useSelector((state) => state.treeData.treeData);
  const userSelection = useSelector(
    (state) => state.userSelection.userSelection
  );
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const componentsData = useSelector(
    (state) => state.userSelection.componentsData
  );
  const selectedEquipment = props.data.EquipmentName;
  const selectedEquipmentId = props.data.eqId;

  if (location.pathname === "/system_config/additional_info") {
    debugger;
    const currentSelectedPlatform = currentSelection["shipName"];

    potentialParallelComponents = userSelection["equipmentName"].map((x) => {
      let id = componentsData.filter((c) => c.name === x)[0]["id"];
      return {
        name: x,
        parentName: currentSelectedPlatform,
        id: id,
      };
    });
  } else {
    potentialParallelComponents = systemData.filter(
      (x) => x.name !== selectedEquipment
    );
  }

  const handleChange = (event, newValue) => {
    debugger;
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
        if (location.pathname === "/system_config/failure_mode") {
          ids = [value.id];
          valueStr = [value.name];
          props.data["rEquipmentId"] = ids[0];
        } else {
          value.forEach((element) => {
            ids = [...ids, element.id];
            valueStr = [...valueStr, element.name];
          });
          props.setParallelIds(ids);
        }
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
      options={potentialParallelComponents}
      //value={value}
      multiple={props.isMultiple}
      onChange={handleChange}
      groupBy={(option) => option.parentName}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
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
export default RenderParallelComponent;
