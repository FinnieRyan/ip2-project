import React, { useState } from 'react';
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

const CourseFormBox = styled.div`
  border: 1px solid #b3d1ff;
  margin-bottom: 15px;
  padding: 30px;
  border-radius: 5px;
  background-color: #cce4ff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  animation: ${slideInFromLeft} 2s both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5em 0.5em -0.4em #99ccff;
  }
`;

const FormTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5em;
`;

const FormField = styled.input`
  margin-bottom: 10px;
  width: 100%;
  height: 35px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const FormButton = styled.button`
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

const RemoveButton = styled(FormButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;
const Select = styled.select`
  margin-bottom: 10px;
  width: 100%;
  height: 35px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;
const StyledMessage = styled.div`
  color: ${props => props.type === 'error' ? 'red' : 'green'};
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  background-color: ${props => props.type === 'error' ? '#ffcccc' : '#ccffcc'};
  transition: opacity 0.3s ease;
  opacity: ${props => props.show ? '1' : '0'};
`;

const AddRemoveCoursesForm = ({ courses }) => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseProvider, setCourseProvider] = useState('');
  const [courseDepartments, setCourseDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  //Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  //Retrieve the users token form local storage 
  const token = localStorage.getItem('myToken');
  

  const handleAddCourse = async () => {
    const newCourse = {
      name: courseName,
      description: courseDescription,
      provider: courseProvider,
      departments: courseDepartments,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/courses', newCourse, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 201) {
        console.log(response.data); 
        setMessage('Successfully added course!');
        console.log(message);
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(response.data.error);
        console.log(message);
        setMessageType('error')
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDepartment = (event) => {
    setCourseDepartments(Array.from(event.target.selectedOptions, option => option.value));
  };

  const handleRemoveCourse = async (courseName) => {
    try {
      // URL encode the course name to handle any special characters
      const encodedCourseName = encodeURIComponent(courseName);
      const response = await axios.delete(`http://localhost:5000/api/courses/${encodedCourseName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.status === 200) {
        console.log(response.data); 
        setMessage('Successfully Removed course!');
        console.log(message);
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(response.data.error);
        console.log(message);
        setMessageType('error')
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
};


return (
    <CourseFormBox>
    <StyledMessage type={messageType} show={message !== ''}>{message}</StyledMessage>
      <FormTitle>Add Course</FormTitle>
      <FormField type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      <FormField type="text" placeholder="Course Description" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
      <FormField type="text" placeholder="Course Provider" value={courseProvider} onChange={(e) => setCourseProvider(e.target.value)} />
      
      <FormTitle>Department</FormTitle>
      <Select value={courseDepartments} onChange={handleAddDepartment}>
        <option value="HR">HR</option>
        <option value="Marketing">Marketing</option>
      </Select>

      <FormButton onClick={handleAddCourse}>Add Course</FormButton>
  
      <FormTitle>Remove Course</FormTitle>
      <Select id="removeCourseSelect">
        {courses.map((course) => (
            <option key={course._id} value={course.name}>{course.name}</option>
        ))}
      </Select>
      <RemoveButton onClick={() => {
        const courseName = document.getElementById('removeCourseSelect').value;
        handleRemoveCourse(courseName);
      }}>Remove Course</RemoveButton>
    </CourseFormBox>
  );
};

export default AddRemoveCoursesForm;