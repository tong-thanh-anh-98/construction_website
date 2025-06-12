import BlogImg from '../../assets/images/construction3.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Hero from '../common/Hero';


const Blogs = () => {
    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading="Góc Nhìn Mới"
                    heading="Blog & Tin Tức"
                    text="Khám phá góc nhìn chuyên gia, cập nhật dự án và xu hướng ngành. Đón đọc những thông tin mới nhất từ Amazing Constructions."
                />

                <section className='section-6 bg-light py-5'>
                    <div className="container">
                        <div className="section-header text-center">
                            <span>Blog & Tin Tức</span>
                            <h2>Cập Nhật Mới Nhất & Góc Nhìn Ngành</h2>
                            <p>
                                Cùng khám phá những bài viết, tin tức và xu hướng mới trong ngành xây dựng. Chúng tôi chia sẻ góc nhìn thực tế, cập nhật công nghệ và kinh nghiệm từ các dự án đang triển khai.
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
                                            <a href="#" className='btn btn-primary small'>Xem thêm</a>
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

export default Blogs