import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import styles from "./pm.module.css";
import OptTable from "./OptTable";
import GroupTable from "./GroupTable";

// ... (other imports and styles)

const OptiQ = ({ questions, name, currQ,option }) => {
  const [answers, setAnswers] = useState({});
  const [tableData, setTableData] = useState([]);
  const [n, setN] = useState(0);
  console.log(tableData)
  // Added tableData state to store the row data for the table

  const handleAnswerChange = (event, questionId) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: parseFloat(value),
    }));
    console.log(answers);
  };
  const handleAddRow = (e) => {
    e.preventDefault();
    const newRow = { ...answers, method: name };
    setTableData((prevTableData) => [...prevTableData, newRow]);
    setN(newRow?.n);
  };
  console.log(tableData)
  return (
    <>
      <div className={styles.mainOp}>
        <div className={styles.userSele}>
          <h3>{name} Questions</h3>
          <form>
            {questions?.map((question) => (
              <div key={question.id}>
                <label>{question.text}</label>
                {question.type === "text" && (
                  <TextField
                    type="number"
                    value={answers[question.id] || ""}
                    onChange={(event) => handleAnswerChange(event, question.id)}
                    required={question.required}
                  />
                )}
                {/* Add other input types (e.g., select, radio, checkbox) based on the question type */}
              </div>
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleAddRow}
            >
              Add Row
            </Button>
          </form>
        </div>
        <div className={styles.OptTable}>
          {/* {option === 'option3' || option === 'option4'? */}
          {n ?
           <GroupTable 
           n={n}
           columnDefs={currQ.columns?.map((column) => ({
            headerName: column,
            field: column,
          }))}
          tData={tableData} // Use tableData as the rowData for the OptTable
          height={200}
          answers={answers}
          name={name}
           />
          
          :<OptTable
            columnDefs={currQ.columns?.map((column) => ({
              headerName: column,
              field: column,
            }))}
            rowData={tableData}
            setRowData={setTableData} // Use tableData as the rowData for the OptTable
            height={200}
            answers={answers}
            name={name}
          />}
        </div>
      </div>
    </>
  );
};

export default OptiQ;
