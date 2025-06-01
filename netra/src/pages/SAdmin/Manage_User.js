import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import CustomizedSnackbars from "../../ui/CustomSnackBar";

const useStyles = makeStyles({
  root: {
    margin: "0 2.5em",
  },
  tabs: {
    marginTop: "1rem",
  },
  autocomplete: {
    margin: "1rem",
    minWidth: 250,
  },
  deleteButton: {
    margin: "1rem",
  },
});

export default function ManageUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [userData, setUserData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteUserIdToDelete, setDeleteUserIdToDelete] = useState(null);
  const [SnackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "",
    showSnackBar: false,
  });

  const onHandleSnackClose = () => {
    setSnackBarMessage({
      severity: "error",
      message: "",
      showSnackBar: false,
    });
  };

  const AccountTypes = [
    "Developer Mode",
    "Ship HoD",
    "Ship Co",
    "Fleet/ Command HQ",
    "NHQ",
    "Admin/ INSMA",
    "Handheld",
  ];
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword !== values.confirmPassword) {
        setPasswordsMatchError(true);
        return;
      }

      const data = {
        userId: selectedUserId,
        user: selectedUser,
        newPassword: values.newPassword,
      };

      fetch("/update_user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.code === 200) {
            setSnackBarMessage({
              severity: "success",
              message: data.message,
              showSnackBar: true,
            });
          } else if (data.code !== 200) {
            setSnackBarMessage({
              severity: "error",
              message: data.message,
              showSnackBar: true,
            });
          }
        })
        .catch((error) => console.error("Error updating user:", error));

      setOpenDialog(false);
      setPasswordsMatchError(false); // Reset the password match error state
      formik.resetForm(); // Reset the Formik form values
    },
  });

  const handleAutocompleteChange = (event, value) => {
    setSelectedAccountType(value);
    switch (value) {
      case "Developer Mode":
        setSelectedLevel("L0");
        break;
      case "Ship HoD":
        setSelectedLevel("L1");
        break;
      case "Ship Co":
        setSelectedLevel("L2");
        break;
      case "Fleet/ Command HQ":
        setSelectedLevel("L3");
        break;
      case "NHQ":
        setSelectedLevel("L4");
        break;
      case "Admin/ INSMA":
        setSelectedLevel("L5");
        break;
      case "Handheld":
        setSelectedLevel("L6");
        break;
      default:
        setSelectedLevel("");
    }
  };

  const handleFormSubmit = async () => {
    fetch("/get_users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedLevel }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setSnackBarMessage({
            severity: "success",
            message: data.message,
            showSnackBar: true,
          });
          setUserData(data.users);
        } else if (data.code === 404 || 500) {
          setSnackBarMessage({
            severity: "error",
            message: data.message,
            showSnackBar: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const filteredUsers = userData.filter(
    (user) => user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (user) => {
    setDeleteUserIdToDelete(user.id);
    setSelectedUser(user.username)
    setDeleteConfirmationDialogOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (deleteUserIdToDelete) {
      const user = userData.find((u) => u.id === deleteUserIdToDelete);

      fetch("/delete_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.code === 200) {
            setSnackBarMessage({
              severity: "success",
              message: data.message,
              showSnackBar: true,
            });
          } else if (data.code === 404 || 500) {
            setSnackBarMessage({
              severity: "error",
              message: data.message,
              showSnackBar: true,
            });
          }
          const updatedUserList = userData.filter((u) => u.id !== deleteUserIdToDelete);
          setUserData(updatedUserList);
        })
        .catch((error) => {
          console.error("Error:", error);
          setSnackBarMessage({
            severity: "error",
            message: error,
            showSnackBar: true,
          });
        });

      setDeleteUserIdToDelete(null);
      setDeleteConfirmationDialogOpen(false);
    }
  };

  const handleDeleteConfirmationCancel = () => {
    setDeleteUserIdToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user?.username);
    setSelectedUserId(user.id);
    setPasswordsMatchError(false); // Reset the password match error state
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPasswordsMatchError(false); // Reset the password match error state
    formik.resetForm(); // Reset the Formik form values
  };

  return (
    <>
      <Container>
        <Typography variant="h4" style={{ margin: "20px" }}>
          Manage Users
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Autocomplete
            className={classes.autocomplete}
            options={AccountTypes}
            getOptionLabel={(option) => option}
            value={selectedAccountType}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField {...params} label="Account Type" variant="outlined" />
            )}
          />
          <Button
            className={classes.deleteButton}
            variant="contained"
            color="secondary"
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </div>
        <TextField
          label="Search by Username"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginTop: "20px" }}
        />

        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell></TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteUser(user)}
                      variant="contained"
                      color="secondary"
                      style={{ margin: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleOpenDialog(user)}
                      variant="contained"
                      color="secondary"
                    >
                      Change Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmationDialogOpen} onClose={handleDeleteConfirmationCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Are you sure you want to delete {selectedUser} user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmationCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirmation} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Username: {selectedUser}</Typography>
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={passwordsMatchError}
              helperText={passwordsMatchError && "Passwords do not match"}
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={passwordsMatchError}
              helperText={passwordsMatchError && "Passwords do not match"}
              style={{ marginTop: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={formik.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      {SnackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={SnackBarMessage}
          onHandleClose={onHandleSnackClose}
        />
      )}
    </>
  );
}
