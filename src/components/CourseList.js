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
  //Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  //Retrieve the users token form local storage 
  const token = localStorage.getItem('myToken');

  //These will hold the use state for the selected employee, enrolled courses etc...
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedEmployeeEnrolledCourses, setSelectedEmployeeEnrolledCourses] = useState([]);

  //fetch all employees for the manager using bearer token to authorize request 
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

  //fetch all the courses an employee has enrolled on if any...
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

  // fetch the enrollments of a selected employee by a manager 
  const fetchEnrollmentsForSelectedEmployee = async () => {
    if (!selectedEmployee) return; // Make sure there is a selected employee

    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${selectedEmployee}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedEmployeeEnrolledCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching enrolled courses for selected employee:', error);
    }
  };

  //use effect for different fecth requests which are unique to which ever type of employee is logged in.
  //when ever the selected employee token or user role changes this triggers a re-render 
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

  //Called when an employee is selected in the managers drop down window 
  const handleChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  //The function is called whenever the enroll button is clicked, passing the courseId parameter 
  const enrollCourse = async (courseId) => {
    try {
      //find the course in the courses array by finding the matching courseId
      const course = courses.find(course => course._id === courseId);
      //Call the put request using the matching courseId
      const response = await axios.put('http://localhost:5000/enroll', { courseId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        //Add the course to the list of enrolled courses 
        setEnrolledCourses([...enrolledCourses, course]);
        alert('Successfully enrolled in course!');
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  // When the unenroll button is clciked the user is unenrolled using the courseId
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

  //Enroll button unique to the manager allowing them to enroll an employee on a course by matching their employeeId
  const managerEnrollEmployee = async (employeeId, courseId) => {
    try {
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

  //Unenroll button unique to the manager allowing them to unenroll an employee on a course by matching their employeeId
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
  
  // The component's return statement. This is what will be rendered on the screen.
  // In case of manager, an employee select option will be there.
  // For each course, it will display the course details and show different buttons based on the user role and enrollment status.
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
            
            {/* Display Enroll and Unenroll buttons only if user is an employee */}
            {user.role === 'employee' && (
              <>
                {enrolledCourses.some(enrolledCourse => enrolledCourse._id === course._id) ? (
                  <EnrollButton disabled>Enrolled</EnrollButton>
                ) : (
                  <EnrollButton onClick={() => enrollCourse(course._id)}>Enroll</EnrollButton>
                )}
                <UnenrollButton onClick={() => unenrollCourse(course._id)}>Unenroll</UnenrollButton>
              </>
            )}

            {/* Display Manager Enroll and Unenroll buttons only if user is a manager and an employee is selected */}
            {user.role === 'manager' && selectedEmployee && (
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
