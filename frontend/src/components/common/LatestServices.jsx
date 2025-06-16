import { useEffect, useState } from 'react';
import ServiceImg1 from '../../assets/images/construction4.jpg';
import { adminToken, apiUrlFile, apiUrlFront } from './http';
import { toast } from 'react-toastify';

const LatestServices = () => {
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
                    <span>Dịch Vụ</span>
                    <h2>Dịch vụ xây dựng của chúng tôi</h2>
                    <p>
                        Chúng tôi cung cấp giải pháp xây dựng toàn diện — từ thiết kế, thi công đến hoàn thiện. Cam kết chất lượng, đúng tiến độ và sự hài lòng của khách hàng.
                    </p>
                </div>
                <div className="row pt-4">
                    {
                        services && services.map(service => {
                            return (
                                <div className="col-md-3 col-lg-3" key={`service-${service.id}`}>
                                    <div className="item">
                                        <div className="service-image">
                                            <img
                                                src={
                                                    service.image
                                                        ? `${apiUrlFile}/uploads/services/small/${service.image}`
                                                        : `${apiUrlFile}/uploads/images/no_img.jpg`
                                                }
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
                                            <a href="#" className="btn btn-primary small">Xem thêm</a>
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