import { useTranslation } from 'react-i18next';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { adminToken, apiUrlAdmin } from '../../common/http';
import Loader from '../../common/Loader';
import Notate from '../../common/Notate';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../common/HeaderAdmin';

const Show = () => {
    const { t, i18n } = useTranslation();
    const [loader, setLoader] = useState(false);
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    const fetchArticle = useCallback(async () => {
        setLoader(true);

        try {
            const response = await fetch(`${apiUrlAdmin}/articles`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Locale': i18n.language,
                    'Authorization': `Bearer ${adminToken()}`
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (result.status === 200) {
                setArticles(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

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
                                        <h4 className='h5'>{t('articles')}</h4>
                                        <Link to="/admin/articles/create" className="btn btn-primary">{t('create')}</Link>
                                    </div>
                                    <hr />
                                    {
                                        loader ? <Loader /> : (
                                            articles.length > 0 ? (
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th width="50">ID</th>
                                                            <th>{t('title')}</th>
                                                            <th>{t('slug')}</th>
                                                            <th width="100">{t('status')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            articles && articles.map(article =>
                                                            (
                                                                <tr key={`article-${article.id}`}
                                                                    onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <td>#{article.id}</td>
                                                                    <td>{article.title}</td>
                                                                    <td>{article.slug}</td>
                                                                    <td>
                                                                        {article.status === 1 ? t('active') : t('block')}
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
        </>
    )
}

export default Show