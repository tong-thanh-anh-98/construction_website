import { useEffect, useState } from 'react'
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import Notate from '../../common/Notate';
import { useTranslation } from 'react-i18next';

const Show = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const fetchServices = async () => {
        setLoader(true);
        try {
            const response = await fetch(`${apiUrlAdmin}/services`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();

            if (result.status === 200) {
                setServices(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        fetchServices()
    }, []);

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
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between">
                                        <h4 className='h5'>{t('service')}</h4>
                                        <Link to="/admin/services/create" className="btn btn-primary">{t('create')}</Link>
                                    </div>
                                    <hr />
                                    {
                                        loader ? <Loader /> : (
                                            services.length > 0 ? (
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th width="50">ID</th>
                                                            <th>{t('title')}</th>
                                                            <th>Slug</th>
                                                            <th width="100">{t('status')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            services.map(service =>
                                                            (
                                                                <tr key={`service-${service.id}`}
                                                                    onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{service.id}</td>
                                                                    <td>{service.title}</td>
                                                                    <td>{service.slug}</td>
                                                                    <td>{service.status === 1 ? t('active') : t('block')}</td>
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
            <Footer />
        </>
    )
}

export default Show