import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/frontend/Home';
import About from './components/frontend/About';
import Services from './components/frontend/Services';
import Projects from './components/frontend/Projects';
import Blogs from './components/frontend/Blogs';
import ContactUs from './components/frontend/ContactUs';

import Login from './components/backend/Login';
import Dashboard from './components/backend/Dashboard';
import RequireAuth from './components/common/RequireAuth';

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* router frontend (user) */}
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/projects' element={<Projects />} />
                    <Route path='/blogs' element={<Blogs />} />
                    <Route path='/contact' element={<ContactUs />} />

                    {/* route backend (admin) */}
                    <Route path='/admin/login' element={<Login />} />
                    <Route path='/admin/dashboard'
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="top-center"
            />
        </>
    )
}

export default App
