import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
`;

const NavBarLink = styled.button`
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    color: #ddd;
  }
`;

const NavBar = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    // clear the user from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('myToken');
    // navigate back to the login page
    navigate('/');
  };
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <NavBarContainer>
      {user.role === "employee" && 
      <>
        <NavBarLink onClick={() => navigate('/employee-dashboard')}>Employee Dashboard</NavBarLink>
        <NavBarLink onClick={() => navigate('/employee-training-history')}>Training History</NavBarLink>
        </>
      }
      {user.role === "manager" && 
        <NavBarLink onClick={() => navigate('/manager-dashboard')}>Manager Dashboard</NavBarLink>
      }
      <NavBarLink onClick={handleLogout}>Logout</NavBarLink>
    </NavBarContainer>
  );
};

export default NavBar;