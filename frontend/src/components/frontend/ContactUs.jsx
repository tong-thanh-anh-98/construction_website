import React, { useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'


const ContactUs = () => {
    const [disable] = useState(false);

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading='Get in Touch'
                    heading='Contact Us'
                    text='Have a question or a project in mind? We’re here to help. Reach out to our team and let’s build something great together.'
                />

                <section className="section-9 py-5">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2>Liên Hệ</h2>
                            <p>
                                Bạn có câu hỏi hoặc dự án cần thực hiện? Chúng tôi luôn sẵn sàng hỗ trợ. Hãy liên hệ để cùng nhau tạo nên những công trình tuyệt vời.
                            </p>
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-3">
                                <div className="card shadow border-0 mb-3">
                                    <div className="card-body p-4">
                                        <h3>Gọi ngay</h3>
                                        <div>
                                            <a href="#">0989.890.123</a>
                                        </div>
                                        <div>
                                            <a href="#">0989.890.456</a>
                                        </div>

                                        <h3 className='mt-4'>Gửi email cho chúng tôi</h3>
                                        <div>
                                            <a href="#">contact@construction.com</a>
                                        </div>
                                        <div>
                                            <a href="#">contact@construction.vn</a>
                                        </div>

                                        <h3 className='mt-4'>Địa chỉ</h3>
                                        <div>
                                            133 Quang Trung, <br /> Quận Gò Vấp, TP. Hồ Chí Minh
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-9">
                                <div className="card shadow border-0">
                                    <div className="card-body p-5">
                                        <form action="#">
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>Name</label>
                                                    <input type="text" className='form-control form-control-lg' placeholder='Enter name' />
                                                </div>

                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>Email</label>
                                                    <input type="text" className='form-control form-control-lg' placeholder='Enter email' />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>Phone</label>
                                                    <input type="text" className='form-control form-control-lg' placeholder='Enter phone' />
                                                </div>

                                                <div className="col-md-6 mb-4">
                                                    <label htmlFor="" className='form-label'>Subject</label>
                                                    <input type="text" className='form-control form-control-lg' placeholder='Enter subject' />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className='mb-3'>
                                                    <label htmlFor='' className='form-label'>Message</label>
                                                    <textarea name="message" id="message" rows={5} className='form-control form-control-lg' placeholder='Enter message'></textarea>
                                                </div>
                                            </div>

                                            <button disabled={disable} type="submit" className="btn btn-primary large mt-3">
                                                {disable ? 'Sending...' : 'Send'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default ContactUs