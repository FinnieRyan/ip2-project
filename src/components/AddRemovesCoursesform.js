import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';


const CourseFormBox = styled.div`
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

const AddRemoveCoursesForm = ({ courses }) => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseProvider, setCourseProvider] = useState('');
  const [courseDepartment, setCourseDepartment] = useState('');
  //Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  //Retrieve the users token form local storage 
  const token = localStorage.getItem('myToken');
  

  const handleAddCourse = async () => {
    const newCourse = {
      name: courseName,
      description: courseDescription,
      provider: courseProvider,
      department: courseDepartment,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/courses', newCourse, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    } catch (err) {
      console.error(err);
    }
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
      // You may need to refresh the list of courses here.
    } catch (err) {
      console.error(err);
    }
};


return (
    <CourseFormBox>
      <FormTitle>Add Course</FormTitle>
      <FormField type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      <FormField type="text" placeholder="Course Description" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
      <FormField type="text" placeholder="Course Provider" value={courseProvider} onChange={(e) => setCourseProvider(e.target.value)} />
      <FormField type="text" placeholder="Course Department" value={courseDepartment} onChange={(e) => setCourseDepartment(e.target.value)} />
      <FormButton onClick={handleAddCourse}>Add Course</FormButton>
  
      <FormTitle>Remove Course</FormTitle>
      <select id="removeCourseSelect">
        {courses.map((course) => (
            <option key={course._id} value={course.name}>{course.name}</option>
        ))}
      </select>
      <RemoveButton onClick={() => {
        const courseName = document.getElementById('removeCourseSelect').value;
        handleRemoveCourse(courseName);
      }}>Remove Course</RemoveButton>
    </CourseFormBox>
  );
};

export default AddRemoveCoursesForm;