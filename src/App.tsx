import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import ComplaintForm from './pages/ComplaintForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { ComplaintProvider } from './context/ComplaintContext';

function App() {
  return (
    <ComplaintProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/complaint/:wardId" element={<ComplaintForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ComplaintProvider>
  );
}

export default App;