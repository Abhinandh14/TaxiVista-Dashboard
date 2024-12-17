import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Visualizations from "./components/Visualizations";
import BasicAnalysis from "./components/BasicAnalysis";
import ComplexAnalysis from "./components/ComplexAnalysis";
import Settings from "./components/Settings";
import { ThemeProvider } from "./components/ThemeProvider";
import { DataProvider } from "./Providers/DataContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <DataProvider>
      <ThemeProvider>
        <Router>
          <Header
            isAuthenticated={isAuthenticated}
            onLogout={() => setIsAuthenticated(false)}
          />

          <Routes>
            <Route
              path="/"
              element={<Home isAuthenticated={isAuthenticated} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<Login onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route path="/graphs" element={<Visualizations />} />
            <Route path="/analysis/basic" element={<BasicAnalysis />} />
            <Route path="/analysis/complex" element={<ComplexAnalysis />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>

          <Footer />
        </Router>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
