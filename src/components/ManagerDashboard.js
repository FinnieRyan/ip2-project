import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseList from './CourseList';



const ManagerDashboard = () => {
  // Declare state variable courses and its setter function
  const [courses, setCourses] = useState([]);
  const [managerInfo, setManagerInfo] = useState([]);

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');
  console.log(token);

  useEffect(() => {
    // Function to fetch courses data
    const fetchCourses = async () => {
      try {
        console.log(user);

        // Check if user exists and has a token
        if (user && token) {
          // Make an API call to fetch the courses data
          const response = await axios.get('http://localhost:5000/api/course', {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          });

          const { data } = response;
          setCourses(data); // Update courses state with the fetched data
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchManagersdata = async () => {
      try {
          console.log(user);
          if (user && token){
            const response = await axios.get('http://localhost:5000/api/manager', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const { data } = response;
            setManagerInfo(data);
          }
          } catch (error) {
            console.error('Error fetching manager data:', error);
          }
      };

    // Trigger the fetchCourses function when user or user.token changes
    if (user && token) {
      fetchCourses();
      fetchManagersdata();
    }
  }, [token]);

  // If user or user.token is not present, show loading message
  if (!user || !token) {
    return <p>Loading...</p>;
  }

  // Render manager dashboard UI
  return (
    <div className="manager-dashboard">
      <h2>Welcome, {managerInfo.firstname}!</h2>
      <p>Job role: {user.role}</p>
      <p>Department: {managerInfo.department}</p>
      <p>Here are all the courses currently in the system:</p>
      <CourseList courses={courses} />
    </div>
  );
};

export default ManagerDashboard;
