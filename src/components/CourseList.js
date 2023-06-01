import React from 'react';
import Course from './Course';
import styled from 'styled-components';

const CourseBox = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const CourseTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const CourseDescription = styled.p`
  margin-bottom: 10px;
  color: #666;
`;

const CourseProvider = styled.p`
  font-weight: bold;
  color: #333;
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
