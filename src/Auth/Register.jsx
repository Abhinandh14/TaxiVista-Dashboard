import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme(); // Access darkMode state and toggleDarkMode function from ThemeProvider
  const navigate = useNavigate();

  useEffect(() => {
    setError(null); // Reset error on input change
  }, [email, password, confirmPassword]);

  const registerWithEmailAndPasswordHandler = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful");
      // You can add any additional logic here, such as redirecting the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: darkMode ? "#333" : "transparent", // Apply dark background if dark mode is enabled
        color: darkMode ? "#fff" : "#000", // Apply light text color if dark mode is enabled
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "16px",
          boxShadow: 1,
          borderRadius: "8px",
          backgroundColor: darkMode ? "#222" : "#fff", // Apply dark background if dark mode is enabled
        }}
      >
        <Typography variant="h4" sx={{ color: darkMode ? "#fff" : "#000" }}>
          Register
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ marginTop: "8px", color: darkMode ? "#ff5252" : "#f44336" }} // Apply error color based on the theme
          >
            {error}
          </Typography>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form from submitting
            registerWithEmailAndPasswordHandler();
          }}
          style={{ width: "100%", marginTop: "16px" }}
        >
          <TextField
            label="Email address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              bgcolor: darkMode ? "#444" : "#fff", // Apply dark background if dark mode is enabled
              color: darkMode ? "#fff" : "#000", // Apply light text color if dark mode is enabled
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              bgcolor: darkMode ? "#444" : "#fff", // Apply dark background if dark mode is enabled
              color: darkMode ? "#fff" : "#000", // Apply light text color if dark mode is enabled
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              bgcolor: darkMode ? "#444" : "#fff", // Apply dark background if dark mode is enabled
              color: darkMode ? "#fff" : "#000", // Apply light text color if dark mode is enabled
            }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: "16px" }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <Box sx={{ marginTop: "16px", textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" color="primary">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Dark Theme Toggle Button */}
      <Button
        onClick={toggleDarkMode}
        sx={{ position: "fixed", bottom: "16px", right: "16px" }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
    </Container>
  );
};

export default Register;