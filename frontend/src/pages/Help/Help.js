import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import Navigation from "../../components/navigation/Navigation";
import classes from "./Help.module.css";

const modules = {
  "System Configuration": {
    info: " Creating an equipment structure, defining parent- child relations, parallel-series configuration.",
    pdfLink: "pdf/system_config_pdf.pdf",
  },
  "Reliability Dashboard": {
    info: " Displays the reliability of an equipment for the specified duration.",
    pdfLink: "pdf/reliblity_dashboard_pdf.pdf",
  },
  "Monitoring Dashboard": {
    info: " Displays the graph for sensor values",
    pdfLink: "pdf/monitoring_dashboard.pdf",
  },
  "Mission Reliability Dashboard": {
    info: " Displays the reliability for a particular mission.<br/> User can specify the mission duration, phases and the equipments for the task.",
    pdfLink: "pdf/mission_rel_dashboard_pdf.pdf",
  },
  "Mission Configuration": {
    info: "User can configure the task and select equipments for the particular task",
    pdfLink: "pdf/mission_configuration_pdf.pdf",
  },
  "View Or UpdateData": {
    info: ` A) Data Manager - monthly utilisation,maintenance data <br/>
      B) Equipment Related Data - Parameter estimation using historical data <br/>
      C) User Selection Configuration - Adding a new ship <br/>
      D) Add System Documents - Documents related with equipments (Manuals/Training books) <br/>
      E) Add Sensor Data`,
    pdfLink: "pdf/view_data_pdf.pdf",
  },
  "Maintenance Allocation": {
    info: `A) Create maintenance plan-To specify maintenance plans (Sensor based / Inspection based )
              To specify sensors<br/>
          B) Conduct RCM analysis `,
    pdfLink: "pdf/maintenance_allocation_pdf.pdf",
  },
  "Time To Failure RUL": {
    info: " Remaining useful life prediction",
    pdfLink: "pdf/rul_pdf.pdf",
  },
};



function Help() {
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };
  const handleDownload = (moduleName) => {
    debugger
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
          <div className={classes.text_heading}>
            NETRA DOCUMENTATION
          </div>
          {Object.keys(modules).map((module, index) => (
            <Accordion
              key={index}
              expanded={expanded === module}
              onChange={handleChange(module)}
              className={classes.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${module}-content`}
                id={`${module}-header`}
              >
                <div className={classes.heading}>{module}</div>
              </AccordionSummary>
              <AccordionDetails className={classes.info}>
                <Typography variant="h6" dangerouslySetInnerHTML={{ __html: modules[module].info }}></Typography>
                <button onClick={() => handleDownload(module)} className={classes.button}>
                  GET DOCUMENT
                </button>
              </AccordionDetails>

            </Accordion>
          ))}
        </div>
        {/* <img
          src="/images/netra-logo-removebg.png"
          width={200}
          height={200}
          alt="Netra Logo"
        /> */}
      </div>
    </div>
  );
}

export default Help;
