import React, { useState, useEffect } from 'react';
import AddRemoveCoursesForm from '../components/AddRemovesCoursesform';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`;
const Title = styled.h1`
  animation: ${slideInFromLeft} 2s both;
`;


const AddRemoveCourses = () => {
  const [courses, setCourses] = useState([]);
  //Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  //Retrieve the users token form local storage 
  const token = localStorage.getItem('myToken');
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course' , {
        headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
       <Title>Add or Remove Courses</Title>
      <AddRemoveCoursesForm courses={courses} />
    </div>
  );
};

export default AddRemoveCourses;

