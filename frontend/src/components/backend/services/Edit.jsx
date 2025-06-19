import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../../common/Footer';
import Header from '../../common/Header';
import { useForm } from 'react-hook-form';
import JoditEditor from 'jodit-react';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import ModalDelete from '../../common/ModalDelete';

const Edit = ({ placeholder }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const [imageId, setImageId] = useState(null);
    const [service, setService] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [tempImages, setTempImages] = useState([]);
    const fileInputRef = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || '',
    }),
        [placeholder]
    );

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch Service data to pre-fill form
    const fetchService = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlAdmin}/services/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });

            const result = await response.json();
            const data = result.data;
            setContent(data.content);
            setService(data);

            reset({
                title: data.title,
                slug: data.slug,
                short_desc: data.short_desc,
                status: data.status,
            });

        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, [params.id, reset]);

    const updateService = async (data) => {
        const newData = { ...data, "content": content, "imageId": imageId, removeImage: removeImage ? 1 : 0 }
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/services/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(newData)
            });

            const result = await response.json();

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/admin/services');
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

        try {
            const res = await fetch(`${apiUrlAdmin}/save-temp-images`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
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

                // Reset input sau khi upload thành công
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        } catch (error) {
            console.error('Upload error:', error.message);
        }
    }

    const removeTempImage = async (id) => {
        if (confirm("Confirm deletion – are you sure?")) {
            try {
                const res = await fetch(`${apiUrlAdmin}/remove-temp-images/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });

                const result = await res.json();

                if (result.status === 200) {
                    setTempImages(prev => prev.filter(img => img.id !== id));
                    if (fileInputRef.current) fileInputRef.current.value = null;
                    toast.success('Image removed successfully');
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Remove image error:', error.message);
                toast.error('Remove image error');
            }
        }
    };


    const deleteService = async () => {
        try {
            const res = await fetch(`${apiUrlAdmin}/services/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                navigate('/admin/services');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowModal(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, [fetchService]);

    return (
        <>
            <Header />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteService}
                title={`Are you sure you want to delete service?`}
            />

            <main>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-3">
                            {/* Sidebar */}
                            <Sidebar />
                        </div>

                        <div className="col-md-9">
                            {/* Dashboard */}
                            <div className="card shadow border-0">
                                <div className="card-body">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h4 className='h5'><Link to="/admin/services">Services</Link> / Edit</h4>
                                        </div>

                                        <form onSubmit={handleSubmit(updateService)}>
                                            <div className="mb-3">
                                                <label htmlFor="" className='form-label'>Title</label>
                                                <input
                                                    {...register('title',
                                                        { required: 'The name field is required' }
                                                    )
                                                    }
                                                    type='text'
                                                    className={`form-control ${errors.title && 'is-invalid'}`}
                                                    placeholder='Enter name'
                                                />

                                                {
                                                    errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                                }
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="" className='form-label'>Slug</label>
                                                <input
                                                    {...register('slug',
                                                        { required: 'The slug field is required' }
                                                    )
                                                    }
                                                    type='text'
                                                    className={`form-control ${errors.slug && 'is-invalid'}`}
                                                    placeholder='Enter slug'
                                                />

                                                {
                                                    errors.slug && <p className='invalid-feedback'>{errors.slug?.message}</p>
                                                }
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Short Description</label>
                                                <textarea
                                                    {...register('short_desc')}
                                                    className='form-control'
                                                    rows={5}
                                                    placeholder='Short description'>
                                                </textarea>
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Content</label>
                                                <JoditEditor
                                                    ref={editor}
                                                    value={content}
                                                    config={config}
                                                    tabIndex={1}
                                                    onBlur={newContent => setContent(newContent)}
                                                />
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Status</label>
                                                <select
                                                    {
                                                    ...register('status',
                                                        { required: 'Please select a status' }
                                                    )
                                                    }
                                                    className={`form-control ${errors.status && 'is-invalid'}`}>
                                                    <option value="">Select a status</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Block</option>
                                                </select>

                                                {
                                                    errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                                                }
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Images</label>
                                                <br />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFile} />
                                            </div>

                                            <div className="row">
                                                {/* Ảnh gốc nếu chưa xoá */}
                                                {service.image && !removeImage && (
                                                    <div className="col-md-3 mb-4">
                                                        <div className="card h-100 shadow-sm">
                                                            <img
                                                                src={service.image_url}
                                                                alt={service.title}
                                                                className="card-img-top"
                                                            />
                                                            <div className="card-body p-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm w-100"
                                                                    onClick={() => {
                                                                        if (confirm("Confirm deletion – are you sure?")) {
                                                                            setRemoveImage(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    Remove Image
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Ảnh tạm thời */}
                                                {tempImages && tempImages.map((image) => (
                                                    <div className="col-md-3 mb-4" key={`temp-${image.id}`}>
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
                                                                    Remove Image
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button disabled={disable} type="submit" className="btn btn-primary mt-3">
                                                {disable ? 'Updating...' : 'Update'}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger mt-3 ms-2"
                                                onClick={() => {
                                                    setDeleteId(service.id);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Edit