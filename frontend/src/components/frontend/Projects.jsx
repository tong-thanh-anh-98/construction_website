import { useCallback, useEffect, useState } from 'react';
import Header from '../common/Header';
import Hero from '../common/Hero';
import Footer from '../common/Footer';
import { adminToken, apiUrlFront } from '../common/http';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Projects = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);

    const fetchProjects = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-projects`, {
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
                setProjects(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects]);
    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading={t('project_hero_preHeading')}
                    heading={t('project_hero_heading')}
                    text={t('project_hero_text')}
                />

                {/* Our Projects */}
                <section className="section-3 bg-light py-5">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>{t('project_tag')}</span>
                            <h2>{t('project_title')}</h2>
                            <p>{t('project_description')}</p>
                        </div>

                        <div className="row pt-4">
                            {
                                projects && projects.map(project => {
                                    return (
                                        <div className="col-md-4 col-lg-4" key={`project-${project.id}`}>
                                            <div className="item">
                                                <div className="service-image">
                                                    <img
                                                        src={project.image_url}
                                                        alt={project.title}
                                                        className="w-100"
                                                    />
                                                </div>

                                                <div className="service-body">
                                                    <div className="project-title">
                                                        <h3>{project.title}</h3>
                                                    </div>

                                                    <div className="service-content">
                                                        <p>
                                                            {project.short_desc}
                                                        </p>
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
            </main>
            <Footer />
        </>
    )
}

export default Projects