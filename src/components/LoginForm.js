import React from 'react';

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
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;