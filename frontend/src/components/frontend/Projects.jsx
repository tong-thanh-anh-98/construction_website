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
                    preHeading='Building with Vision, Creating with Purpose'
                    heading='Out Project'
                    text='We are proud to showcase our featured projects that reflect our commitment to quality, innovation, and sustainability. <br />
                    From social housing and residential buildings to commercial developments — each project is a testament to our dedication and expertise.'
                />

                {/* Our Projects */}
                <section className="section-3 bg-light py-5">
                    <div className="container py-5">
                        <div className="section-header text-center">
                            <span>Our Projects</span>
                            <h2>Our construction projects</h2>
                            <p>We provide comprehensive construction solutions — from design and execution to project completion. Committed to quality, timeliness, and customer satisfaction.</p>
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
            </main>
            <Footer />
        </>
    )
}

export default Projects