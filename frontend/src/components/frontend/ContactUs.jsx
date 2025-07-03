import { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { apiUrlFront } from '../common/http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const sendContact = async (data) => {
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlFront}/contact-us`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'x-locale': i18n.language,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result.data);

            if (result.status === 201) {
                toast.success(result.message);
                navigate('/');
            } else if (result.errors) {
                const formErrors = result.errors;

                Object.keys(formErrors).forEach((field) => {
                    setError(field, { type: 'server', message: formErrors[field][0] });
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setDisable(false);
        }
    };

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading={t("contact_hero_preHeading")}
                    heading={t("contact_hero_heading")}
                    text={t("contact_hero_text")}
                />

                <section className="section-9 py-5">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2>{t("contact_title")}</h2>
                            <p>{t("contact_description")}</p>

                        </div>

                        <div className="row mt-5">
                            <div className="col-md-3">
                                <div className="card shadow border-0 mb-3">
                                    <div className="card-body p-4">
                                        <h3>{t('phone')}</h3>
                                        <div>
                                            <a href="#">0968 686 868</a>
                                        </div>

                                        <h3 className='mt-4'>{t('email')}</h3>
                                        <div>
                                            <a href="#">construction_solution@contact.vn</a>
                                        </div>

                                        <h3 className='mt-4'>{t('address')}</h3>
                                        <div>
                                            {t('contact_address')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-9">
                                <div className="card shadow border-0">
                                    <div className="card-body p-5">
                                        <form onSubmit={handleSubmit(sendContact)}>
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <label className='form-label'>{t('name')}</label>
                                                    <input
                                                        {...register('name', { required: t('name_required') })}
                                                        type='text'
                                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                                        placeholder={t('enter_name')}
                                                    />

                                                    {
                                                        errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                                    }
                                                </div>

                                                <div className="col-md-6 mb-4">
                                                    <label className='form-label'>{t('email')}</label>
                                                    <input
                                                        {...register('email', {
                                                            required: t('email_required'),
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: t('email_invalid')
                                                            }
                                                        })}
                                                        type='text'
                                                        className={`form-control ${errors.email && 'is-invalid'}`}
                                                        placeholder={t('enter_email')}
                                                    />

                                                    {
                                                        errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                                    }
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>{t('phone')}</label>
                                                    <input
                                                        {...register('phone')}
                                                        type="text"
                                                        className='form-control form-control-lg'
                                                        placeholder={t('enter_phone')}
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>{t('subject')}</label>
                                                    <input
                                                        {...register('subject')}
                                                        type="text"
                                                        className='form-control form-control-lg'
                                                        placeholder={t('enter_subject')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className='mb-3'>
                                                    <label htmlFor='' className='form-label'>{t('message')}</label>
                                                    <textarea
                                                        {...register('message')}
                                                        name="message"
                                                        id="message"
                                                        rows={5}
                                                        className='form-control form-control-lg'
                                                        placeholder={t('enter_message')}>
                                                    </textarea>
                                                </div>
                                            </div>

                                            <button disabled={disable} type="submit" className="btn btn-primary large mt-3">
                                                {disable ? t('sending') : t('send')}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default ContactUs