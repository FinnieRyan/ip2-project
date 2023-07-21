import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginContainer from '../containers/LoginContainer';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

const axios = require('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginContainer', () => {
  test('renders LoginContainer component', () => {
    render(<LoginContainer />);
    expect(screen.getByText('Welcome to E-Train Training Portal!')).toBeInTheDocument();
  });

  test('displays error message when login fails', async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 401 } })
    );

    render(<LoginContainer />);

    const loginButton = screen.getByRole('button', { name: 'Login' });
    userEvent.click(loginButton);

    const errorMessage = await screen.findByText('Invalid username or password');
    expect(errorMessage).toBeInTheDocument();
  });

  test('successful login redirects to the right route', async () => {
    const response = { 
      data: { user: { role: 'employee' } }, 
      headers: { authorization: 'Bearer abc' } 
    };
    const navigate = jest.fn();

    axios.post.mockResolvedValue(response);
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(<LoginContainer />);

    const loginButton = screen.getByRole('button', { name: 'Login' });
    userEvent.click(loginButton);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/employee-dashboard'));
  });

  test('should make API call on handleLogin', async () => {
    const response = { 
      data: { user: { role: 'employee' } },
      headers: { authorization: 'Bearer token' },
    };

    axios.post.mockResolvedValue(response);

    render(<LoginContainer />);

    const usernameInput = await screen.findByLabelText('Username:');
    const passwordInput = await screen.findByLabelText('Password:');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    userEvent.type(usernameInput, 'username');
    userEvent.type(passwordInput, 'password');
    userEvent.click(loginButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/login', { username: 'username', password: 'password' });
  });
});
 

