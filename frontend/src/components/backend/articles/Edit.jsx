import { useTranslation } from 'react-i18next';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import ModalDelete from '../../common/ModalDelete';
import HeaderAdmin from '../../common/HeaderAdmin';

const Edit = ({ placeholder }) => {
    const { t, i18n } = useTranslation();
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || '',
    }),
        [placeholder]
    );
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm();
    const [article, setArticle] = useState([]);
    const [imageId, setImageId] = useState(null);
    const [tempImages, setTempImages] = useState([]);
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch Article data to pre-fill form
    const fetchArticle = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlAdmin}/articles/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                }
            });

            const result = await response.json();
            const data = result.data;
            setContent(data.content);
            setArticle(data);

            reset({
                title: data.title,
                slug: data.slug,
                author: data.author,
                status: data.status,
            });

        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, [params.id, reset, i18n.language]);

    const updateArticle = async (data) => {
        const newData = {
            ...data,
            content: content,
            imageId: imageId,
            removeImage: removeImage ? 1 : 0
        }

        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/articles/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(newData)
            });

            const result = await response.json();

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/admin/articles');
            } else if (result.errors) {
                Object.keys(result.errors).forEach((field) => {
                    setError(field, { type: 'server', message: result.errors[field][0] });
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
        setDisable(true);

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

                // Reset input upload successfully.
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        } catch (error) {
            console.error('Upload error:', error.message);
        } finally {
            setDisable(false);
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
                    if (fileInputRef.current) fileInputRef.current.value = null;
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Remove image error:', error.message);
            } finally {
                setDisable(false);
            }
        }
    };

    const deleteArticle = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(`${apiUrlAdmin}/articles/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/admin/articles');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowModal(false);
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

    return (
        <>
            <HeaderAdmin />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteArticle}
            />

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
                                        <h4 className='h5'><Link to="/admin/articles">{t('articles')}</Link> / {t('edit')}</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(updateArticle)}>
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

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className='form-label'>{t('author')}</label>
                                                    <input
                                                        {...register('author')}
                                                        type='text'
                                                        className="form-control"
                                                        placeholder={t('enter_author')}
                                                    />
                                                </div>
                                            </div>
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

                                        <div className="mb-3">
                                            <div className="row">
                                                {article.image && !removeImage && (
                                                    <div className="col-md-4">
                                                        <div className="card h-100 shadow-sm">
                                                            <img
                                                                src={article.image_url}
                                                                alt={article.title}
                                                                className="card-img-top"
                                                            />
                                                            <div className="card-body p-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm w-100"
                                                                    onClick={() => {
                                                                        if (confirm(t('confirm_remove'))) {
                                                                            setRemoveImage(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    {t('remove_image')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {tempImages && tempImages.map((image) => (
                                                    <div className="col-md-4" key={`temp-${image.id}`}>
                                                        <div className="card h-100 shadow-sm">
                                                            <img
                                                                src={image.image_url}
                                                                alt={image.name}
                                                                className="card-img-top"
                                                            />
                                                            <div className="card-body p-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm w-100"
                                                                    onClick={() => removeTempImage(image.id)}
                                                                >
                                                                    {t('remove_image')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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

                                            <button
                                                type="button"
                                                className="btn btn-danger mt-3 ms-2"
                                                disabled={isDeleting}
                                                onClick={() => {
                                                    setDeleteId(article.id);
                                                    setShowModal(true);
                                                }}
                                            >
                                                {
                                                    isDeleting
                                                        ? <>
                                                            <span className="btn btn-primary spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        </>
                                                        : t('delete')
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

export default Edit