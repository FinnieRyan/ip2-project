import React, { useState, useEffect } from 'react';
import RoleList from '../components/RoleList';

const RolesContainer = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch the roles from the server and update the state
  }, []);

  return (
    <RoleList roles={roles} />
  );
};

export default RolesContainer;