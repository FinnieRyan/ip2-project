import React from 'react';
import Role from './Role';

const RoleList = ({ roles }) => (
  <div className="role-list">
    {roles.map(role => <Role key={role.id} role={role} />)}
  </div>
);

export default RoleList;
