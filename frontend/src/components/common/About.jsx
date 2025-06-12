import AboutImg from '../../assets/images/about-us.jpg';


const About = () => {
    return (
        < section className="section-2 py-5" >
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <img src={AboutImg} className='w-100' alt="" />
                    </div>

                    <div className="col-md-6">
                        <span>Giới Thiệu</span>
                        <h2>Kiến tạo công trình bền vững</h2>
                        <p>
                            Chúng tôi xây dựng những công trình chất lượng, mang lại giá trị lâu dài cho khách hàng.
                        </p>

                        <p>
                            Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi hiện thực hóa mọi ý tưởng của bạn.
                        </p>
                    </div>
                </div>
            </div>
        </ section >
    )
}

export default About