import React from 'react'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom'
import Footer from '../../common/Footer'
import Header from '../../common/Header'

const Edit = () => {
    return (
        <>
            <Header />
            <main>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-3">
                            {/* Sidebar */}
                            <Sidebar />
                        </div>

                        <div className="col-md-9">
                            {/* Dashboard */}
                            <div className="card shadow border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className='h5'><Link to="/admin/services">Services</Link> / Edit</h4>
                                        {/* <Link to="/admin/services" className="btn btn-primary">Back</Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Edit