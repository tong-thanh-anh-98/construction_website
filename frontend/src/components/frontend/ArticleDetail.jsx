import Header from '../common/Header';
import Footer from '../common/Footer';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { apiUrlFront } from '../common/http';
import Hero from '../common/Hero';
import { toast } from 'react-toastify';

const ArticleDetail = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const [article, setArticle] = useState([]);
    const [latestArticles, setLatestArticles] = useState([]);

    const fetchLatestArticles = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-latest-articles?limit=10`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-locale': i18n.language
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (result.status === 200) {
                setLatestArticles(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [i18n.language]);

    const fetchArticle = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-detail-articles/${params.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-locale': i18n.language
                }
            });
            const result = await response.json();
            console.log(result.data);
            if (result.status === 200) {
                setArticle(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error)
        }
    }, [params.id, i18n.language])

    useEffect(() => {
        fetchLatestArticles();
        fetchArticle();
    }, [fetchLatestArticles, fetchArticle]);

    return (
        <>
            <Header />
            <Hero />
            <main>
                <section className="section-11">
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-8">
                                <h2>{article.title}</h2>
                                <div className="pb-3">
                                    {t('by')} <strong>{article.author}</strong> {t('on')} {
                                        article.formatted_date
                                    }
                                </div>

                                <div className="pe-md-5 pb-3">
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-100"
                                    />
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
                            </div>

                            <div className="col-md-4">
                                <div className="card shadow border-0 sidebar">
                                    <div className="card-body px-5 py-5">
                                        <h3 className="mt-2 mb-3">Latest Blogs</h3>
                                        {
                                            latestArticles && latestArticles.map(article => {
                                                return (
                                                    <div className="d-flex border-bottom mb-3 pb-2">
                                                        <div className="pe-3 pb-2">
                                                            <Link to={`/articles/${article.id}`} className='title'>
                                                                <img
                                                                    width={100}
                                                                    src={article.image_url}
                                                                    alt={article.title}
                                                                />
                                                            </Link>
                                                        </div>

                                                        <Link to={`/articles/${article.id}`} className='title'>{article.title}</Link>
                                                        <hr />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default ArticleDetail