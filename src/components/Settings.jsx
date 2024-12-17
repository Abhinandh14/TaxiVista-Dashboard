import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const Settings = () => {
  // Initialize state values using local storage or default values
  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    const storedValue = localStorage.getItem("notificationEnabled");
    return storedValue ? JSON.parse(storedValue) : true; // Default to true if not found
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"; // Default to 'light' if not found
  });

  // Function to handle saving settings
  const saveSettings = () => {
    // Save settings to local storage
    localStorage.setItem(
      "notificationEnabled",
      JSON.stringify(notificationEnabled)
    );
    localStorage.setItem("theme", theme);
    console.log("Settings saved!");
    // Apply dark mode styles if theme is set to 'dark'
    if (theme === "dark") {
      applyDarkModeStyles();
    }
  };

  // Effect hook to run once when the component mounts
  useEffect(() => {
    // Apply dark mode styles if theme is set to 'dark' when component mounts
    if (theme === "dark") {
      applyDarkModeStyles();
    }
  }, []);

  // Function to apply dark mode styles
  const applyDarkModeStyles = () => {
    // Example: Set body background color to black and text color to white
    document.body.style.backgroundColor = "#222";
    document.body.style.color = "#fff";
  };

  // Toggle dark mode styles when the theme changes
  useEffect(() => {
    if (theme === "dark") {
      applyDarkModeStyles();
    } else {
      // Remove dark mode styles
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }
  }, [theme]);

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Notification Settings</CardTitle>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={notificationEnabled}
                onChange={() => setNotificationEnabled(!notificationEnabled)}
              />{" "}
              Enable Notifications
            </Label>
          </FormGroup>
        </CardBody>
      </Card>

      <Card className="mt-3">
        <CardBody>
          <CardTitle tag="h5">Theme Settings</CardTitle>
          <FormGroup>
            <Label for="themeSelect">Select Theme:</Label>
            <Input
              type="select"
              name="theme"
              id="themeSelect"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Input>
          </FormGroup>
        </CardBody>
      </Card>

      <Button className="mt-3" color="primary" onClick={saveSettings}>
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;
