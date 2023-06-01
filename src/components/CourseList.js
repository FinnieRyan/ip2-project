import React from 'react';
import Course from './Course';


const CourseList = ({ courses }) => (
  <div className="course-list">
    {courses.map(course => <Course key={course._id} course={course} />)}
  </div>
);


export default CourseList;
