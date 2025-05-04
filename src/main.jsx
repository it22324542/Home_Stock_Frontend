import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap-setup';

//vishva
import "./styles/index.css";

//sanduni
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import ReportGeneration from "./pages/ReportGeneration";

//vishva
import EssentialsList from "./pages/EssentialsList";
import AddEssential from "./pages/AddEssential";
import EditEssential from './pages/EditEssential';


//sanduni
//import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Sidebar from "./components/Sidebar";








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
        <Route path="/ReportGeneration" element={<ReportGeneration />} />

        <Route path="/list-essential" element={<EssentialsList />} />
        <Route path="/add-essential" element={<AddEssential />} />
        <Route path="/edit-essential/:id" element={<EditEssential />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

export default App;

