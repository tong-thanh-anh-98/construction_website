import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../../common/Footer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import JoditEditor from 'jodit-react';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import ModalDelete from '../../common/ModalDelete';

const Edit = ({ placeholder }) => {
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

    const [project, setProject] = useState([]);
    const [imageId, setImageId] = useState(null);
    const [tempImages, setTempImages] = useState([]);
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); // Cho nút xóa

    // Fetch project data to pre-fill form
    const fetchProject = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlAdmin}/projects/${params.id}`, {
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
            setProject(data);

            reset({
                title: data.title,
                slug: data.slug,
                location: data.location,
                construction_type: data.construction_type,
                sector: data.sector,
                short_desc: data.short_desc,
                status: data.status,
            });

        } catch (err) {
            console.error('Fetch error:', err);
        }
    }, [params.id, reset]);

    const updateProject = async (data) => {
        const newData = {
            ...data,
            content: content,
            imageId: imageId,
            removeImage: removeImage ? 1 : 0
        }

        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/projects/${params.id}`, {
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
                navigate('/admin/projects');
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
        if (confirm("Bạn có chắc chắn muốn xóa nó không?")) {
            setDisable(true);

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
                    toast.success('Hình ảnh đã được xóa.');
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

    const deleteProject = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(`${apiUrlAdmin}/projects/${deleteId}`, {
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
                navigate('/admin/projects');
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
        fetchProject();
    }, [fetchProject]);

    return (
        <>
            <Header />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteProject}
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
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h4 className='h5'><Link to="/admin/projects">Dự Án</Link> / Chỉnh Sửa</h4>
                                        </div>
                                        <hr />

                                        <form onSubmit={handleSubmit(updateProject)}>
                                            <div className="mb-3">
                                                <label htmlFor="" className='form-label'>Tiêu Đề</label>
                                                <input
                                                    {...register('title', { required: 'Bắt buộc nhập' })}
                                                    type='text'
                                                    className={`form-control ${errors.title && 'is-invalid'}`}
                                                    placeholder='Nhập tiêu đề.'
                                                />

                                                {
                                                    errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                                }
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="" className='form-label'>Slug</label>
                                                <input
                                                    {...register('slug', { required: 'Bắt buộc nhập.' })}
                                                    type='text'
                                                    className={`form-control ${errors.slug && 'is-invalid'}`}
                                                    placeholder='Nhập slug'
                                                />

                                                {
                                                    errors.slug && <p className='invalid-feedback'>{errors.slug?.message}</p>
                                                }
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="" className='form-label'>Vị Trí</label>
                                                        <input
                                                            {...register('location')}
                                                            type='text'
                                                            className="form-control"
                                                            placeholder='Nhập vị trí.'
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="" className='form-label'>Loại Hình Xây Dựng</label>
                                                        <select
                                                            className="form-control"
                                                            {...register('construction_type')}
                                                        >
                                                            <option value="">------Chọn loại xây dựng------</option>
                                                            <option value="residential">Xây dựng nhà ở</option>
                                                            <option value="commercial">Xây dựng thương mại</option>
                                                            <option value="industrial">Xây dựng công nghiệp</option>
                                                            <option value="infrastructure">Xây dựng cơ sở hạ tầng</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="" className='form-label'>Lĩnh Vực Xây Dựng</label>
                                                        <select
                                                            className="form-control"
                                                            {...register('sector')}
                                                        >
                                                            <option value="">------Chọn lĩnh vực------</option>
                                                            <option value="health">Sức khỏe</option>
                                                            <option value="education">Giáo dục</option>
                                                            <option value="corporate">Doanh nghiệp</option>
                                                            <option value="individual">Cá nhân</option>
                                                            <option value="community">Cộng đồng</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className='mb-3'>
                                                        <label htmlFor='' className='form-label'>Trạng Thái</label>
                                                        <select
                                                            {...register('status', { required: 'Chọn một trạng thái.' })}
                                                            className={`form-control ${errors.status && 'is-invalid'}`}>
                                                            <option value="">------Chọn trạng thái-------</option>
                                                            <option value="1">Hiển thị</option>
                                                            <option value="0">Ẩn</option>
                                                        </select>

                                                        {
                                                            errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Mô Tả Ngắn Gọn</label>
                                                <textarea
                                                    {...register('short_desc')}
                                                    className='form-control'
                                                    rows={3}
                                                    placeholder='Nhập mô tả.'>
                                                </textarea>
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Nội Dung</label>
                                                <JoditEditor
                                                    ref={editor}
                                                    value={content}
                                                    config={config}
                                                    tabIndex={1}
                                                    onBlur={newContent => setContent(newContent)}
                                                />
                                            </div>

                                            <div className='mb-3'>
                                                <label htmlFor='' className='form-label'>Hình Ảnh</label>
                                                <br />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFile} />
                                            </div>

                                            <div className="mb-3">
                                                <div className="row">
                                                    {project.image && !removeImage && (
                                                        <div className="col-md-4">
                                                            <div className="card h-100 shadow-sm">
                                                                <img
                                                                    src={project.image_url}
                                                                    alt={project.title}
                                                                    className="card-img-top"
                                                                />
                                                                <div className="card-body p-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm w-100"
                                                                        onClick={() => {
                                                                            if (confirm("Bạn có chắc chắn muốn xóa nó không?")) {
                                                                                setRemoveImage(true);
                                                                            }
                                                                        }}
                                                                    >
                                                                        Xóa Ảnh
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
                                                                        Xóa Ảnh
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
                                                            : 'Lưu'
                                                    }
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger mt-3 ms-2"
                                                    disabled={isDeleting}
                                                    onClick={() => {
                                                        setDeleteId(project.id);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    {
                                                        isDeleting
                                                            ? <>
                                                                <span className="btn btn-primary spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            </>
                                                            : 'Xóa'
                                                    }
                                                </button>
                                            </div>
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