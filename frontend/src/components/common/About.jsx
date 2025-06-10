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
                        <span>About Us</span>
                        <h2>Crafting structures that last a lifetime</h2>
                        <p>
                            Crafting structures that last a lifetime. Crafting structures that last a lifetime. Crafting structures that last a lifetime.
                        </p>

                        <p>
                            Crafting structures that last a lifetime. Crafting structures that last a lifetime. Crafting structures that last a lifetime.
                        </p>
                    </div>
                </div>
            </div>
        </ section >
    )
}

export default About