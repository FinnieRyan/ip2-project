import React, { useState, useEffect } from 'react';
import Employee from '../components/Employee';

const EmployeesContainer = () => {
  const [employees, setEmployees] = useState([]);

  // useEffect with an empty dependencies array behaves like componentDidMount
  useEffect(() => {
    // Fetch the employees from the server and update the state
  }, []);

  return employees.map(employee => (
    <Employee key={employee.id} employee={employee} />
  ));
};

export default EmployeesContainer;

