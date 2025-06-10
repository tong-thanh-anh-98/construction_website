import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import Header from '../common/Header';
import Footer from '../common/Footer';
import About from '../common/About';

import ServiceImg1 from '../../assets/images/construction4.jpg';
import ServiceImg2 from '../../assets/images/construction2.jpg';
import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';
import AvatarImg from '../../assets/images/author-2.jpg';
import BlogImg from '../../assets/images/construction3.jpg';

const Home = () => {
    return (
        <>
            <Header />

            {/* Hero section */}
            <section className="section-1">
                <div className="hero d-flex align-items-center">
                    <div className="container-fluid">
                        <div className="text-center">
                            <span>Welcome to Us</span>
                            <h1>Timeless architecture <br /> where classic charm meets modern sophistication.</h1>
                            <p>
                                We bring your visions to life through exceptional craftsmanship, attention to detail, and a passion for building lasting value.<br />
                            </p>
                            <div className="mt-4">
                                <a className='btn btn-primary large'>Contact Now</a>
                                <a className='btn btn-secondary ms-2 large'>View Projects</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About section */}
            <About />

            {/* Our Services */}
            <section className="section-3 bg-light py-5">
                <div className="container-fluid py-5">
                    <div className="section-header text-center">
                        <span>Our Services</span>
                        <h2>Our construction services</h2>
                        <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                    </div>
                    <div className="row pt-4">
                        {[...Array(4)].map((_, index) => (
                            <div className="col-md-3 col-lg-3" key={index}>
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

            {/* Why choose Us */}
            <section className="section-4">
                <div className="container py-5">
                    <div className="section-header text-center">
                        <span>Why Choose Us</span>
                        <h2>Our construction projects</h2>
                        <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                    </div>
                    <div className="row pt-4">
                        <div className="col-md-4">
                            <div className="card shadow border-0 p-4">
                                <div className="card-icon">
                                    <img src={Icon1} alt="" />
                                </div>
                                <div className="card-title mt-3">
                                    <h3>Cutting-Edge Solutions</h3>
                                </div>
                                <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow border-0 p-4">
                                <div className="card-icon">
                                    <img src={Icon2} alt="" />
                                </div>
                                <div className="card-title mt-3">
                                    <h3>Cutting-Edge Solutions</h3>
                                </div>
                                <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow border-0 p-4">
                                <div className="card-icon">
                                    <img src={Icon3} alt="" />
                                </div>
                                <div className="card-title mt-3">
                                    <h3>Cutting-Edge Solutions</h3>
                                </div>
                                <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Projects */}
            <section className="section-3 bg-light py-5">
                <div className="container-fluid py-5">
                    <div className="section-header text-center">
                        <span>Our Projects</span>
                        <h2>Our construction projects</h2>
                        <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
                    </div>
                    <div className="row pt-4">
                        <div className="col-md-3 col-lg-3">
                            <div className="item">
                                <div className="service-image">
                                    <img src={ServiceImg2} alt="" className='w-100' />
                                </div>

                                <div className="service-body">
                                    <div className="service-title">
                                        <h3>Social Housing – Quality for the Community</h3>
                                    </div>

                                    <div className="service-content">
                                        <p>We are proud to deliver multiple social housing projects aimed at providing safe, comfortable, and sustainable living spaces for low- and middle-income residents. Each project is cost-effective yet maintains high standards of quality and aesthetics.</p>
                                    </div>
                                    <a href="#" className='btn btn-primary small'>Read More</a>
                                </div>
                            </div>
                        </div>
                        {[...Array(3)].map((_, index) => (
                            <div className="col-md-3 col-lg-3" key={index}>
                                <div className="item">
                                    <div className="service-image">
                                        <img src={ServiceImg2} alt="" className='w-100' />
                                    </div>

                                    <div className="service-body">
                                        <div className="service-title">
                                            <h3>Social Housing – Quality for the Community</h3>
                                        </div>

                                        <div className="service-content">
                                            <p>We are proud to deliver multiple social housing projects aimed at providing safe, comfortable, and sustainable living spaces for low- and middle-income residents. Each project is cost-effective yet maintains high standards of quality and aesthetics.</p>
                                        </div>
                                        <a href="#" className='btn btn-primary small'>Read More</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-5 py-5">
                <div className="container">
                    <div className="section-header text-center">
                        <span>Testimonials</span>
                        <h2>What people are saying about us</h2>
                        <p>We always prioritize customer satisfaction. Positive feedback from our partners and clients is a testament to the quality, reliability, and dedication we bring to every project.</p>
                    </div>
                </div>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={50}
                    slidesPerView={3}
                    pagination={{ clickable: true }}
                >
                    {[...Array(5)].map((_, index) => (
                        <SwiperSlide>
                            <div className="card shadow border-0" key={index}>
                                <div className="card-body p-5">
                                    <div className="rating">
                                        {[...Array(5)].map((_, index) => (
                                            <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="content pb-2">
                                        <p>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae molestias nihil excepturi reiciendis repudiandae reprehenderit, accusamus architecto dolore non quaerat tempora veritatis culpa porro, tenetur amet obcaecati eveniet quas alias.
                                        </p>
                                    </div>
                                    <hr />

                                    <div className="d-flex meta">
                                        <div>
                                            <img src={AvatarImg} alt="" width={50} />
                                        </div>
                                        <div className='ps-3'>
                                            <div className='name'>No Name</div>
                                            <div>Architect</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            <section className='section-6 bg-light py-5'>
                <div className="container">
                    <div className="section-header text-center">
                        <span>Blog & New</span>
                        <h2>Latest Updates and Industry Insights</h2>
                        <p>Discover the latest articles, news, and trends in the construction industry. We share real-world insights, technology updates, and professional perspectives from our ongoing projects.</p>
                    </div>
                    <div className="row pt-3">
                        {[...Array(3)].map((_, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card shadow border-0">
                                    <div className="card-img-top">
                                        <img src={BlogImg} alt="" className='w-100' />
                                    </div>

                                    <div className="card-body p-4">
                                        <div className='mb-3'>
                                            <a href="#" className='title'>Blog title</a>
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

export default Home