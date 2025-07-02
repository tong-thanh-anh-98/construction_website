import { useTranslation } from 'react-i18next';

const SectionHeader = () => {
    const { t } = useTranslation();

    return (
        <section className="section-1">
            <div className="hero d-flex align-items-center">
                <div className="container-fluid">
                    <div className="text-center">
                        <span>{t('web_tag')}</span>
                        <h1>{t('slogan')}</h1>
                        <p>{t('slogan_desc')}</p>
                        <div className="mt-4">
                            <a className='btn btn-primary large'>{t('contact')}</a>
                            <a className='btn btn-primary ms-2 large'>{t('projects')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionHeader