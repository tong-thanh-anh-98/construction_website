import Sidebar from '../common/Sidebar';
import Notate from '../common/Notate';
import { useTranslation } from 'react-i18next';
import HeaderAdmin from '../common/HeaderAdmin';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <>
            <HeaderAdmin />
            <main>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>

                        <div className="col-md-9">
                            <div className="card shadow border-0">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between">
                                        <h4 className='h5'>{t('dashboard')}</h4>
                                    </div>
                                    <hr />

                                    <Notate />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard