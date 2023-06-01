import React, { useState,useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function LoginContainer() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('handle login');
      console.log('Username:', username);
      console.log('Password:', password);
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log('Response headers:', response.headers); 
      // handle successful login here (store user in local storage, navigate to different page, etc.)
      console.log('Login response:', response.data);

      const { user } = response.data;
      console.log('User:', user);
      //console.log('Role:', user.role);
      console.log(response.headers);
      const token = response.headers.authorization.split(' ')[1];
      console.log(token);
      localStorage.setItem('myToken', token);
      
      
      console.log(user.role);
      if (user.role === 'employee') {
        console.log('Employee login successful');
        localStorage.setItem('user', JSON.stringify(user)); // Store the user in local storage
        navigate('/employee-dashboard'); // Navigate to the employee dashboard
      } else if (user.role === 'manager') {
        console.log('Manager login successful');
        localStorage.setItem('user', JSON.stringify(user)); // Store the user in local storage
        navigate('/manager-dashboard'); // Navigate to the manager dashboard
      }
    } catch (err) {
      console.log('Login unsuccessful');
    }
  };

  return (
    <LoginForm
      username={username}
      onUsernameChange={setUsername}
      password={password}
      onPasswordChange={setPassword}
      onLogin={handleLogin}
    />
  );
}

export default LoginContainer;

