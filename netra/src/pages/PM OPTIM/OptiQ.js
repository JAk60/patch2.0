import { Button, Grid, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import GroupTable from "./GroupTable";
import OptTable from "./OptTable";
import styles from "./pm.module.css";

const OptiQ = ({ questions, name, currQ, option, eta, beta }) => {
  const [answers, setAnswers] = useState({
  });
  const [tableData, setTableData] = useState([]);
  const [n, setN] = useState(0);

  console.log(currQ.columns)

  const handleAnswerChange = (event, questionId) => {
    const { value } = event.target;
    console.log(`question_id ${questionId}, value ${value}`)
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: parseFloat(value),
    }));
    console.log(answers, "answers")
  };

  useEffect(() => {
    setAnswers({
      ...answers,
      eeta: eta,
      beta: beta,
    });
  }, [eta, beta, answers]);

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
        <Typography variant="h5" className={styles.questions}>Parameters</Typography>
          <form>
            {questions?.map((question) => (
              <div key={question.id} className={styles.question}>
                <Typography variant="h6">{question.text}</Typography>
                {question.type === "text" && (
                  <TextField
                    type="number"
                    value = {  question.id === "eeta" ? eta : question.id === "beta" ? beta : answers[question.id] || ""}
                    onChange={(event) => handleAnswerChange(event, question.id)}
                    required={question.required}
                    className={`${styles.answer} ${styles.noArrows}`}
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
