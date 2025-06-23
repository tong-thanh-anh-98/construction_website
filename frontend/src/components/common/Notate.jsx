import { useTranslation } from 'react-i18next';

const Notate = ({ text }) => {
    const { t } = useTranslation();

    return (
        <div className='text-center py-5 text-muted'>
            {text || t('notate')}
        </div>
    );
};

export default Notate;
