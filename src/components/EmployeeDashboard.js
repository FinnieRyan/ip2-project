import React, { useEffect, useState } from 'react';
import CourseList from './CourseList';
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
const DashboardContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f5f5f5;
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




const EmployeeDashboard = () => { 
  //Declare state variable courses and its setter
  const [courses, setCourses] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState([]);

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');
  //console.log(token);
  

  useEffect(() => {
    //fecthing the course data
    const fetchCourses = async () => {
      try {
        //check if the user has a valid token
        if (user && token) {
           await fetchEmployeedata();
          
          //console.log('Employee Info:', employeeInfo);
          //console.log('Departments:', employeeInfo.department);
          const response = await axios.get('http://localhost:5000/api/course', {
            headers: {
              Authorization: `Bearer ${token}`, //put the token in the header
              departments: employeeInfo.department,
            },
          });
          
          const {data} = response;
          //console.log('Fetched Courses:', data);
          setCourses(data) // update the state of the courses with the fetched data from the database
        }
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };

    const fetchEmployeedata = async () => {
      try {
          //console.log(user);
          if (user && token){
            const response = await axios.get('http://localhost:5000/api/employee', {
              headers : {
                Authorization: `Bearer ${token}`,
              },
              });
              
              const { data } = response;
              setEmployeeInfo(data);
            }
          } catch (error) {
            console.error('Error fetching employee data:', error);
          }
      };
  
      
    // Trigger the fetchCourses function function when the token changes 
    if (user && token) {
      fetchCourses();
      fetchEmployeedata();
    }
  }, [token,employeeInfo.department]);

  // If the user ot token are not present they will be presneted with a loading... page
  if (!user && !token) {
    return <p>Loading...</p>;
  }
  
  //render UI 
  return (
    <Background>
    <DashboardContainer>
      <Heading>Welcome, {employeeInfo.firstname}!</Heading>
      <RoleText>Job role: {user.role}</RoleText>
      <DepartmentText>Department: {employeeInfo.department}</DepartmentText>
      <Text>Here are all the courses currently in the system:</Text>
      <CourseList courses={courses} />
    </DashboardContainer>
    </Background>
  );
};

export default EmployeeDashboard;
