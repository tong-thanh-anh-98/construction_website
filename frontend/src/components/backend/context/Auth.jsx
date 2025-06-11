import { useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const adminInfo = localStorage.getItem('adminInfo');
    const [admin, setUser] = useState(adminInfo);
    const login = (admin) => {
        setUser(admin)
    }

    const logout = () => {
        localStorage.removeItem('adminInfo');
        setUser(null);
        toast.success('Admin logout successfully.');
    }

    return (
        <AuthContext.Provider value={{
            admin,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
};