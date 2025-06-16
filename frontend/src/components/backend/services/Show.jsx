import { useEffect, useState } from 'react'
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import Notate from '../../common/Nostate';

const Show = () => {
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
                                        <h4 className='h5'>Services</h4>
                                        <Link to="/admin/services/create" className="btn btn-primary">Create</Link>
                                    </div>
                                    <hr />

                                    {
                                        loader ? <Loader /> : (
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th width="50">ID</th>
                                                        <th>Title</th>
                                                        <th>Slug</th>
                                                        <th width="100">Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        services && services.map(service => {
                                                            return (
                                                                <tr key={`service-${service.id}`}
                                                                    onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{service.id}</td>
                                                                    <td>{service.title}</td>
                                                                    <td>{service.slug}</td>
                                                                    <td>{service.status === 1 ? 'Active' : 'Block'}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        )
                                    }

                                    {!loader && services.length === 0 && <Notate />}
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