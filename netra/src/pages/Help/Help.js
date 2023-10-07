import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import classes from "./Help.module.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";

const modules = {
    "System Configuration": {
      info: "Information about System Configuration module.",
      pdfLink: "./PDF/system_config_pdf.pdf",
    },
    "Reliability Dashboard": {
      info: "Information about Reliability Dashboard module.",
      pdfLink: "/rDashboard_pdf",
    },
    "Monitoring Dashboard": {
      info: "Information about Monitoring Dashboard module.",
      pdfLink: "/CDashboard_pdf",
    },
    "Mission Reliability Dashboard": {
      info: "Information about Mission Reliability Dashboard module.",
      pdfLink: "/TaskDashboard_pdf",
    },
    "Mission Configuration": {
      info: "Information about Mission Configuration module.",
      pdfLink: "/dnd_pdf",
    },
    "View Or UpdateData": {
      info: "Information about View or Update Data module.",
      pdfLink: "/view_data_pdf",
    },
    "Maintenance Allocation": {
      info: "Information about Maintenance Allocation module.",
      pdfLink: "/maintenance_allocation_pdf",
    },
    "Time To Failure RUL": {
      info: "Information about Time to Failure and RUL module.",
      pdfLink: "/rul_pdf",
    },
  };
  
  

function Help() {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };
  const handleDownload = (moduleName) => {
    const module = modules[moduleName];
  
    if (module && module.pdfLink) {
      fetch(module.pdfLink)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const a = document.createElement('a');
          a.href = url;
          a.download = `${moduleName}.pdf`; // Set desired file name here
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(error => console.error('Error:', error));
    }
  };
  
  

  return (
    <div
      className={classes.background}
      style={{ backgroundImage: "url(/wave2.svg)" }}
    >
      <div className={classes.flex}>
        <Navigation />
        <div className={classes.content}>
          <Typography variant="h1" gutterBottom className={classes.typo}>
             Welcome to Netra !!
          </Typography>
          {Object.keys(modules).map((module, index) => (
            <Accordion
              key={index}
              expanded={expanded === module}
              onChange={handleChange(module)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${module}-content`}
                id={`${module}-header`}
              >
                <Typography variant="h5">{module}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{modules[module].info}</Typography>
                <Button
                  onClick={() => handleDownload(module)}
                  variant="outlined"
                  color="primary"
                >
                  Download PDF
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <img
          src="/netra-logo-removebg.png"
          width={180}
          height={190}
          alt="Netra Logo"
        />
      </div>
    </div>
  );
}

export default Help;
