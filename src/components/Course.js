import React from 'react';

const Course = ({ course }) => (
  <div className="course">
    <h2>{course.name}</h2>
    <p>{course.description}</p>
    <p>Provider: {course.provider}</p>
  </div>
);

export default Course;
