import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import Sidebar from '../../common/Sidebar';
import Loader from '../../common/Loader';
import Notate from '../../common/Notate';
import HeaderAdmin from '../../common/HeaderAdmin';

const Show = () => {
    const { t, i18n } = useTranslation();
    const [testimonials, setTestimonials] = useState([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const fetchTestimonials = useCallback(async () => {
        setLoader(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/testimonials`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();

            if (result.status === 200) {
                setTestimonials(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoader(false);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchTestimonials()
    }, [fetchTestimonials]);

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
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between">
                                        <h4 className='h5'>{t('testimonials')}</h4>
                                        <Link to="/admin/testimonials/create" className="btn btn-primary">{t('create')}</Link>
                                    </div>
                                    <hr />
                                    {
                                        loader ? <Loader /> : (
                                            testimonials.length > 0 ? (
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th width="50">ID</th>
                                                            <th>{t('testimonial')}</th>
                                                            <th>{t('citation')}</th>
                                                            <th width="100">{t('status')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            testimonials.map(testimonial =>
                                                            (
                                                                <tr key={`testimonial-${testimonial.id}`}
                                                                    onClick={() => navigate(`/admin/testimonials/edit/${testimonial.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{testimonial.id}</td>
                                                                    <td>{testimonial.testimonial}</td>
                                                                    <td>{testimonial.citation}</td>
                                                                    <td>{testimonial.status === 1 ? t('active') : t('block')}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <Notate />
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Show