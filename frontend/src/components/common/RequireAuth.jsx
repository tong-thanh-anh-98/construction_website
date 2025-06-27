import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../backend/context/AuthContext';

const RequireAuth = () => {
    const {admin} = useContext(AuthContext);

    if (!admin) {
        return <Navigate to='/admin/login'/>
    }
  return <Outlet />; // ⚠️ RẤT QUAN TRỌNG! khi muốn dùng <RequireAuth /> trong App.jsx bọc các route con bên trong mà không hiển thị trang trắng.
}

export default RequireAuth