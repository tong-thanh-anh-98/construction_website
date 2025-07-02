import { useContext } from 'react'
import { AuthContext } from '../backend/context/AuthContext'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const { t } = useTranslation();
    return (
        <div className="card shadow border-0">
            <div className="card-body py-5 sidebar">
                <h4 className='text-center'>{t('management_screen')}</h4>
                <hr />
                
                <ul>
                    <li><Link to="/admin/dashboard">{t('dashboard')}</Link></li>
                    <li><Link to="/admin/services">{t('services')}</Link></li>
                    <li><Link to="/admin/projects">{t('projects')}</Link></li>
                    <li><Link to="/admin/articles">{t('articles')}</Link></li>
                    <li><Link to="/admin/testimonials">{t('testimonials')}</Link></li>
                    <li><Link to="/admin/members">{t('members')}</Link></li>
                    <li>
                        <button className='btn btn-primary mt-4' onClick={logout}>{t('logout')}</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar