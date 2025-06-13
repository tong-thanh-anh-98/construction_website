import React, { useContext } from 'react'
import { AuthContext } from '../backend/context/AuthContext'
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    return (
        <div className="card shadow border-0">
            <div className="card-body py-4 sidebar">
                <h4>Danh Mục</h4>
                <ul>
                    <li><Link to="/admin/dashboard">Bảng Điều Khiển</Link></li>
                    <li><Link to="/admin/services">Dịch Vụ</Link></li>
                    <li><a href="#">Dự Án</a></li>
                    <li><a href="#">Bài Viết</a></li>
                    <li>
                        <button className='btn btn-primary mt-4' onClick={logout}>Đăng Xuất</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar