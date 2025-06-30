
import Header from '../common/Header';
import Footer from '../common/Footer';
import About from '../common/About';

import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';
import LatestServices from '../common/LatestServices';
import LatestProjects from '../common/LatestProjects';
import { useTranslation } from 'react-i18next';
import LatestBlog from '../common/LatestBlog';
import ShowTestimonial from '../common/ShowTestimonial';

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <main>
                {/* Hero section */}
                <section className="section-1">
                    <div className="hero d-flex align-items-center">
                        <div className="container-fluid">
                            <div className="text-center">
                                <span>{t('web_tag')}</span>
                                <h1>{t('slogan')}</h1>
                                <p>{t('slogan_desc')}</p>
                                <div className="mt-4">
                                    <a className='btn btn-primary large'>{t('contact')}</a>
                                    <a className='btn btn-primary ms-2 large'>{t('projects')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About section */}
                <About />

                {/* Our Services */}
                <LatestServices />

                {/* Why choose Us */}
                <section className="section-4">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>Vì Sao Chọn Chúng Tôi</span>
                            <h2>Dự án xây dựng tiêu biểu</h2>
                            <p>
                                Chúng tôi mang đến giải pháp xây dựng toàn diện — từ thiết kế đến hoàn thiện. Cam kết chất lượng, đúng tiến độ và sự hài lòng của khách hàng.
                            </p>
                        </div>
                        <div className="row pt-4">
                            <div className="col-md-4">
                                <div className="card shadow border-0 p-4">
                                    <div className="card-icon">
                                        <img src={Icon1} alt="" />
                                    </div>
                                    <div className="card-title mt-3">
                                        <h3>Giải pháp tiên tiến</h3>
                                    </div>
                                    <p>
                                        Chúng tôi cung cấp giải pháp xây dựng toàn diện — từ thiết kế đến thi công hoàn thiện. Cam kết chất lượng, tiến độ và sự hài lòng của khách hàng.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card shadow border-0 p-4">
                                    <div className="card-icon">
                                        <img src={Icon2} alt="" />
                                    </div>
                                    <div className="card-title mt-3">
                                        <h3>Giải pháp tiên tiến</h3>
                                    </div>
                                    <p>
                                        Chúng tôi cung cấp giải pháp xây dựng toàn diện — từ thiết kế đến thi công hoàn thiện. Cam kết chất lượng, tiến độ và sự hài lòng của khách hàng.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card shadow border-0 p-4">
                                    <div className="card-icon">
                                        <img src={Icon3} alt="" />
                                    </div>
                                    <div className="card-title mt-3">
                                        <h3>Giải pháp tiên tiến</h3>
                                    </div>
                                    <p>
                                        Chúng tôi cung cấp giải pháp xây dựng toàn diện — từ thiết kế đến thi công hoàn thiện. Cam kết chất lượng, tiến độ và sự hài lòng của khách hàng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Projects */}
                <LatestProjects />

                {/* Testimonial Section */}
                <ShowTestimonial />

                {/* Blog & New section */}
                <LatestBlog />
            </main>
            <Footer />
        </>
    )
}

export default Home