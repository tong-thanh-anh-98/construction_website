import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { useTranslation } from 'react-i18next';

import { adminToken, apiUrlFront } from '../common/http';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const Services = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-all-services`, {
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
        }
    }

    useEffect(() => {
        fetchServices()
    }, []);

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading={t('service_pre_heading')}
                    heading={t('service_heading')}
                    text={t('service_hero_text')}
                />

                {/* Our Services */}
                <section className="section-3 bg-light py-5">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>{t('service_tag')}</span>
                            <h2>{t('service_title')}</h2>
                            <p>{t('service_description')}</p>
                        </div>

                        <div className="row pt-4">
                            {
                                services && services.map(service => {
                                    return (
                                        <div className="col-md-4 col-lg-4" key={`service-${service.id}`}>
                                            <div className="item">
                                                <div className="service-image">
                                                    <img
                                                        src={service.image_url}
                                                        alt={service.title}
                                                        className="w-100"
                                                    />
                                                </div>

                                                <div className="service-body">
                                                    <div className="service-title">
                                                        <h3>{service.title}</h3>
                                                    </div>

                                                    <div className="service-content">
                                                        <p>
                                                            {service.short_desc}
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

export default Services