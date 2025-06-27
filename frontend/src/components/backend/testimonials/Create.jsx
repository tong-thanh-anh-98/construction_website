import { useTranslation } from 'react-i18next';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {
    const { t, i18n } = useTranslation();
    const editor = useRef(null);
    const fileInputRef = useRef(null);
    const [testimonial, setTestimonial] = useState('');
    const [disable, setDisable] = useState(false);
    const [imageId, setImageId] = useState(null);
    const navigate = useNavigate();
    const [tempImages, setTempImages] = useState([]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || t('enter_testimonials'),
    }), [placeholder, t]);

    const saveTestimonial = async (data) => {
        const newData = { ...data, "testimonial": testimonial, "imageId": imageId }
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/testimonials`, {
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
            console.log(result.data);

            if (result.status === 201) {
                toast.success(result.message);
                navigate('/admin/testimonials');
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
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("image", file);
        setDisable(true); // disable button submit when image uploading.

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
            } else {
                setImageId(result.data.id);
                setTempImages(prev => [...prev, result.data]);
                toast.success(result.message);
            }
        } catch (error) {
            console.error('Upload error:', error.message);
        } finally {
            setDisable(false); // enable button submit when image uploaded
        }
    }

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
            <Header />
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
                                        <h4 className='h5'><Link to="/admin/testimonials">{t('testimonials')}</Link> / {t('create')}</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(saveTestimonial)}>
                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'>{t('testimonial')}</label>
                                            <JoditEditor
                                                ref={editor}
                                                value={testimonial}
                                                config={config}
                                                tabIndex={1}
                                                onBlur={newTestimonial => setTestimonial(newTestimonial)}
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>{t('citation')}</label>
                                            <textarea
                                                {...register('citation')}
                                                className='form-control'
                                                rows={5}
                                                placeholder={t('enter_citation')}>
                                            </textarea>
                                        </div>

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