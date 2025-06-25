import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import Header from '../common/Header';
import Footer from '../common/Footer';
import About from '../common/About';

import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';
import AvatarImg from '../../assets/images/author-2.jpg';
import BlogImg from '../../assets/images/construction3.jpg';
import LatestServices from '../common/LatestServices';
import LatestProjects from '../common/LatestProjects';
import { useTranslation } from 'react-i18next';

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

                <section className="section-5 py-5">
                    <div className="container">
                        <div className="section-header text-center">
                            <span>Khách Hàng Nói Gì</span>
                            <h2>Những đánh giá về chúng tôi</h2>
                            <p>
                                Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu. Những phản hồi tích cực từ đối tác và khách hàng là minh chứng cho chất lượng, uy tín và sự tận tâm trong từng dự án.
                            </p>
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
                                                Chúng tôi rất hài lòng với chất lượng và tiến độ thi công. Đội ngũ làm việc chuyên nghiệp, luôn lắng nghe và đáp ứng đúng yêu cầu thiết kế của chúng tôi.
                                            </p>
                                        </div>
                                        <hr />

                                        <div className="d-flex meta">
                                            <div>
                                                <img src={AvatarImg} alt="" width={50} />
                                            </div>
                                            <div className='ps-3'>
                                                <div className='name'>Họ Và Tên</div>
                                                <div>Khách hàng</div>
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
                            <span>Blog & Tin Tức</span>
                            <h2>Cập nhật mới nhất & góc nhìn chuyên ngành</h2>
                            <p>
                                Khám phá những bài viết, tin tức và xu hướng mới trong ngành xây dựng. Chúng tôi chia sẻ góc nhìn thực tế, công nghệ mới và kinh nghiệm từ các dự án đang triển khai.
                            </p>
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
                                                <a href="#" className='title'>Tiêu đề bài viết</a>
                                            </div>
                                            <a href="#" className='btn btn-primary small'>Xem Thêm</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Home