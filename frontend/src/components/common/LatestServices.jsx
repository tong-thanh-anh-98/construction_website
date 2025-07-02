import { useEffect, useState } from 'react';
import { adminToken, apiUrlFront } from './http';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LatestServices = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);

    const fetchLatestServices = async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-latest-services?limit=4`, {
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
        fetchLatestServices()
    }, []);

    return (
        <section className="section-3 bg-light py-5">
            <div className="container-fluid py-5">
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
                                            <Link to={`/services/${service.id}`} className="btn btn-primary small">{t('see_more')}</Link>
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

export default LatestServices