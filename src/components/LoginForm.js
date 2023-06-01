import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 600px; 
  padding: 30px; 
  border-radius: 10px; 
  background-color: #f5f5f5;
  box-shadow: 0px 0px 16px 4px rgba(0,0,0,0.1); 
`;

const Input = styled.input`
  width: 100%;
  padding: 15px; 
  margin: 15px 0; 
  border-radius: 6px; 
  box-sizing: border-box;
  font-size: 1.2em; 
`;

const Button = styled.button`
  width: 100%;
  padding: 15px; 
  margin: 15px 0; 
  border-radius: 6px; 
  box-sizing: border-box;
  background-color: #007bff;
  color: #fff;
  font-size: 1.5em; 
  border: none;
  cursor: pointer;
`;

const Label = styled.label`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 1.5em; 
  color: #333;
  font-weight: 600;
`;

function LoginForm({ username, onUsernameChange, password, onPasswordChange, onLogin }) {
  const handleUsernameChange = (event) => {
    onUsernameChange(event.target.value);
  };

  const handlePasswordChange = (event) => {
    onPasswordChange(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Username:
        <Input type="text" value={username} onChange={handleUsernameChange} />
      </Label>
      <Label>
        Password:
        <Input type="password" value={password} onChange={handlePasswordChange} />
      </Label>
      <Button type="submit">Login</Button>
    </Form>
  );
}

export default LoginForm;