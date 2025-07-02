import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-dark text-white py-4">
            <div className="container text-center small">
                <p className="mb-2">
                    <strong>{t('footer_about_title')}</strong> — {t('footer_about_text')}
                </p>
                <p className="mb-2">
                    {t('footer_contact_phone')} | {t('footer_contact_email')} | {t('footer_contact_address')}
                </p>
                <p className="mb-0 text-white-50">
                    {t('footer_copyright')}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
