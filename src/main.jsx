import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import EssentialsList from "./pages/EssentialsList";
import AddEssential from "./pages/AddEssential";

import "./styles/index.css"; // Ensure this file exists for global styles




createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EssentialsList />} />
        <Route path="/add-essential" element={<AddEssential />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
