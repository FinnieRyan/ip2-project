import Course from './Course';
import styled from 'styled-components';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CourseBox = styled.div`
  border: 1px solid #ddd;
  margin-bottom: 15px;
  padding: 30px;
  border-radius: 5px;
  background-color: #e6f7ff;  /* light blue color */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5em 0.5em -0.4em #b3d1ff;  /* light blue shadow */
  }
`;

const CourseTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5em;
`;

const CourseDescription = styled.p`
  margin-bottom: 10px;
  color: #666;
  font-size: 1.2em;
`;

const CourseProvider = styled.p`
  font-weight: bold;
  color: #333;
  font-size: 1.2em;
`;
const EnrollButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
const UnenrollButton = styled(EnrollButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const StyledSelect = styled.select`
  margin: 20px 0;
  width: 100%;
  height: 35px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const CourseList = ({ courses  }) => {
   // Retrieve user data from local storage
   const user = JSON.parse(localStorage.getItem('user'));
   const token = localStorage.getItem('myToken');
   const [selectedEmployee, setSelectedEmployee] = useState('');
   const [employees, setEmployees] = useState([]);
   //console.log(token);

   useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('myToken');
        const response = await axios.get('http://localhost:5000/api/all/employees', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const employeesData = response.data;
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

   const handleChange = (e) => {
    setSelectedEmployee(e.target.value);
   }

  const enrollCourse = async (courseId) => {
    try {
      const response = await axios.put('http://localhost:5000/enroll', { courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Successfully enrolled in course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const unenrollCourse = async (courseId) => {
    try {
      const response = await axios.put('http://localhost:5000/unenroll', { courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Successfully unenrolled from course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
    }
  };
  const managerEnrollEmployee = async (employeeId, courseId) => {
    try {
      const response = await axios.put('http://localhost:5000/manager/enroll', { employeeId, courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Successfully enrolled employee in course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error enrolling employee in course:', error);
    }
  };

  const managerUnenrollEmployee = async (employeeId, courseId) => {
    try {
      const response = await axios.put('http://localhost:5000/manager/unenroll', { employeeId, courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Successfully unenrolled employee from course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error unenrolling employee from course:', error);
    }
  };
  
  console.log(employees);
  return (
    <div>
      {user.role === 'manager' && (
        <StyledSelect value={selectedEmployee} onChange={handleChange}>
          <option value="">Select an employee</option>
          {employees && employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.firstname}
            </option>
          ))}
        </StyledSelect>
      )}
      
      {courses && courses.map((course, index) => (
        <CourseBox key={index}>
          <CourseTitle>{course.name}</CourseTitle>
          <CourseDescription>{course.description}</CourseDescription>
          <CourseProvider>Provider: {course.provider}</CourseProvider>
          <EnrollButton onClick={() => enrollCourse(course._id)}>Enroll</EnrollButton>
          <UnenrollButton onClick={() => unenrollCourse(course._id)}>Unenroll</UnenrollButton>
          {selectedEmployee && (
            <>
              <EnrollButton onClick={() => managerEnrollEmployee(selectedEmployee, course._id)}>Manager Enroll</EnrollButton>
              <UnenrollButton onClick={() => managerUnenrollEmployee(selectedEmployee, course._id)}>Manager Unenroll</UnenrollButton>
            </>
          )}
        </CourseBox>
      ))}
    </div>
  );
};


export default CourseList;
