import React, { useEffect, useState, useCallback } from 'react';
import CourseList from '../components/CourseList';
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
  const [courses, setCourses] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState([]);
  const [isEmployeeDataFetched, setIsEmployeeDataFetched] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');
  
  const onCoursesChange = (updatedCourses) => {
    setCourses(updatedCourses);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course', {
          headers: {
            Authorization: `Bearer ${token}`,
            departments: employeeInfo.department,
          },
        });
        const {data} = response;
        setCourses(data);
        
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };
    if (user && token && isEmployeeDataFetched) {
      fetchCourses();
    }
  }, [token, isEmployeeDataFetched, employeeInfo.department]);

  useEffect(() => {
    const fetchEmployeedata = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee', {
          headers : {
            Authorization: `Bearer ${token}`,
          },
        });
        const { data } = response;
        setEmployeeInfo(data);
        setIsEmployeeDataFetched(true); // This will trigger fetchCourses
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    if (user && token){
      fetchEmployeedata();
      
    }
  }, [token]);

  useEffect(() => {
    
  }, [courses]);

  if (!user || !token || !isEmployeeDataFetched) {
    return <p>Loading...</p>;
  }

  return (
    <Background>
      <DashboardContainer>
        <Heading>Welcome, {employeeInfo.firstname}!</Heading>
        <RoleText>Job role: {user.role}</RoleText>
        <DepartmentText>Department: {employeeInfo.department}</DepartmentText>
        <Text>Here are all the courses currently in the system:</Text>
        {courses.length > 0 ? <CourseList courses={courses} setCourses={setCourses} onCoursesChange={onCoursesChange} /> : <p>Loading courses...</p>}
      </DashboardContainer>
    </Background>
  );
};

export default EmployeeDashboard;