import React, { useState, useEffect } from 'react';
import CourseList from '../components/CourseList';

const CourseContainer = () => {
  const [courses, setCourses] = useState([]);

  // useEffect with an empty dependencies array behaves like componentDidMount
  useEffect(() => {
    // Fetch the courses from the server and update the state
  }, []);

  return (
    <><CourseList courses={courses} /><div>
      <h1>Hello</h1>
    </div></>
  );
};

export default CourseContainer;

