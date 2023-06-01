import React, { useEffect, useState } from 'react';
import CourseList from './CourseList';
import axios from 'axios';



const EmployeeDashboard = () => { 
  //Declare state variable courses and its setter
  const [courses, setCourses] = useState([]);

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');
  console.log(token);

  useEffect(() => {
    //fecthing the course data
    const fetchCourses = async () => {
      try {
        console.log(user);

        //check if the user has a valid token
        if (user && token) {
          const response = await axios.get('http://localhost:5000/api/course', {
            headers: {
              Authorization: `Bearer ${token}`, //put the token in the header
            },
          });
          const {data} = response;
          setCourses(data) // update the state of the courses with the fetched data from the database
        }
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };
      
    // Trigger the fetchCourses function function when the token changes 
    if (user && token) {
      fetchCourses();
    }
  }, [token]);

  // If the user ot token are not present they will be presneted with a loading... page
  if (!user && !token) {
    return <p>Loading...</p>;
  }
  
  //render UI 
  return (
    <div className="employee-dashboard">
      <h2>Welcome, {user.username}!</h2>
      <p>Job role: {user.role}</p>
      <p>Here are some courses you might be interested in:</p>
      <CourseList courses={courses} />
    </div>
  );
};

export default EmployeeDashboard;
