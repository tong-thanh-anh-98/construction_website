import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { apiUrlFront } from '../common/http';
import { toast } from 'react-toastify';
import ShowTestimonial from '../common/ShowTestimonial';

const ProjectDetail = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const [project, setProject] = useState([]);

    const fetchProject = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-detail-projects/${params.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'x-locale': i18n.language,
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (response.ok && result.status === 200) {
                setProject(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }, [params.id, i18n.language]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return (
        <>
            <Header />

            <Hero />

            <main>
                <section className="section-10">
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card shadow border-0 sidebar">
                                    <div className="card-body px-4 py-4">
                                        <h3 className="mt-2 mb-3">
                                            <strong>{t('insights')}</strong>
                                        </h3>

                                        <ul>
                                            {
                                                project.location &&
                                                <li className='mb-2'>
                                                    <span className='text-body-secondary'>{t('location')}</span>
                                                    <p>{project.location}</p>
                                                </li>
                                            }

                                            {
                                                project.construction_type &&
                                                <li className='mb-2'>
                                                    <span className='text-body-secondary'>{t('construction_type')}</span>
                                                    <p>{t(`${project.construction_type}`)}</p>
                                                </li>
                                            }

                                            {
                                                project.construction_type &&
                                                <li className='mb-2'>
                                                    <span className='text-body-secondary'>{t('sector')}</span>
                                                    <p>{t(`${project.sector}`)}</p>
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div>
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-100"
                                    />
                                </div>

                                <h3 className="py-3">{project.title}</h3>

                                <div dangerouslySetInnerHTML={{ __html: project.content }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-11 bg-light py-5">
                    <ShowTestimonial />
                </section>
            </main>

            <Footer />
        </>
    )
}

export default ProjectDetail