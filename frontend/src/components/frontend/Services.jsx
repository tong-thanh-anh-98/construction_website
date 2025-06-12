import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';

import ServiceImg1 from '../../assets/images/construction4.jpg';


const Services = () => {
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
                            {[...Array(3)].map((_, index) => (
                                <div className="col-md-4 col-lg-4" key={index}>
                                    <div className="item">
                                        <div className="service-image">
                                            <img src={ServiceImg1} alt="" className='w-100' />
                                        </div>

                                        <div className="service-body">
                                            <div className="service-title">
                                                <h3>Xây Dựng Chuyên Biệt</h3>
                                            </div>

                                            <div className="service-content">
                                                <p>
                                                    Chúng tôi cung cấp giải pháp thi công chuyên sâu, phù hợp với từng loại công trình. Đảm bảo chất lượng, tiến độ và hiệu quả đầu tư.
                                                </p>
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

export default Services