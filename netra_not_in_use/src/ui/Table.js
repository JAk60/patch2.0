import * as React from "react";
import { DataGrid, getThemePaletteMode } from "@material-ui/data-grid";
import { makeStyles, withTheme } from "@material-ui/core";
import { createMuiTheme, darken, lighten } from "@material-ui/core/styles";

// const useStyles = makeStyles({
//   root: {
//     "& .MuiDataGrid-columnsContainer": {
//       background: "rgb(32,64,140)",
//       color: "white",
//     },
//   },
// });

const columns = [
  { field: "id", headerName: "ID", flex: 0.1 },
  { field: "firstName", headerName: "First name", flex: 0.2 },
  { field: "lastName", headerName: "Last name", flex: 0.2 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    flex: 0.2,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 0.3,
    valueGetter: (params) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

// const DataGridDemo = (props) => {
//   let useClass = useStyles();
//   return (
//     <div style={{ height: "96%", width: "96%" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         classes={{ root: useClass.root }}
//         checkboxSelection
//         labelRowsPerPage=""
//       />
//     </div>
//   );
// };

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
  (theme) => {
    const getBackgroundColor = (color) =>
      getThemePaletteMode(theme.palette) === "dark"
        ? darken(color, 0.6)
        : lighten(color, 0.6);

    const getHoverBackgroundColor = (color) =>
      getThemePaletteMode(theme.palette) === "dark"
        ? darken(color, 0.5)
        : lighten(color, 0.5);

    return {
      root: {
        "& .super-app-theme--Open": {
          backgroundColor: getBackgroundColor(theme.palette.info.main),
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(theme.palette.info.main),
          },
        },
        "& .super-app-theme--Filled": {
          backgroundColor: getBackgroundColor(theme.palette.success.main),
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(
              theme.palette.success.main
            ),
          },
        },
        "& .super-app-theme--PartiallyFilled": {
          backgroundColor: getBackgroundColor(theme.palette.warning.main),
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(
              theme.palette.warning.main
            ),
          },
        },
        "& .super-app-theme--Rejected": {
          backgroundColor: getBackgroundColor(theme.palette.error.main),
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
          },
        },
      },
    };
  },
  { defaultTheme }
);

const DataGridDemo = (props) => {
  const classes = useStyles();

  return (
    <div style={{ height: 400, width: "100%" }} className={classes.root}>
      <DataGrid
        rows={rows}
        checkboxSelection
        columns={columns}
        getRowClassName={(params) =>
          `super-app-theme--${params.getValue(params.id, "status")}`
        }
      />
    </div>
  );
};

export default DataGridDemo;
