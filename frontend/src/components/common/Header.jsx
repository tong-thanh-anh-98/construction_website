import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    return (
        <header>
            <div className="container py-3">
                <Navbar expand="lg">
                    <Navbar.Brand href="/" className='logo'>
                        Website<span> {t('construction')}</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/" className='nav-link'>{t('home')}</Nav.Link>
                            <Nav.Link href="/about" className='nav-link'>{t('about')}</Nav.Link>
                            <Nav.Link href="/services" className='nav-link'>{t('services')}</Nav.Link>
                            <Nav.Link href="/projects" className='nav-link'>{t('projects')}</Nav.Link>
                            <Nav.Link href="/blogs" className='nav-link'>{t('blogs')}</Nav.Link>
                            <Nav.Link href="/contact" className='nav-link'>{t('contact')}</Nav.Link>

                            {/* Dropdown chọn ngôn ngữ hiển thị từ <Nav.Link> */}
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle as={Nav.Link} className="nav-link">
                                    {t('language')}
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item onClick={() => i18n.changeLanguage('vi')}>{t('vi')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => i18n.changeLanguage('en')}>{t('en')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    )
}

export default Header