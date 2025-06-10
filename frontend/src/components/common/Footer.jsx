import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-3">
                        <h3 className='mb-3'>Constructions Website</h3>
                        <div className="pe-5">
                            <p>
                                We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Our Services</h3>
                        <ul>
                            <li><a href="">Architectural & interior design</a></li>
                            <li><a href="">Residential & industrial construction</a></li>
                            <li><a href="">Project management & supervision</a></li>
                            <li><a href="">Renovation & repair works</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Quick Links</h3>
                        <ul>
                            <li><a href="">About Us</a></li>
                            <li><a href="">Services</a></li>
                            <li><a href="">Projects</a></li>
                            <li><a href="">Blogs</a></li>
                            <li><a href="">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>Contact Us</h3>
                        <ul>
                            <li><a href="">Hotline: 0909 123 456</a></li>
                            <li><a href="">Email: contact@constructions.vn</a></li>
                            <li><a href="">Address: Go Vap District, Ho Chi Minh City</a></li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p className='text-center pt-4'>Copyright © 2025 Constructions Website. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer