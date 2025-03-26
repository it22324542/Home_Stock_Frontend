import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";


import Navbar from "./components/Navbar";
//import Footer from "./components/Footer";
import "./styles/global.css";
import Dashboard from "./components/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap-setup';




import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import Profile from "./components/Profile";
import "./styles/Pricing.css";
import Sidebar from "./components/Sidebar";

import ReportGeneration from "./pages/ReportGeneration";
import ActivityLog from "./pages/ActivityLog";





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Dashboard" element={<Dashboard />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/sidebar" element={<Sidebar />}/>
        <Route path="/ActivityLog" element={<ActivityLog />}/>
        <Route path="/ReportGeneration" element={<ReportGeneration />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

export default App;

