import { useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';

export const AuthProvider = ({ children }) => {
    const adminInfo = localStorage.getItem('adminInfo');
    const [admin, setUser] = useState(adminInfo);
    const login = (admin) => {
        setUser(admin)
    }

    const { t } = useTranslation();
    const logout = () => {
        localStorage.removeItem('adminInfo');
        setUser(null);
        // toast.success('Admin logout successfully.');
        toast.success(t('logout_success'));
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