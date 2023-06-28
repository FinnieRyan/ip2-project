import React, { useState, useEffect } from 'react';
import AddRemoveCoursesForm from '../components/AddRemovesCoursesform';
import axios from 'axios';


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
      <h1>Add or Remove Courses</h1>
      <AddRemoveCoursesForm courses={courses} />
    </div>
  );
};

export default AddRemoveCourses;

