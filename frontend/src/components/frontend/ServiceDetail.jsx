import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { apiUrlFront } from '../common/http';
import { toast } from 'react-toastify';
import ShowTestimonial from '../common/ShowTestimonial';

const ServiceDetail = () => {
    const { i18n } = useTranslation();
    const params = useParams();
    const [service, getService] = useState([]);
    const [services, getServices] = useState([]);

    const fetchServices = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-all-services`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Locale': i18n.language,
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (response.ok && result.status === 200) {
                getServices(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }, [i18n.language]);

    const fetchService = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-detail-services/${params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Locale': i18n.language,
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (response.ok && result.status === 200) {
                getService(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }, [params.id, i18n.language]);

    useEffect(() => {
        fetchService();
        fetchServices();
    }, [fetchService, fetchServices]);

    return (
        <>
            <Header />

            <Hero
                preHeading=''
                heading=''
                text=''
            />

            <main>
                <div className="section-10">
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card shadow border-0 sidebar">
                                    <div className="card-body px-4 py-4">
                                        <h3 className="mt-2 mb-3">
                                            <strong>Our Service</strong>
                                        </h3>
                                        <ul>
                                            {
                                                services && services.map(service => {
                                                    return (
                                                        <li key={`service-${service.id}`}>
                                                            <Link to={`/services/${service.id}`}>{service.title}</Link>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div>
                                    <img
                                        src={service.image_url}
                                        alt={service.title}
                                        className="w-100"
                                    />
                                </div>

                                <h3 className="py-3">{service.title}</h3>

                                <div dangerouslySetInnerHTML={{ __html: service.content }}></div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ShowTestimonial />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default ServiceDetail