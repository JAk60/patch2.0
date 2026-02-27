import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "4px",
    padding: '40px',
    // minHeight: '60vh',
    width: '71%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center', // Vertical centering
    justifyContent: 'center', // Horizontal centering
  },
  formPaper: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    width: '100%',
    maxWidth: '600px', // Control max width
  },
  title: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 600,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: theme.spacing(3),
  },
  questionLabel: {
    marginBottom: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    gap: theme.spacing(2),
  },
  submitButton: {
    flex: 1,
    padding: theme.spacing(1.5),
    fontWeight: 600,
  },
  resetButton: {
    flex: 1,
    padding: theme.spacing(1.5),
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  dialogContent: {
    minWidth: 300,
  },
  resultSection: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#f8f9fa',
    borderRadius: theme.spacing(1),
  },
  resultValue: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    fontSize: '1.1rem',
  },
  resultLabel: {
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
  },
  optimizationTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: theme.spacing(2),
    '& th': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      padding: theme.spacing(1.5),
      textAlign: 'left',
      fontWeight: 600,
      borderBottom: `2px solid ${theme.palette.primary.dark}`,
    },
    '& td': {
      padding: theme.spacing(1.5),
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontWeight: 500,
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f8f9fa',
    },
    '& tr:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
}));

const OptiQ = ({ questions, name, currQ, option, eta, beta }) => {
  const classes = useStyles();
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setAnswers((prev) => ({
      ...prev,
      eeta: eta,
      beta: beta,
    }));
  }, [eta, beta]);

  const handleAnswerChange = (event, questionId) => {
    const { value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value ? parseFloat(value) : '',
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const dataToSend = {
      ...answers,
      method: name,
    };

    try {
      const response = await fetch("/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      
      if (name === "risk_target") {
        setResult({
          type: 'risk_target',
          values: data.t,
        });
      } else {
        setResult({
          type: 'single',
          t: data.t,
          t90: data.t - 0.1 * data.t,
          t110: data.t + 0.1 * data.t,
        });
      }
      
      setOpen(true);
    } catch (error) {
      console.error('Error:', error);
      // Handle error - you can add error state/dialog here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
  };

  const handleReset = () => {
    setAnswers({
      eeta: eta,
      beta: beta,
    });
  };

  const isFormValid = questions?.every(q => 
    q.required ? answers[q.id] !== undefined && answers[q.id] !== '' : true
  );

  return (
    <div className={classes.container}>
      <Paper className={classes.formPaper}>
        <Typography variant="h4" className={classes.title}>
          Optimization Parameters
        </Typography>
        
        {questions?.map((question) => (
          <div key={question.id} className={classes.questionContainer}>
            <Typography variant="h6" className={classes.questionLabel}>
              {question.text}
              {question.required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            {question.type === "text" && (
              <TextField
                type="number"
                value={
                  question.id === "eeta" 
                    ? eta 
                    : question.id === "beta" 
                    ? beta 
                    : answers[question.id] || ""
                }
                onChange={(event) => handleAnswerChange(event, question.id)}
                required={question.required}
                className={classes.textField}
                fullWidth
                variant="outlined"
                placeholder={`Enter ${question.text.toLowerCase()}`}
                inputProps={{
                  step: "any",
                  min: question.min || undefined,
                  max: question.max || undefined,
                }}
              />
            )}
          </div>
        ))}
        
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className={classes.submitButton}
          >
            {loading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={20} color="inherit" />
                Optimizing...
              </div>
            ) : (
              'Submit & Optimize'
            )}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
            className={classes.resetButton}
          >
            Reset Form
          </Button>
        </div>
      </Paper>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            Optimization Results
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {result?.type === "risk_target" ? (
            <div>
              <Typography variant="h6" gutterBottom className={classes.resultLabel}>
                Optimized Time For Maintenance (t):
              </Typography>
              <table className={classes.optimizationTable}>
                <thead>
                  <tr>
                    <th>Risk Level</th>
                    <th>Optimized Time</th>
                    <th>Lower Bound</th>
                    <th>Upper Bound</th>
                  </tr>
                </thead>
                <tbody>
                  {result.values?.map((t, index) => (
                    <tr key={index}>
                      <td>{[0.8, 0.85, 0.9, 0.95][index]}</td>
                      <td>{t.toFixed(4)}</td>
                      <td>{(t * 0.9).toFixed(4)}</td>
                      <td>{(t * 1.1).toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className={classes.resultSection}>
                <Typography variant="h6" className={classes.resultLabel}>
                  Optimized Time For Maintenance:
                </Typography>
                <Typography className={classes.resultValue}>
                  {result?.t?.toFixed(4)}
                </Typography>
              </div>
              
              <div className={classes.resultSection}>
                <Typography variant="body1" className={classes.resultLabel}>
                  Lower Bound: 
                  <span className={classes.resultValue}> {result?.t90?.toFixed(4)}</span>
                </Typography>
                <Typography variant="body1" className={classes.resultLabel}>
                  Upper Bound: 
                  <span className={classes.resultValue}> {result?.t110?.toFixed(4)}</span>
                </Typography>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OptiQ;