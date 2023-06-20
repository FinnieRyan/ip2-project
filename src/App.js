// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeDashboard from './containers/EmployeeDashboard';
import ManagerDashboard from './containers/ManagerDashboard';
import LoginContainer from './containers/LoginContainer';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginContainer />} />
        <Route element={<MainLayout />}>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

