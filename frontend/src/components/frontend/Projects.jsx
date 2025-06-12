import React from 'react'
import Header from '../common/Header'
import Hero from '../common/Hero'
import Footer from '../common/Footer'

import ServiceImg2 from '../../assets/images/construction2.jpg';


const Projects = () => {
    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading="Kiến Tạo Tương Lai, Dẫn Đầu Chất Lượng"
                    heading="Dấu Ấn Từ Những Dự Án Nổi Bật"
                    text="Mỗi công trình là minh chứng cho năng lực vượt trội và cam kết không ngừng về chất lượng, sáng tạo và bền vững. <br />
    Từ nhà ở xã hội đến dự án thương mại cao cấp — chúng tôi không chỉ xây dựng, mà còn kiến tạo giá trị dài lâu cho cộng đồng và đối tác."
                />

                {/* Our Projects */}
                <section className="section-3 bg-light py-5">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>Dự Án Tiêu Biểu</span>
                            <h2>Những Công Trình Chúng Tôi Đã Thực Hiện</h2>
                            <p>
                                Chúng tôi mang đến giải pháp xây dựng toàn diện — từ thiết kế, thi công đến bàn giao hoàn thiện. Cam kết chất lượng, đúng tiến độ và sự hài lòng tuyệt đối từ khách hàng là ưu tiên hàng đầu.
                            </p>
                        </div>

                        <div className="row pt-4">
                            {[...Array(3)].map((_, index) => (
                                <div className="col-md-4 col-lg-4" key={index}>
                                    <div className="item">
                                        <div className="service-image">
                                            <img src={ServiceImg2} alt="" className='w-100' />
                                        </div>

                                        <div className="service-body">
                                            <div className="service-title">
                                                <h3>Nhà Ở Xã Hội – Chất Lượng Vì Cộng Đồng</h3>
                                            </div>

                                            <div className="service-content">
                                                <p>
                                                    Chúng tôi tự hào thực hiện nhiều dự án nhà ở xã hội nhằm mang đến không gian sống an toàn, tiện nghi và bền vững cho người dân có thu nhập thấp và trung bình. Mỗi công trình đều tối ưu chi phí nhưng vẫn đảm bảo chất lượng và thẩm mỹ vượt trội.
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

export default Projects