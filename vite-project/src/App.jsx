
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddMedicine from "./pages/AddMedicine";
import Caregiver from "./pages/Caregiver";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Alerts from "./pages/Alerts";
import Notifications from "./pages/Notifications";


function App() {
  return (
    <BrowserRouter>
    

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addmedicine" element={<AddMedicine />} />
        <Route path="/caregiver" element={<Caregiver />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;