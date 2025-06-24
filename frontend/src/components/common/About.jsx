import AboutImg from '../../assets/images/about-us.jpg';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();

    return (
        < section className="section-2 py-5" >
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <img src={AboutImg} className='w-100' alt="" />
                    </div>

                    <div className="col-md-6">
                        <span>{t('about_tag')}</span>
                        <h2>{t('about_title')}</h2>
                        <p>{t('about_description_1')}</p>
                        <p>{t('about_description_2')}</p>
                    </div>
                </div>
            </div>
        </ section >
    )
}

export default About