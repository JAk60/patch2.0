import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AgGridColumn } from "ag-grid-react";
// import Table from "../../ui/Table/DataManagerTable";
import Table from "../../ui/Table/Table";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@material-ui/core";

const validate = (values) => {
  const errors = {};
  const dutyCycle = parseFloat(values.dutyCycle);
  if (isNaN(dutyCycle) || dutyCycle < 0 || dutyCycle > 1) {
    errors.dutyCycle = "Duty Cycle must be a number between 0 and 1";
  }
  return errors;
};

const initialValues = {
  equipmentNomenclature: "",
  assemblyNomenclature: "",
  parallelComponents: "",
  // dutyCycle: "",
};

const equipmentOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

const assemblyOptions = [
  { label: "Assembly 1", value: "assembly1" },
  { label: "Assembly 2", value: "assembly2" },
  { label: "Assembly 3", value: "assembly3" },
];

const parallelOptions = [
  { label: "Parallel 1", value: "parallel1" },
  { label: "Parallel 2", value: "parallel2" },
  { label: "Parallel 3", value: "parallel3" },
];
const onCellValueChanged = (params) => {
  console.table(params, "phase data");
  // const { data } = params;
  // const { missionType, duration } = data;
  // console.log(missionType);
  // if (params.colDef.field === "duration") {
  //   const updatedDurations = missionDurations.map((duration, index) =>
  //     index === params.node.rowIndex ? params.newValue : duration
  //   );
  //   setMissionDurations(updatedDurations);
  // }
  // setMissionD(prev =>{
  //   return [...prev, {[missionType]: duration}];

  // });
  // console.log(missionD);
};

const FormikForm = () => {
  const [gridCompApi, setGridCompApi] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rowCompState, setCompRows] = useState([]);
  const EquipmentNomenclatures = useSelector(
		(state) => state.userSelection.componentsData
	);
  const assemblies = useSelector(
		(state) => state.treeData.sortTreeData
	);
  const [assemblyData,setAssemblyData]= useState([]);

  const handleSubmit = (values) => {
    console.log(values);
    const allRowData = [values.assemblyNomenclature, ...values.parallelComponents];
    let newData = [];
		allRowData.forEach((d,index) => {
			newData.push({
				assembly: d,
        // dutyCycle: "",
				id: uuid(),
			});
		});
    console.log(newData);
		setCompRows(newData);
    setSubmittedData(allRowData);
    setIsSubmitted(true);
    // Handle form submission here
  };
  console.log(submittedData);
  const AssemblyDutyColumns = [
    <AgGridColumn
      field="assembly"
      headerName="Assembly"
      headerTooltip="Assembly"
      cellEditor="agSelectCellEditor"
      // checkboxSelection={true}
      cellEditorParams={{
        values: submittedData,
      }}
      width="220"
      editable={true}
    />,
    <AgGridColumn
      field="Duty cycle(0-1)dutycycle"
      headerName="Duty cycle(0-1)"
      headerTooltip="Duty cycle(0-1)"
      type="number"
      width={100}
      editable={true}
      onCellValueChanged={onCellValueChanged}
    />,
  ];
  const handleSave = () => {
    // Send data to the endpoint /save_system
    console.log("Saving:", submittedData);
    // Example fetch call
    fetch("/save_system", {
      method: "POST",
      body: JSON.stringify(submittedData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // Handle response
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const updateFinalRowData = (d) => {
    console.log(d);
		// setMissionData(d);
  // tableUpdate(d);
	};
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ errors, touched, setFieldValue, setFieldTouched }) => (
          <Form>
            <Autocomplete
              options={EquipmentNomenclatures}
              getOptionLabel={(option) => option.nomenclature}
						  groupBy={(option) => option.ship_name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Equipment Nomenclature"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setFieldValue(
                  "equipmentNomenclature",
                  newValue ? newValue.label : ""
                );
                setFieldTouched("equipmentNomenclature", true);
              }}
            />

            <Autocomplete
              options={assemblyOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assembly Nomenclature"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setFieldValue(
                  "assemblyNomenclature",
                  newValue ? newValue.label : ""
                );
                setFieldTouched("assemblyNomenclature", true);
              }}
            />

            <Autocomplete
              multiple
              options={parallelOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parallel Components"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                setFieldValue(
                  "parallelComponents",
                  newValue ? newValue.map((option) => option.label) : []
                );
                setFieldTouched("parallelComponents", true);
              }}
            />

            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <div>
        {isSubmitted && submittedData.length > 0 && (
          <div>
            	<Table
										columnDefs={AssemblyDutyColumns}
										setGrid={setGridCompApi}
										gridApi={gridCompApi}
										rowData={rowCompState}
										tableUpdate={updateFinalRowData}
										tableSize={250}
									/>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "20px" }}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormikForm;
