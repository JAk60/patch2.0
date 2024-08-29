import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const EquipmentName = forwardRef((props, ref) => {
  const [value, setValue] = useState([]);
  const refInput = useRef(null);
  const systemData = useSelector((state) => state.treeData.treeData);
  const location = useLocation();
  const handleChange = (event, newValue) => {
    debugger;
    // alert(newValue);
    setValue(newValue);
  };

  // useEffect(() => {
  //     // focus on the input
  //     //setTimeout(() => refInput.current.focus());
  //     console.log(systemData)
  // }, []);

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        //console.log(value);
        const path = location.pathname;
        if (path === "/data_manager/maintenance_data") {
          props.setId(value.id);
        }
        return value.name;
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
      options={systemData}
      //value={value}
      onChange={handleChange}
      groupBy={(option) => option.parentName}
      getOptionLabel={(option) => option.name}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          ref={refInput}
          label="Select Equipment"
          variant="outlined"
        />
      )}
    />
  );
});
export default EquipmentName;
