import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';

import { adminToken, apiUrlFront } from '../common/http';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const Services = () => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-services`, {
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
                    preHeading='Chất Lượng. Uy Tín. Giá Trị.'
                    heading='Dịch Vụ'
                    text='Chúng tôi cung cấp giải pháp xây dựng trọn gói — từ tư vấn, thiết kế đến thi công và bàn giao. <br />
                        Với đội ngũ chuyên nghiệp và quy trình tối ưu, mỗi dự án đều được hoàn thiện đúng tiến độ, chất lượng và ngân sách.'
                />

                {/* Our Services */}
                <section className="section-3 bg-light py-5">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>Dịch Vụ</span>
                            <h2>Giải Pháp Xây Dựng Toàn Diện</h2>
                            <p>
                                Chúng tôi cung cấp dịch vụ xây dựng từ thiết kế đến thi công hoàn thiện. Cam kết chất lượng, đúng tiến độ và sự hài lòng của khách hàng là ưu tiên hàng đầu.
                            </p>
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
                                                    <a href="#" className='btn btn-primary small'>Xem Thêm</a>
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