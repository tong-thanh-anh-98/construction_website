import { Link, useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Sidebar from '../../common/Sidebar';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Nhập nội dung.',
    }),
        [placeholder]
    );

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
            }
        } catch (error) {
            console.error('Upload error:', error.message);
        } finally {
            setDisable(false); // enable button submit when image uploaded.
        }
    };

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
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    toast.success('Hình ảnh đã được xóa.');
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
                                        <h4 className='h5'><Link to="/admin/projects">Dự Án</Link> / Tạo</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(saveProject)}>
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
                                                        <option value="">------Chọn trạng thái------</option>
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
                                            <label htmlFor='' className='form-label'>Mô Tả</label>
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

                                        <div className='mb-3'>
                                            <div className='row gy-3'>
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
                                                                    Xóa Ảnh
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
                                                        : 'Lưu'
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
            <Footer />
        </>
    )
}

export default Create