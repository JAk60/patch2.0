import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  header: {
    backgroundColor: "#1976d2",
    color: "white",
  },
  childHeader: {
    color: "white",
    fontSize: "20px",
  },
});

function CollapsibleTable({ tableData }) {
  console.log(tableData, "tableData");
  const classes = useRowStyles();
  const groupedRows = tableData.reduce((acc, row) => {
    const key = `${row.missionType}`;
    acc[key] = acc[key] || { parent: { ...row, open: false }, details: [] };
    if (row.ComponentMission === row.missionType) {
      acc[key].parent = { ...row, open: false };
    } else {
      acc[key].details.push({
        ...row,
        missionType: row.missionType,
        ComponentMission: row.ComponentMission,
      });
    }
    return acc;
  }, {});

  const [openRow, setOpenRow] = React.useState(null);

  const handleRowClick = (groupKey) => {
    setOpenRow((prevOpenRow) => (prevOpenRow === groupKey ? null : groupKey));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow className={classes.header}>
            <TableCell />
            {/* <TableCell className={classes.childHeader}>Ship Name</TableCell> */}
            {/* <TableCell className={classes.childHeader}>Task Name</TableCell> */}
            <TableCell className={classes.childHeader}>Mission Type</TableCell>
            {/* <TableCell className={classes.childHeader}>
              Component/Mission Type
            </TableCell> */}
            <TableCell className={classes.childHeader}>Reliability</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedRows).map((groupKey, index) => {
            const { parent, details } = groupedRows[groupKey];
            const isParentRow = details.length > 0;

            return (
              <React.Fragment key={index}>
                <TableRow className={classes.root}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(groupKey)}
                    >
                      {isParentRow && openRow === groupKey ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  {/* <TableCell component="th" scope="row">
                    {parent.shipName}
                  </TableCell> */}
                  {/* <TableCell>{parent.taskName.replace(/_Netra$/, '')}</TableCell> */}
                  <TableCell>{parent.missionType}</TableCell>
                  {/* <TableCell>{parent.ComponentMission}</TableCell> */}
                  <TableCell>{parent.rel}</TableCell>
                </TableRow>
                {isParentRow && openRow === groupKey && (
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openRow === groupKey}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          {/* <Typography variant="h6" gutterBottom component="div">
                            Details
                          </Typography> */}
                          <Table size="small" aria-label="child-table">
                            <TableHead className={classes.header}>
                              <TableRow>
                                <TableCell className={classes.childHeader}>
                                  Ship Name
                                </TableCell>
                                <TableCell className={classes.childHeader}>
                                  Task Name
                                </TableCell>
                                <TableCell className={classes.childHeader}>
                                  Mission Type
                                </TableCell>
                                <TableCell className={classes.childHeader}>
                                  Component/Mission Type
                                </TableCell>
                                <TableCell className={classes.childHeader}>
                                  Reliability
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {details.map((detail, detailIndex) => (
                                <TableRow key={detailIndex}>
                                  <TableCell>{detail.shipName}</TableCell>
                                  <TableCell>{detail.taskName.replace(/_Netra$/, '')}</TableCell>
                                  <TableCell>{detail.missionType}</TableCell>
                                  <TableCell>
                                    {detail.ComponentMission}
                                  </TableCell>
                                  <TableCell>{detail.rel}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CollapsibleTable;
