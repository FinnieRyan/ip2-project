import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseList from './CourseList';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 2.5em;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1.5em;
`;



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

  // If user or user or token is not present, show loading message
  if (!user || !token) {
    return <p>Loading...</p>;
  }

  // Render manager dashboard UI
  return (
    <DashboardContainer>
      <Heading>Welcome, {managerInfo.firstname}!</Heading>
      <Text>Job role: {user.role}</Text>
      <Text>Department: {managerInfo.department}</Text>
      <Text>Here are all the courses currently in the system:</Text>
      <CourseList courses={courses} />
    </DashboardContainer>
  );
};

export default ManagerDashboard;
