import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import styled, { keyframes } from 'styled-components';
import ErrorPage from './ErrorPage';

// Styled Components
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
  animation: ${slideInFromLeft} 0.5s both;
  background-color: #e0f0ff;
`;

const CourseBox = styled.div`
  border: 1px solid #b3d1ff;
  margin-bottom: 15px;
  padding: 30px;
  border-radius: 5px;
  background-color: #cce4ff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5em 0.5em -0.4em #99ccff;
  }
`;

const CourseTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5em;
`;

const CourseProvider = styled.p`
  font-weight: bold;
  color: #333;
  font-size: 1.2em;
`;

const CourseDescription = styled.p`
  margin-bottom: 10px;
  color: #666;
  font-size: 1.2em;
`;
const Background = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
`;

const TrainingHistory = () => {
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unauthorizedAccess, setUnauthorizedAccess] = useState(false);
   //Retrieve user data from local storage
   const user = JSON.parse(localStorage.getItem('user'));
   //Retrieve the users token form local storage 
   const token = localStorage.getItem('myToken');
   const decodedToken = jwtDecode(token);
   const employeeId = decodedToken.employeeId;

  const fetchEmployeeTrainingHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${employeeId}/courseRecords`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      setTrainingHistory(response.data);
    } catch (error) {
      console.error('Error fetching training history:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user.role === 'employee') {
      fetchEmployeeTrainingHistory();
    }
  }, [token, user.role, user.employeeId]);

  useEffect(() => {
    if (user && user.role !== 'employee') {
      setUnauthorizedAccess(true);
    }
  }, [user]);

  if (unauthorizedAccess) {
    return <ErrorPage />;
   } else {

  return (
    <Background>
      <DashboardContainer>
        {loading ? <CourseDescription>Loading...</CourseDescription> :
          trainingHistory.map((record, index) => (
            <CourseBox key={index}>
              <CourseTitle>
                {record.course ? record.course.name : "Course Deleted"} 
                {record.course && record.course.isDeleted ? " (Deleted)" : ""}
              </CourseTitle>
              {record.course && <CourseProvider>Provider: {record.course.provider}</CourseProvider>}
              {record.course && <CourseDescription>Description: {record.course.description}</CourseDescription>}
              <CourseDescription>Status: {record.status}</CourseDescription>
              <CourseDescription>Start date: {new Date(record.startDate).toLocaleDateString()}</CourseDescription>
              {record.endDate && <CourseDescription>End date: {new Date(record.endDate).toLocaleDateString()}</CourseDescription>}
              <CourseDescription>Achievement Level: {record.achievementLevel || 'N/A'}</CourseDescription>
            </CourseBox>
          ))
        }
      </DashboardContainer>
    </Background>
  );
 }
}
  
  export default TrainingHistory;
