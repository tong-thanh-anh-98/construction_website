import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import Footer from '../../common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminToken, apiUrlAdmin } from '../../common/http';
import { toast } from 'react-toastify';
import Notate from '../../common/Notate';
import Loader from '../../common/Loader';
import { useTranslation } from 'react-i18next';

const Show = () => {
    const [loader, setLoader] = useState(false);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchProjects = async () => {
        setLoader(true);
        try {
            const response = await fetch(`${apiUrlAdmin}/projects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();

            if (result.status === 200) {
                setProjects(result.data);
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
        fetchProjects()
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
                                        <h4 className='h5'>{t('projects')}</h4>
                                        <Link to="/admin/projects/create" className="btn btn-primary">{t('create')}</Link>
                                    </div>
                                    <hr />
                                    {
                                        loader ? <Loader /> : (
                                            projects.length > 0 ? (
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
                                                            projects.map(project =>
                                                            (
                                                                <tr key={`project-${project.id}`}
                                                                    onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{project.id}</td>
                                                                    <td>{project.title}</td>
                                                                    <td>{project.slug}</td>
                                                                    <td>
                                                                        {project.status === 1 ? t('active') : t('block')}
                                                                    </td>
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