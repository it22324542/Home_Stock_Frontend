//new update essentials navigations


import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import './bootstrap-setup';
import "./styles/index.css";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import ReportGeneration from "./pages/ReportGeneration";
import EssentialsList from "./pages/EssentialsList";
import AddEssential from "./pages/AddEssential";
import EditEssential from './pages/EditEssential';

// Components
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Sideba from "./components/Sideba";

// Configure axios defaults
axios.defaults.timeout = 5000; // 5 seconds timeout
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      let retries = 3;
      while (retries > 0) {
        try {
          const response = await axios.get("/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data) {
            setIsAuthenticated(true);
            setError(null);
            break;
          }
        } catch (error) {
          console.error("Auth check attempt failed:", error);
          retries--;
          
          if (retries === 0) {
            setError("Failed to verify authentication. Please try again.");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        {/* Public Routes - No Sidebar or Navbar */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signin" element={
          !isAuthenticated ? (
            <SignIn setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />
        <Route path="/signup" element={
          !isAuthenticated ? (
            <SignUp />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />

        {/* Protected Routes - With Sidebar and Navbar */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <Dashboard />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
        <Route path="/profile/*" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <Profile />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
        <Route path="/essentials/list" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <EssentialsList />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
        <Route path="/essentials/add" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <AddEssential />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/essentials/list" replace />
          )
        } />
        <Route path="/essentials/edit/:id" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <EditEssential />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
        <Route path="/report" element={
          isAuthenticated ? (
            <div className="d-flex">
              <Sideba />
              <div className="d-flex flex-column flex-grow-1">
                <Navbar />
                <main className="flex-grow-1 p-3">
                  <ReportGeneration />
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

