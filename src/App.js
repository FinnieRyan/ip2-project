// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseContainer from './containers/CourseContainer';
import EmployeesContainer from './containers/EmployeesContainer';
import RolesContainer from './containers/RolesContainer';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import LoginContainer from './containers/LoginContainer';

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/courses" element={<CourseContainer />} />
          <Route path="/employees" element={<EmployeesContainer />} />
          <Route path="/roles" element={<RolesContainer />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/" element={<LoginContainer />} />
        </Routes>
      </Router>
    
  );
}

export default App;

