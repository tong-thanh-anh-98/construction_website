import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../backend/context/AuthContext';

const RequireAuth = ({children}) => {
    const {admin} = useContext(AuthContext);

    if (!admin) {
        return <Navigate to='/admin/login'/>
    }
  return children;
}

export default RequireAuth