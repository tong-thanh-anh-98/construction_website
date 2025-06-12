import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
    return (
        <header>
            <div className="container py-3">
                <Navbar expand="lg">
                    <Navbar.Brand href="/" className='logo'>
                        <span>Constructions </span> Website
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/" className='nav-link'>Trang chủ</Nav.Link>
                            <Nav.Link href="/about" className='nav-link'>Giới Thiệu</Nav.Link>
                            <Nav.Link href="/services" className='nav-link'>Dịch Vụ</Nav.Link>
                            <Nav.Link href="/projects" className='nav-link'>Dự Án</Nav.Link>
                            <Nav.Link href="/blogs" className='nav-link'>Blog & Tin Tức</Nav.Link>
                            <Nav.Link href="/contact" className='nav-link'>Liên Hệ</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    )
}

export default Header