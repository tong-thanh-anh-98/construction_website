import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { useTranslation } from 'react-i18next';
import HeaderAdmin from '../../common/HeaderAdmin';

const Create = ({ placeholder }) => {
    const { t, i18n } = useTranslation();
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || t('enter_content'),
    }), [placeholder, t]);

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const [imageId, setImageId] = useState(null);
    const [tempImages, setTempImages] = useState([]);
    const fileInputRef = useRef(null);

    const saveProject = async (data) => {
        const newData = { ...data, "content": content, "imageId": imageId }
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/projects`, {
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

            if (result.status === 201) {
                toast.success(result.message);
                navigate('/admin/projects');
            } else if (result.errors) {
                const formErrors = result.errors;

                Object.keys(formErrors).forEach((field) => {
                    setError(field, { type: 'server', message: formErrors[field][0] });
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Errors:', error);
        } finally {
            setDisable(false);
        }
    };

    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("image", file);
        setDisable(true); // disable button submit when image uploading.

        try {
            const res = await fetch(`${apiUrlAdmin}/save-temp-images`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Locale': i18n.language, //  gửi ngôn ngữ đang dùng
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: formData
            });

            const result = await res.json();

            if (result.status === 400) {
                toast.error(result.errors.image[0]);
            } else {
                setImageId(result.data.id);
                setTempImages(prev => [...prev, result.data]);
                toast.success(result.message);
            }
        } catch (error) {
            console.error('Upload error:', error.message);
        } finally {
            setDisable(false); // enable button submit when image uploaded.
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
                        'X-Locale': i18n.language, //  gửi ngôn ngữ đang dùng
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
                console.error('Remove error:', error.message);
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
                                        <h4 className='h5'><Link to="/admin/projects">{t('projects')}</Link> / {t('create')}</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(saveProject)}>
                                        <div className="mb-3">
                                            <label className='form-label'>{t('title')}</label>
                                            <input
                                                {...register('title', { required: t('title_required') })}
                                                type='text'
                                                className={`form-control ${errors.title && 'is-invalid'}`}
                                                placeholder={t('enter_title')}
                                            />

                                            {
                                                errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                            }
                                        </div>

                                        <div className="mb-3">
                                            <label className='form-label'>{t('slug')}</label>
                                            <input
                                                {...register('slug', { required: t('slug_required') })}
                                                type='text'
                                                className={`form-control ${errors.slug && 'is-invalid'}`}
                                                placeholder={t('enter_slug')}
                                            />

                                            {
                                                errors.slug && <p className='invalid-feedback'>{errors.slug?.message}</p>
                                            }
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('location')}</label>
                                                    <input
                                                        {...register('location')}
                                                        type='text'
                                                        className="form-control"
                                                        placeholder={t('enter_location')}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('construction_type')}</label>
                                                    <select
                                                        className="form-control"
                                                        {...register('construction_type')}
                                                    >
                                                        <option value="">{t('select_construction')}</option>
                                                        <option value="residential">{t('residential')}</option>
                                                        <option value="commercial">{t('commercial')}</option>
                                                        <option value="industrial">{t('industrial')}</option>
                                                        <option value="infrastructure">{t('infrastructure')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('sector')}</label>
                                                    <select
                                                        className="form-control"
                                                        {...register('sector')}
                                                    >
                                                        <option value="">{t('select_sector')}</option>
                                                        <option value="health">{t('health')}</option>
                                                        <option value="education">{t('education')}</option>
                                                        <option value="corporate">{t('corporate')}</option>
                                                        <option value="individual">{t('individual')}</option>
                                                        <option value="community">{t('community')}</option>
                                                    </select>
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
                                            <label className='form-label'>{t('short_desc')}</label>
                                            <textarea
                                                {...register('short_desc')}
                                                className='form-control'
                                                rows={5}
                                                placeholder={t('enter_short_desc')}>
                                            </textarea>
                                        </div>

                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'>{t('content')}</label>
                                            <JoditEditor
                                                ref={editor}
                                                value={content}
                                                config={config}
                                                tabIndex={1}
                                                onBlur={newContent => setContent(newContent)}
                                            />
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