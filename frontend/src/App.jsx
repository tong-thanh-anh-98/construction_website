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

import { default as ShowServices } from './components/backend/services/Show';
import { default as CreateServices } from './components/backend/services/Create';
import { default as EditServices } from './components/backend/services/Edit';

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

                    <Route path='/admin/services'
                        element={
                            <RequireAuth>
                                <ShowServices />
                            </RequireAuth>
                        }
                    />

                    <Route path='/admin/services/create'
                        element={
                            <RequireAuth>
                                <CreateServices />
                            </RequireAuth>
                        }
                    />

                    <Route path='/admin/services/edit/:id'
                        element={
                            <RequireAuth>
                                <EditServices />
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
