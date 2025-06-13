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
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || '',
    }),
        [placeholder]
    );

    const saveService = async (data) => {
        data.description = content;
        setDisable(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result);

            if (result.status === 200) {
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
                                        <h4 className='h5'><Link to="/admin/services">Services</Link> / Create</h4>
                                    </div>
                                    <hr />

                                    <form onSubmit={handleSubmit(saveService)}>
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
                                                onChange={newContent => setContent(newContent)}
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

                                        <button disabled={disable} type="submit" className="btn btn-primary mt-3">
                                            {disable ? 'Creating...' : 'Create'}
                                        </button>
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