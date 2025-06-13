import Header from '../common/Header';
import Footer from '../common/Footer';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './context/AuthContext';

const Login = () => {
    const {login} = useContext(AuthContext);
    const [disable, setDisable] = useContext(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setDisable(true);
        try {
            const response = await fetch("http://localhost:8000/api/authenticate", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 200) {
                const adminInfo = {
                    id: result.id,
                    token: result.token
                };

                localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                login(adminInfo);
                toast.success(result.message);
                navigate('/admin/dashboard');

            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error has occurred:', error);
        } finally {
            setDisable(false);
        }
    };

    return (
        <>
            <Header />
            <main>
                <div className="container my-5 d-flex justify-content-center">
                    <div className="login-form">
                        <div className="card border-0 shadow">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h4 className='mb-3'>Admin Login</h4>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Email</label>
                                        <input
                                            {...register('email', {
                                                required: 'This field is require.',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Please enter a valid email address.'
                                                }
                                            })}
                                            type="text"
                                            className={`form-control ${errors.email && 'is-invalid'}`}
                                            placeholder='Enter email'
                                        />

                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                        }
                                    </div>

                                    {/* <div className="mb-3">
                                        <label htmlFor="" className="form-label">Password</label>
                                        <input
                                            {...register("password",
                                                { required: "The password field is required." }
                                            )}
                                            type="password"
                                            className={`form-control ${errors.password && 'is-invalid'}`}
                                            placeholder='Enter password'
                                        />

                                        {
                                            errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                        }
                                    </div> */}
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <div className="input-group">
                                            <input
                                                {...register("password", {
                                                    required: "The password field is required."
                                                })}
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Enter password"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                            {
                                                errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                            }
                                        </div>
                                    </div>

                                    <button disabled={disable} type="submit" className="btn btn-primary large mt-3">
                                        {disable ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Login