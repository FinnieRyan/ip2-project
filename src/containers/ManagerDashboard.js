import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseList from '../components/CourseList';
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
const DashboardContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  opacity: 0;
  animation: ${slideInFromLeft} 2s both;
  background-color: #e0f0ff;
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 2.8em;
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const Text = styled.p`
  color: #333;
  line-height: 1.6;
  font-size: 1.5em;
  font-weight: 300;
  margin-bottom: 20px;
`;

const RoleText = styled(Text)`
  color: #333;
  font-weight: 500;
`;

const DepartmentText = styled(Text)`
  color: #333;
  font-weight: 500;
`;
const Background = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
`;

const ManagerDashboard = () => {
  // Declare state variable courses and its setter function
  const [courses, setCourses] = useState([]);
  const [managerInfo, setManagerInfo] = useState([]);

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');

  useEffect(() => {
    // Function to fetch courses data
    const fetchCourses = async () => {
      try {
        // Check if user exists and has a token
        if (user && token) {
          await fetchManagersdata();

          const response = await axios.get('http://localhost:5000/api/course', {
            headers: {
              Authorization: `Bearer ${token}`, //put the token in the header
              departments: managerInfo.department,
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
  }, [token, managerInfo.department]);

  // If user or user or token is not present, show loading message
  if (!user || !token) {
    return <p>Loading...</p>;
  }

  // Render manager dashboard UI
  return (
    <Background>
    <DashboardContainer>
      <Heading>Welcome, {managerInfo.firstname}!</Heading>
      <RoleText>Job role: {user.role}</RoleText>
      <DepartmentText>Department: {managerInfo.department}</DepartmentText>
      <Text>Here are all the courses currently in the system:</Text>
      <CourseList courses={courses} />
    </DashboardContainer>
  </Background>
  );
};

export default ManagerDashboard;
