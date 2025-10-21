import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

const PasswordField = ({ value, onChange, editMode }) => {
  console.log("editMode", editMode);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {editMode ? (
        <TextField value={value} onChange={onChange} variant="outlined" />
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1">
            {showPassword ? value : "*".repeat(value.length)}
          </Typography>
          <IconButton onClick={handleTogglePasswordVisibility}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </div>
      )}
    </div>
  );
};

const ManageUsers = ({ users }) => {
  const [userList, setUserList] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  const filteredUserList = userList.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUser({ ...user });
  };

  const handleSaveUser = () => {
    if (editedUser) {
      fetch("/api/update_user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const updatedUserList = userList.map((user) =>
            user.id === editedUser.id ? editedUser : user
          );
          setUserList(updatedUserList);
          setEditingUser(null);
          setEditedUser(null);
          setSelectedRow(null);
        })
        .catch((error) => console.error("Error updating user:", error));
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedRow(user.id);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    fetch("/api/delete_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedRow),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (selectedRow !== null) {
      const updatedUserList = userList.filter(
        (user) => user.id !== selectedRow
      );
      setUserList(updatedUserList);
    }

    setDeleteConfirmationOpen(false);
  };

  const levels = ["L1", "L2", "L3", "L4", "L5"];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest("tr") === null && editingUser !== null) {
        setEditingUser(null);
        setEditedUser(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [editingUser]);

  return (
    <Container>
      <Typography variant="h4" style={{ margin: "20px" }}>
        Manage Users
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {levels.map((level, index) => (
          <Card key={index} style={{ margin: "10px", minWidth: "150px" }}>
            <CardContent>
              <Typography variant="h6">
                {level === "L1" && "Ship HoD"}
                {level === "L2" && "Ship CO"}
                {level === "L3" && "Fleet/ Command HQ"}
                {level === "L4" && "NHQ"}
                {level === "L5" && "Admin/ INSMA"}
              </Typography>
              <Typography variant="h4">
                {filteredUserList.filter((user) => user.level === level).length}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <TextField
        label="Search by Username"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: "20px" }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUserList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {editingUser && editingUser.id === user.id ? (
                  <TextField
                    value={editedUser.username}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        username: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                ) : (
                  user.username
                )}
              </TableCell>
              <TableCell>
                {editingUser && editingUser.id === user.id ? (
                  <PasswordField
                    value={editedUser.password}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        password: e.target.value,
                      })
                    }
                    editMode={editingUser} // Pass the inverse of edit mode
                  />
                ) : (
                  <PasswordField value={user.password} editMode={false} />
                )}
              </TableCell>
              <TableCell>
                {editingUser && editingUser.id === user.id ? (
                  <TextField
                    value={editedUser.level}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
                        level: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                ) : (
                  user.level
                )}
              </TableCell>
              <TableCell>
                {editingUser && editingUser.id === user.id ? (
                  <>
                    <Button onClick={handleSaveUser}>Save</Button>
                    <Button onClick={handleDeleteUser}>Delete</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEditUser(user)}>Edit</Button>
                    <Button onClick={() => handleDeleteUser(user)}>
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmationOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageUsers;