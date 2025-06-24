import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-3">
                        <h3 className='mb-3'>Giới Thiệu</h3>
                        <div className="pe-5">
                            <p>
                                Chúng tôi cung cấp giải pháp xây dựng trọn gói — từ thiết kế, thi công đến hoàn thiện. Cam kết chất lượng, đúng tiến độ và sự hài lòng của khách hàng.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Dịch Vụ</h3>
                        <ul>
                            <li><a href="">Thiết kế kiến trúc & nội thất</a></li>
                            <li><a href="">Xây dựng dân dụng & công nghiệp</a></li>
                            <li><a href="">Quản lý & giám sát dự án</a></li>
                            <li><a href="">Cải tạo & sửa chữa công trình</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Liên Kết Nhanh</h3>
                        <ul>
                            <li><a href="">Giới Thiệu</a></li>
                            <li><a href="">Dịch Vụ</a></li>
                            <li><a href="">Dự Án</a></li>
                            <li><a href="">Tin Tức</a></li>
                            <li><a href="">Liên Hệ</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Liên Hệ</h3>
                        <ul>
                            <li><a href="">Hotline: 0909 123 456</a></li>
                            <li><a href="">Email: contact@constructions.vn</a></li>
                            <li><a href="">Địa chỉ: Quận Gò Vấp, TP. Hồ Chí Minh</a></li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p className='text-center pt-4'>Copyright © 2025 | Construction Solution Company</p>
            </div>
        </footer>
    )
}

export default Footer