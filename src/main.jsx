import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';





import { BrowserRouter, Routes, Route } from "react-router-dom";
import EssentialsList from "./pages/EssentialsList";
import AddEssential from "./pages/AddEssential";
import EditEssential from './pages/EditEssential';
import Sidebar from "./components/Sidebar";

import "./styles/index.css"; // Ensure this file exists for global styles

//


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/side" element={<Sidebar />} />
        <Route path="/list-essential" element={<EssentialsList />} />
        <Route path="/add-essential" element={<AddEssential />} />
        <Route path="/edit-essential/:id" element={<EditEssential />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
