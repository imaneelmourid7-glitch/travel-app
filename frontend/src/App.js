import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VoyagesOrganises from './pages/VoyagesOrganises';
import VoyageForm from './pages/VoyageForm';
import TripDetails from './pages/TripDetails';
import Admin from './pages/Admin';
import AdminVoyageForm from './pages/AdminVoyageForm';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/voyages/nouveau" 
          element={isAuthenticated ? <VoyageForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/voyages/:id" 
          element={isAuthenticated ? <TripDetails /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route 
  path="/voyages-organises" 
  element={isAuthenticated ? <VoyagesOrganises /> : <Navigate to="/login" />} 
/>
<Route
  path="/admin/voyages/nouveau"
  element={isAuthenticated ? <AdminVoyageForm /> : <Navigate to="/login" />}
/>
<Route
  path="/admin/voyages/modifier/:id"
  element={isAuthenticated ? <AdminVoyageForm /> : <Navigate to="/login" />}
/>
      </Routes>
    </Router>
  );
}

export default App;
