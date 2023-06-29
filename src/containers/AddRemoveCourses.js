import React, { useState, useEffect } from 'react';
import AddRemoveCoursesForm from '../components/AddRemovesCoursesform';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const Background = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
`;



const AddRemoveCourses = () => {
  const [courses, setCourses] = useState([]);
  //Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  //Retrieve the users token form local storage 
  const token = localStorage.getItem('myToken');
  

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/course' , {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response.data);
      setCourses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Background>
      <AddRemoveCoursesForm courses={courses} fetchCourses={fetchCourses} />
    </Background>
  );
};

export default AddRemoveCourses;

