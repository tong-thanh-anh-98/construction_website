import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { adminToken, apiUrlFront } from './http';
import { toast } from 'react-toastify';

const LatestBlog = () => {
    const { t, i18n } = useTranslation();
    const [articles, setArticles] = useState([]);

    const fetchArticles = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-latest-articles?limit=3`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
        } catch (err) {
            console.error(err);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchArticles()
    }, [fetchArticles]);

    return (
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
                                <div className="col-md-4" key={`article-${article.id}`}>
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
                                                <a href="#" className='title'>{article.title}</a>
                                            </div>
                                            <a href="#" className='btn btn-primary small'>{t('see_more')}</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default LatestBlog