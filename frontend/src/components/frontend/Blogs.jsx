import Footer from '../common/Footer';
import Header from '../common/Header';
import Hero from '../common/Hero';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { apiUrlFront } from '../common/http';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const Blogs = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState([]);

    const fetchArticles = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-all-articles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (result.status === 200) {
                setArticles(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchArticles()
    }, [fetchArticles]);

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading={t('article_pre_heading')}
                    heading={t('article_heading')}
                    text={t('article_text')}
                />

                <section className='section-6 bg-light py-5'>
                    <div className="container">
                        <div className="section-header text-center">
                            <span>{t('article_tag')}</span>
                            <h2>{t('article_title')}</h2>
                            <p>{t('article_description')}</p>
                        </div>
                        <div className="row pt-3">
                            {
                                articles && articles.map(article => {
                                    return (
                                        <div className="col-md-4 mb-3" key={`article-${article.id}`}>
                                            <div className="card shadow border-0">
                                                <div className="card-img-top">
                                                    <img
                                                        src={article.image_url}
                                                        alt={article.title}
                                                        className="w-100"
                                                    />
                                                </div>

                                                <div className="card-body p-4">
                                                    <div className='mb-3'>
                                                        <Link to={`/articles/${article.id}`} className='title'>{article.title}</Link>
                                                    </div>

                                                    <Link to={`/articles/${article.id}`} className='btn btn-primary small'>{t('see_more')}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Blogs