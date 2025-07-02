import { Link, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../common/HeaderAdmin';
import Sidebar from '../../common/Sidebar';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';

const Create = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const fileInputRef = useRef(null);
    const [imageId, setImageId] = useState(null);
    const [tempImages, setTempImages] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const createMember = async (data) => {
        const newData = { ...data, "imageId": imageId }
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(newData)
            });

            const result = await response.json();
            console.log(result.member);

            if (result.status === 201) {
                toast.success(result.message);
                navigate('/admin/members');
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

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setDisable(true); // Disable submit button while uploading

        try {
            const res = await fetch(`${apiUrlAdmin}/save-temp-images`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: formData
            });

            const result = await res.json();

            if (result.status === 400) {
                toast.error(result.errors.image[0]);
            }

            // Upload success
            setImageId(result.data.id);
            setTempImages(prev => [...prev, result.data]);
            toast.success(result.message);

        } catch (error) {
            console.error(t('upload_error'), error.message);
        } finally {
            setDisable(false); // Enable submit button
        }
    };

    const removeTempImage = async (id) => {
        if (confirm(t('confirm_remove'))) {
            setDisable(true);

            try {
                const res = await fetch(`${apiUrlAdmin}/remove-temp-images/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-Locale': i18n.language,
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });

                const result = await res.json();

                if (result.status === 200) {
                    setTempImages(prev => prev.filter(img => img.id !== id));
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error(t('upload_error'), error.message);
            } finally {
                setDisable(false);
            }
        }
    };

    return (
        <>
            <HeaderAdmin />
            <main>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>

                        <div className="col-md-9">
                            <div className="card shadow border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="h5">
                                            <Link to="/admin/members">{t('members')}</Link> / {t('create')}
                                        </h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(createMember)}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
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
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('job_title')}</label>
                                                    <input
                                                        {...register('job_title', { required: t('job_title') })}
                                                        type='text'
                                                        className={`form-control ${errors.job_title && 'is-invalid'}`}
                                                        placeholder={t('enter_job_title')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('link_url')}</label>
                                                    <input
                                                        type='text'
                                                        className="form-control"
                                                        placeholder={t('enter_link_url')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className='mb-3'>
                                                    <label htmlFor='' className='form-label'>{t('status')}</label>
                                                    <select
                                                        {...register('status', { required: t('status_required') })}
                                                        className={`form-control ${errors.status && 'is-invalid'}`}>
                                                        <option value="">{t('select_status')}</option>
                                                        <option value="1">{t('active')}</option>
                                                        <option value="0">{t('block')}</option>
                                                    </select>

                                                    {
                                                        errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>{t('image')}</label>
                                            <br />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFile} />
                                        </div>

                                        <div className='mb-3'>
                                            <div className='row'>
                                                {
                                                    tempImages && tempImages.map((image) => {
                                                        return (
                                                            <div className='col-md-4' key={`temp-${image.id}`}>
                                                                <div className='card shadow'>
                                                                    <img src={image.image_url} alt={image.name} className='w-100' />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className='btn btn-danger mt-3 w-100'
                                                                    onClick={() => removeTempImage(image.id)}
                                                                >
                                                                    {t('remove_image')}
                                                                </button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div className='mb-3'>
                                            <button disabled={disable} type="submit" className="btn btn-primary mt-3">
                                                {
                                                    disable
                                                        ? <>
                                                            <span className="btn btn-primary spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        </>
                                                        : t('save')
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Create