import React, { useMemo, useRef, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useForm } from 'react-hook-form';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const [imageId, setImageId] = useState(null);
    const navigate = useNavigate();
    const [tempImages, setTempImages] = useState([]);
    const fileInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Nhập nội dung.',
    }),
        [placeholder]
    );

    const saveService = async (data) => {
        const newData = { ...data, "content": content, "imageId": imageId }
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(newData)
            });

            const result = await response.json();
            console.log(result.data);

            if (result.status === 201) {
                toast.success(result.message);
                navigate('/admin/services');
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
            setDisable(false); // enable button submit when image uploaded
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
                    if (fileInputRef.current) fileInputRef.current.value = '';
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
                                        <h4 className='h5'><Link to="/admin/services">Dịch Vụ</Link> / Tạo</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(saveService)}>
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Tiêu Đề</label>
                                            <input
                                                {...register('title',
                                                    { required: 'Bắt buộc nhập.' }
                                                )
                                                }
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
                                                {...register('slug',
                                                    { required: 'Bắt buộc nhập.' }
                                                )
                                                }
                                                type='text'
                                                className={`form-control ${errors.slug && 'is-invalid'}`}
                                                placeholder='Nhập slug.'
                                            />

                                            {
                                                errors.slug && <p className='invalid-feedback'>{errors.slug?.message}</p>
                                            }
                                        </div>

                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'>Mô Tả</label>
                                            <textarea
                                                {...register('short_desc')}
                                                className='form-control'
                                                rows={5}
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
                                            <label htmlFor='' className='form-label'>Trạng Thái</label>
                                            <select
                                                {
                                                ...register('status',
                                                    { required: 'Chọn một trạng thái.' }
                                                )
                                                }
                                                className={`form-control ${errors.status && 'is-invalid'}`}>
                                                <option value="">Chọn trạng thái</option>
                                                <option value="1">Hiển thị</option>
                                                <option value="0">Ẩn</option>
                                            </select>

                                            {
                                                errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                                            }
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
                                                                    Xóa ảnh
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