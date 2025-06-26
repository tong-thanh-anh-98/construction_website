import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-3">
                        <h3 className='mb-3'>{t('footer_about_title')}</h3>
                        <div className="pe-5">
                            <p>{t('footer_about_text')}</p>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>{t('footer_services_title')}</h3>
                        <ul>
                            <li><a href="">{t('footer_service_1')}</a></li>
                            <li><a href="">{t('footer_service_2')}</a></li>
                            <li><a href="">{t('footer_service_3')}</a></li>
                            <li><a href="">{t('footer_service_4')}</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>{t('footer_links_title')}</h3>
                        <ul>
                            <li><a href="">{t('footer_link_about')}</a></li>
                            <li><a href="">{t('footer_link_services')}</a></li>
                            <li><a href="">{t('footer_link_projects')}</a></li>
                            <li><a href="">{t('footer_link_news')}</a></li>
                            <li><a href="">{t('footer_link_contact')}</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h3 className='mb-3'>{t('footer_contact_title')}</h3>
                        <ul>
                            <li><a href="">{t('footer_contact_phone')}</a></li>
                            <li><a href="">{t('footer_contact_email')}</a></li>
                            <li><a href="">{t('footer_contact_address')}</a></li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p className='text-center pt-4'>{t('footer_copyright')}</p>
            </div>
        </footer>
    )
}

export default Footer