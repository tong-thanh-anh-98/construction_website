import Header from '../common/Header';
import Footer from '../common/Footer';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t, i18n } = useTranslation();
    const { login } = useContext(AuthContext);
    const [disable, setDisable] = useState(false);
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
                    'Content-Type': 'application/json',
                    'X-Locale': i18n.language // gửi ngôn ngữ lên server khi áp dụng đa ngôn ngữ
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

            } else if (response.status === 422 && result.errors) {
                // Hiển thị lỗi từng field (từ Laravel Validator)
                Object.values(result.errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });

            } else {
                // Các lỗi khác: ví dụ sai email/pass
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
                                    <h4 className='mb-3'>{t('admin_login')}</h4>
                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">{t('email')}</label>
                                        <input
                                            {...register('email', {
                                                required: t('email_required'),
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: t('email_invalid')
                                                }
                                            })}
                                            type="text"
                                            autoComplete="email"
                                            className={`form-control ${errors.email && 'is-invalid'}`}
                                            placeholder={t('enter_email')}
                                        />

                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('password')}</label>
                                        <div className="input-group">
                                            <input
                                                {...register("password", { required: t('password_required') })}
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder={t('enter_password')}
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
                                        {disable ? t('logging_in') : t('login')}
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