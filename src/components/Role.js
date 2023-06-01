import React from 'react';

const Role = ({ role }) => (
  <div className="role">
    <h2>{role.name}</h2>
    <p>Eligible Courses:</p>
    <ul>
      {role.eligibleCourses.map(course => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  </div>
);

export default Role;
