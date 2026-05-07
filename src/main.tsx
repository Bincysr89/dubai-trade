import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import CustomerTypePage from './pages/CustomerTypePage';
import OtherAgentTypePage from './pages/OtherAgentTypePage';
import LandingPage from './pages/LandingPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customer-type" element={<CustomerTypePage />} />
        <Route path="/other-agent-type" element={<OtherAgentTypePage />} />
        <Route path="/landing/:agent" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
