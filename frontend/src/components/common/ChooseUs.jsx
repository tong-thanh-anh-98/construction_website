import { useTranslation } from 'react-i18next';
import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';

const ChooseUs = () => {
    const {t} = useTranslation();
    return (
        <section className="section-4">
            <div className="container py-5">
                <div className="section-header text-center">
                    <span>{t('choose_us_tag')}</span>
                    <h2>{t('choose_us_title')}</h2>
                    <p>{t('choose_us_description')}</p>
                </div>
                <div className="row pt-4">
                    <div className="col-md-4">
                        <div className="card shadow border-0 p-4">
                            <div className="card-icon">
                                <img src={Icon1} alt="" />
                            </div>
                            <div className="card-title mt-3">
                                <h3>{t('choose_us_content_title_1')}</h3>
                            </div>
                            <p>{t('choose_us_content_description_1')}</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow border-0 p-4">
                            <div className="card-icon">
                                <img src={Icon2} alt="" />
                            </div>
                            <div className="card-title mt-3">
                                <h3>{t('choose_us_content_title_2')}</h3>
                            </div>
                            <p>{t('choose_us_content_description_2')}</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow border-0 p-4">
                            <div className="card-icon">
                                <img src={Icon3} alt="" />
                            </div>
                            <div className="card-title mt-3">
                                <h3>{t('choose_us_content_title_3')}</h3>
                            </div>
                            <p>{t('choose_us_content_description_3')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChooseUs