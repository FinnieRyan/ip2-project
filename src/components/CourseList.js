import styled from 'styled-components';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CourseBox = styled.div`
  border: 1px solid #b3d1ff;
  margin-bottom: 15px;
  padding: 30px;
  border-radius: 5px;
  background-color: #cce4ff;  /* slightly deeper blue color */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5em 0.5em -0.4em #99ccff;  /* deeper blue shadow */
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

const CourseList = ({ courses }) => {
  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('myToken');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedEmployeeEnrolledCourses, setSelectedEmployeeEnrolledCourses] = useState([]);

  const fetchEmployees = async () => {
    try {
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

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employee/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrolledCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchEnrollmentsForSelectedEmployee = async () => {
    if (!selectedEmployee) return; // Make sure we have a selected employee

    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${selectedEmployee}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedEmployeeEnrolledCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses for selected employee:', error);
    }
  };

  useEffect(() => {
    if (user.role === 'manager') {
      fetchEmployees();
    }
    if (user.role === 'employee') {
      fetchEnrollments();
    }
    if (user.role === 'manager'){
      fetchEnrollmentsForSelectedEmployee();
    }
  }, [selectedEmployee, token, user.role]);

  const handleChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const enrollCourse = async (courseId) => {
    try {
      const course = courses.find(course => course._id === courseId);
      const response = await axios.put('http://localhost:5000/enroll', { courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setEnrolledCourses([...enrolledCourses, course]);
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
        setEnrolledCourses(enrolledCourses.filter(course => course._id !== courseId));
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
      const course = courses.find(course => course._id === courseId);
      const response = await axios.put('http://localhost:5000/manager/enroll', { employeeId, courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchEnrollmentsForSelectedEmployee();
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
        fetchEnrollmentsForSelectedEmployee();
        alert('Successfully unenrolled employee from course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error unenrolling employee from course:', error);
    }
  };

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

      {courses && courses.map((course, index) => {
        return (
          <CourseBox key={index}>
            <CourseTitle>{course.name}</CourseTitle>
            <CourseDescription>{course.description}</CourseDescription>
            <CourseProvider>Provider: {course.provider}</CourseProvider>
            {enrolledCourses.some(enrolledCourse => enrolledCourse._id === course._id) ? (
              <EnrollButton disabled>Enrolled</EnrollButton>
            ) : (
              <EnrollButton onClick={() => enrollCourse(course._id)}>Enroll</EnrollButton>
            )}
            <UnenrollButton onClick={() => unenrollCourse(course._id)}>Unenroll</UnenrollButton>
            {selectedEmployee && (
              <>
                {selectedEmployeeEnrolledCourses.some(enrolledCourse => enrolledCourse === course._id) ? (
                  <EnrollButton disabled>Employee Enrolled</EnrollButton>
                ) : (
                  <EnrollButton onClick={() => managerEnrollEmployee(selectedEmployee, course._id)}>Manager Enroll</EnrollButton>
                )}
                <UnenrollButton onClick={() => managerUnenrollEmployee(selectedEmployee, course._id)}>Manager Unenroll</UnenrollButton>
              </>
            )}
          </CourseBox>
        );
      })}
    </div>
  );
};

export default CourseList;
