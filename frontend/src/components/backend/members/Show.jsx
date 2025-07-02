import { Link, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../common/HeaderAdmin';
import Sidebar from '../../common/Sidebar';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminToken, apiUrlAdmin } from '../../common/http';
import Loader from '../../common/Loader';
import Notate from '../../common/Notate';

const Show = () => {
    const { t, i18n } = useTranslation();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);

    const fetchMembers = useCallback(async () => {
        setLoader(true);
        try {
            const response = await fetch(`${apiUrlAdmin}/members`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();
            console.log(result.member);

            if (result.status === 200) {
                setMembers(result.member);
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
        fetchMembers()
    }, [fetchMembers]);

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
                                        <h4>{t('members')}</h4>
                                        <Link to="/admin/members/create" className="btn btn-primary">{t('create')}</Link>
                                    </div>
                                    <hr />

                                    {
                                        loader ? <Loader /> : (
                                            members.length > 0 ? (
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th width="50">ID</th>
                                                            <th>{t('name')}</th>
                                                            <th>{t('job_title')}</th>
                                                            <th width="100">{t('status')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            members.map(member =>
                                                            (
                                                                <tr key={`member-${member.id}`}
                                                                    onClick={() => navigate(`/admin/members/edit/${member.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{member.id}</td>
                                                                    <td>{member.name}</td>
                                                                    <td>{member.job_title}</td>
                                                                    <td>{member.status === 1 ? t('active') : t('block')}</td>
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