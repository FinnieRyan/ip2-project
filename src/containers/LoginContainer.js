import React, { useState,useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2em;
  text-align: center;
  animation: ${fadeIn} 2s ease-in;
  margin-bottom: 20px;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledError = styled.p`
  color: red;
  font-size: 1.2em;
  margin: 10px 0;
  animation: ${fadeIn} 2s ease-in;
`;

function LoginContainer() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      //console.log('handle login');
      //console.log('Username:', username);
      //console.log('Password:', password);
      const response = await axios.post('http://localhost:5000/login', { username, password });
      //console.log('Response headers:', response.headers); 
      // handle successful login here (store user in local storage, navigate to different page, etc.)
      //console.log('Login response:', response.data);

      const { user } = response.data;
      //console.log('User:', user);
      //console.log('Role:', user.role);
      //console.log(response.headers);
      const token = response.headers.authorization.split(' ')[1];
      //console.log(token);
      localStorage.setItem('myToken', token);
      
      
      console.log(user.role);
      if (user.role === 'employee') {
        //console.log('Employee login successful');
        localStorage.setItem('user', JSON.stringify(user)); // Store the user in local storage
        navigate('/employee-dashboard'); // Navigate to the employee dashboard
      } else if (user.role === 'manager') {
        //console.log('Manager login successful');
        localStorage.setItem('user', JSON.stringify(user)); // Store the user in local storage
        navigate('/manager-dashboard'); // Navigate to the manager dashboard
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('Unexpected error. Please try again later')
      }
      console.log('Login unsuccessful');
    }
  };

  return (
    <StyledLoginContainer>
      <ContentWrapper>
        <Title>Welcome to E-Train Training Portal!</Title>
        {errorMessage && <StyledError>{errorMessage}</StyledError>}
        <LoginForm
          username={username}
          onUsernameChange={setUsername}
          password={password}
          onPasswordChange={setPassword}
          onLogin={handleLogin}
        />
      </ContentWrapper>
    </StyledLoginContainer>
  );
}

export default LoginContainer;

