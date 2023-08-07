import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from "@material-ui/core";
import styles from "./pm.module.css";
import OptTable from "./OptTable";
import GroupTable from "./GroupTable";

const OptiQ = ({ questions, name, currQ, option, eta, beta }) => {
  const [answers, setAnswers] = useState({
  });
  const [tableData, setTableData] = useState([]);
  const [n, setN] = useState(0);

  const handleAnswerChange = (event, questionId) => {
    const { value } = event.target;
    console.log(`question_id ${questionId}, value ${value}`)
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: parseFloat(value),
    }));
    console.log(answers, "answers")
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    const newRow = { ...answers, method: name };
    setTableData((prevTableData) => [...prevTableData, newRow]);
    setN(newRow?.n);
  };

  return (
    <Grid container spacing={2} className={styles.mainOp}>
      <Grid item xs={12} md={6}>
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
            <Button type="submit" variant="contained" color="primary" onClick={handleAddRow}>
              Add Row
            </Button>
          </form>
        </div>
      </Grid>
      <Grid item xs={12} md={6} className={styles.overflowHidden}>
        <div className={styles.OptTable}>
          {n ? (
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
          ) : (
            <OptTable
              columnDefs={currQ.columns?.map((column) => ({
                headerName: column,
                field: column,
              }))}
              rowData={tableData}
              setRowData={setTableData} // Use tableData as the rowData for the OptTable
              height={200}
              answers={answers}
              name={name}
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default OptiQ;
