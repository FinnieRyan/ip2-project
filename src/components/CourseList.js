import React from 'react';
import Course from './Course';
import styled from 'styled-components';

const CourseBox = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 15px;
  padding: 30px;
  border-radius: 5px;
  background-color: #e6f7ff;  /* light blue color */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5em 0.5em -0.4em #b3d1ff;  /* light blue shadow */
  }
`;

const CourseTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5em;
`;

const CourseDescription = styled.p`
  margin-bottom: 10px;
  color: #666;
  font-size: 1.2em;
`;

const CourseProvider = styled.p`
  font-weight: bold;
  color: #333;
  font-size: 1.2em;
`;

const CourseList = ({ courses }) => {
  return (
    <div>
      {courses.map((course, index) => (
        <CourseBox key={index}>
          <CourseTitle>{course.name}</CourseTitle>
          <CourseDescription>{course.description}</CourseDescription>
          <CourseProvider>Provider: {course.provider}</CourseProvider>
        </CourseBox>
      ))}
    </div>
  );
};

export default CourseList;
