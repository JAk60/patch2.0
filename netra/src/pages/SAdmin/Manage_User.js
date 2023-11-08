import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const PasswordField = ({ value }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1">
        {showPassword ? value : "*".repeat(value.length)}
      </Typography>
      <IconButton onClick={handleTogglePasswordVisibility}>
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </div>
  );
};



const ManageUsers = ({ usselect }) => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [SUser, setSUser] = useState(""); // New state for user with level 'S' as a string

  useEffect(() => {
    // Fetch user data from the backend and set it in the state
    // Example API call:
    fetch("/get_users")
      .then((response) => response.json())
      .then((data) => {
        // Find the user with level 'S' and set it as a string
        const sUser = data.find((user) => user.level === "S");
        if (sUser) {
          setSUser(JSON.stringify(sUser));
        }

        // Filter out users with level 'S' from the main list
        const filteredUsers = data.filter((user) => user.level !== "S");
        setUserList(filteredUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // For demonstration purposes, using placeholder data
  }, []);

  const filteredUserList = userList.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levels = ["L1", "L2", "L3", "L4", "L5"];

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUser({ ...user });
  };

  const handleSaveUser = () => {
    if (editedUser) {
      fetch("/update_user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log the response from the server
          const updatedUserList = userList.map((user) =>
            user.id === editedUser.id ? editedUser : user
          );
          setUserList(updatedUserList);
          setEditingUser(null);
          setEditedUser(null); // Reset edited user data
          setSelectedRow(null); // Reset selected row
        })
        .catch((error) => console.error("Error updating user:", error));
    }
  };

  const handleRowDoubleClick = (user) => {
    setSelectedRow(user.id);
  };

  const handleDeleteUser = () => {
    fetch("/delete_user", {
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
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest("tr") === null && editingUser !== null) {
        setEditingUser(null);
        setEditedUser(null); // Reset edited user data
      } else if (selectedRow !== null) {
        setSelectedRow(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [editingUser, selectedRow]);

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

      {/* Search Bar */}
      <TextField
        label="Search by Username"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: "20px" }}
      />

      {/* User Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUserList.map((user) => (
            <TableRow
              key={user.id}
              onDoubleClick={() => handleRowDoubleClick(user)}
            >
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
                  />
                ) : (
                  <PasswordField value={user.password} />
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
                  <Button onClick={handleSaveUser}>Save</Button>
                ) : (
                  <Button onClick={() => handleEditUser(user)}>Edit</Button>
                )}
                {selectedRow === user.id && (
                  <Button onClick={handleDeleteUser}>Delete</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default ManageUsers;
