
import Header from '../common/Header';
import Footer from '../common/Footer';
import About from '../common/About';

import LatestServices from '../common/LatestServices';
import LatestProjects from '../common/LatestProjects';
import LatestBlog from '../common/LatestBlog';
import ShowTestimonial from '../common/ShowTestimonial';
import ChooseUs from '../common/ChooseUs';
import SectionHeader from '../common/SectionHeader';

const Home = () => {

    return (
        <>
            <Header />
            <main>
                {/* Section Header */}
                <SectionHeader/>

                {/* Section About */}
                <About />

                {/* Section Services */}
                <LatestServices />

                {/* Section ChooseUs */}
                <ChooseUs />

                {/* Section Projects */}
                <LatestProjects />

                {/* Section Testimonial */}
                <ShowTestimonial />

                {/* Section Blog & New section */}
                <LatestBlog />
            </main>
            <Footer />
        </>
    )
}

export default Home