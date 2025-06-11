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
                    preHeading='Latest Insights'
                    heading='Blogs & New'
                    text='Explore expert opinions, project updates, and industry trends. Stay informed with the latest from Amazing Constructions.'
                />

                <section className='section-6 bg-light py-5'>
                    <div className="container">
                        <div className="section-header text-center">
                            <span>Blog & New</span>
                            <h2>Latest Updates and Industry Insights</h2>
                            <p>Discover the latest articles, news, and trends in the construction industry. We share real-world insights, technology updates, and professional perspectives from our ongoing projects.</p>
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
                                                <a href="#" className='title'>Blog title</a>
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

export default Blogs