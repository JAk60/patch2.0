import React, { useState, useCallback } from "react";
import Navigation from "../../../components/navigation/Navigation";
import styles from "./AddData.module.css";
import UserSelection from "../../../ui/userSelection/userSelection";
import { Button, makeStyles } from "@material-ui/core";
import TreeComponent from "../../../components/sortableTree/SortableTree";
import { useSelector, useDispatch } from "react-redux";
import { treeDataActions } from "../../../store/TreeDataStore";
import AutoSelect from "../../../ui/Form/AutoSelect";
import { AgGridColumn } from "ag-grid-react";
import Table from "../../../ui/Table/Table";
import { v4 as uuid } from "uuid";
import Loader from "react-loader-spinner";
import { useDropzone } from "react-dropzone";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";

const useStyles = makeStyles({
  buttons: {
    margin: 5,
    minWidth: 170,
    float: "right",
  },
  align: {
    marginBottom: 10,
  }
});

const AddData = (props) => {
  const dispatch = useDispatch();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  let fData = useSelector((state) => state.treeData.treeData);

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

  const [isloading, setLoading] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [selectedComponent, setComponent] = useState(null);
  const [paramData, setParamData] = useState([]);

  const selectOnChange = (e, value) => {
    setDataRows([]);
    if (value) {
      setLoading(true);
      fetch("/fetch_params", {
        method: "POST",
        body: JSON.stringify({
          ComponentId: value.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((d) => {
          setParamData(d);
        });
      setComponent(value);
      setLoading(false);
    }
  };

  const saveParamData = () => {
    fetch("/save_condition_monitoring", {
      method: "POST",
      body: JSON.stringify({
        flatData: dataRows,
        dtype: "insertParamData",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
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
  };

  const DataColumnDefs = [
    <AgGridColumn
  field="date"
  headerName="DateTime"
  headerTooltip="DateTime"
  editable={true}
  cellEditorFramework={(params) => (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        value={params.value}
        onChange={(date) => {
          const formattedDate = moment(date).format("DD/MM/YYYY, HH:mm:ss");
          const newValue = {
            ...params.data,
            date: formattedDate,
          };
          const updatedDataRows = dataRows.map((row) => {
            if (row.id === newValue.id) {
              return newValue;
            }
            return row;
          });
          setDataRows(updatedDataRows);
        }}
        format="yyyy-MM-dd HH:mm:ss"
      />
    </MuiPickersUtilsProvider>
  )}
/>
,
    <AgGridColumn
      field="parameterName"
      headerName="Parameter"
      headerTooltip="Parameter"
      cellEditor="agSelectCellEditor"
      cellEditorParams={{
        values: paramData.map((data) => data.name),
      }}
      editable={true}
      onCellValueChanged={(params) => {
        let parameter = paramData.filter(
          (d) => d.name === params.data.parameterName
        );
        params.data.paramId = parameter[0]?.id;
      }}
    />,
    <AgGridColumn
      field="value"
      headerName="Value"
      headerTooltip="Value"
      editable={true}
    />,
      <AgGridColumn
        headerName="Operating Hours"
        field="operatingHours"
        headerTooltip="Operating Hours"
        editable={true}
      />,
  ];

  const addRow = () => {
    let newRow = {
      componentId: selectedComponent.id,
      id: uuid(),
      date: "",
      parameterName: "",
      paramId: "",
      value: "",
      operatingHours: "",
    };
    setDataRows([...dataRows, newRow]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    formData.append("File", acceptedFiles[0]);
    fetch("/add_data", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Snackbar
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

  const classes = useStyles();
  console.log(dataRows, "flag");

  return (
    <>
      <Navigation />
      <div className={styles.userSelection}>
        <UserSelection />
        <div>
          {/* <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button
              className={classes.buttons}
              variant="contained"
              color="primary"
            >
              Import File
            </Button>
          </div> */}
          <Button
            className={classes.buttons}
            onClick={onLoadTreeStructure}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tree}>
          <div className={styles.treeChild}>
            <TreeComponent height="600px"></TreeComponent>
          </div>
        </div>
        <div className={styles.rightSection}>
          
          {/* <div className={styles.userSelection} >
          <div className={styles.selectComponent}>
            Select Component
            <AutoSelect
              fields={fData}
              onChange={selectOnChange}
              value={selectedComponent}
            ></AutoSelect>
          </div>
            <div>
              <Button
                className={classes.buttons}
                variant="contained"
                color="primary"
              >
                Import File
              </Button>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
              </div>
            </div>
          </div> */}
          <div className={styles.userSelection}>
  <div className={styles.selectContainer}>
    <div className={styles.selectC}>
      Select Component
      <AutoSelect
        fields={fData}
        onChange={selectOnChange}
        value={selectedComponent}
      ></AutoSelect>
    </div>
    <div className={styles.importBtnContainer}>
      <Button
        className={classes.buttons}
        variant="contained"
        color="primary"
      >
        Import File
      </Button>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
    </div>
  </div>
</div>


          {isloading ? (
            <Loader
              type="Puff"
              color="#86a0ff"
              height={300}
              width={300}
              style={{ marginTop: 100 }}
            />
          ) : (
            <div className={styles.table}>
              <Table
                columnDefs={DataColumnDefs}
                rowData={dataRows}
                tableUpdate={(rows) => {
                  console.log(rows);
                }}
                height={300}
              />
              <Button variant="contained" color="primary" onClick={addRow}>
                + Add Row
              </Button>
              <Button
            className={classes.buttons}
            onClick={saveParamData}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
            </div>
          )}
        </div>
      </div>

      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
};

export default AddData;
