import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import AddRemoveCourses from '../containers/AddRemoveCourses';
import AddRemoveCoursesForm from '../components/AddRemovesCoursesform';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('AddRemoveCourses', () => {
  test('renders AddRemoveCourses component', () => {
    render(<AddRemoveCourses />);
    let buttons = screen.getAllByText('Add Course');
    // Assuming you want to check the first button, you can adjust accordingly.
    expect(buttons[0]).toBeInTheDocument();
  });

  test('should make API call on component mount', async () => {
    render(<AddRemoveCourses />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/course', expect.anything());
  });
  
  test('should handle unauthorized access', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'employee' }));
    render(<AddRemoveCourses />);
    expect(screen.getByText('Oops! You do not have the right permissions to access this page.')).toBeInTheDocument();
  });
});

describe('AddRemoveCoursesForm', () => {
  let mockCourses = [{_id: "1", name: "course1"}, {_id: "2", name: "course2"}];

  test('renders AddRemoveCoursesForm component', () => {
    render(<AddRemoveCoursesForm courses={mockCourses} />);
    let buttons = screen.getAllByText('Add Course');
    // Assuming you want to check the first button, you can adjust accordingly.
    expect(buttons[0]).toBeInTheDocument();
  });

  test('should make API call on Add Course', async () => {
    render(<AddRemoveCoursesForm courses={mockCourses} />);
    userEvent.type(screen.getByPlaceholderText('Course Name'), 'course1');
    userEvent.type(screen.getByPlaceholderText('Course Description'), 'description');
    userEvent.type(screen.getByPlaceholderText('Course Provider'), 'provider');
    userEvent.selectOptions(screen.getByText('HR').closest('select'), ['HR']);
    userEvent.click(screen.getByRole('button', {name: /add course/i}));


    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/courses', expect.anything(), expect.anything());
});

test('should make API call on Remove Course', async () => {
    render(<AddRemoveCoursesForm courses={mockCourses} />);
    
    userEvent.click(screen.getByRole('button', { name: /Remove Course/i }));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/courses/course1', expect.anything());
});
});

