import React from 'react';

const Employee = ({ employee }) => (
  <div className="employee">
    <h2>{employee.name}</h2>
    <p>Job role: {employee.role}</p>
    <p>Training history:</p>
    <ul>
      {employee.trainingHistory.map(course => (
        <li key={course.id}>{course.title} (completed: {course.completed ? 'Yes' : 'No'})</li>
      ))}
    </ul>
  </div>
);

export default Employee;
