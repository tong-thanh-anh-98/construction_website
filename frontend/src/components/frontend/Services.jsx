import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';

import ServiceImg1 from '../../assets/images/construction4.jpg';


const Services = () => {
    return (
        <>
            <Header />
            <Hero
                preHeading='Quality. Integrity. Value'
                heading='Services'
                text='We offer end-to-end construction solutions — from consulting and design to execution and project completion. <br />
                            Backed by a skilled team and streamlined processes, we ensure every project is delivered with high quality, on time, and within budget.'
            />

            {/* Our Services */}
            <section className="section-3 bg-light py-5">
                <div className="container py-5">
                    <div className="section-header text-center">
                        <span>Our Services</span>
                        <h2>Our construction services</h2>
                        <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                    </div>
                    <div className="row pt-4">
                        {[...Array(3)].map((_, index) => (
                            <div className="col-md-4 col-lg-4" key={index}>
                                <div className="item">
                                    <div className="service-image">
                                        <img src={ServiceImg1} alt="" className='w-100' />
                                    </div>

                                    <div className="service-body">
                                        <div className="service-title">
                                            <h3>Specialty Construction</h3>
                                        </div>

                                        <div className="service-content">
                                            <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                                        </div>
                                        <a href="#" className='btn btn-primary small'>Read More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Services