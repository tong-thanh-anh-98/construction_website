import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const HeaderAdmin = () => {
    const { t, i18n } = useTranslation();
    return (
        <header className="header">
            <div className="container py-3">
                <Navbar expand="lg">
                    <Navbar.Brand href="/" className='logo'>
                        <span>{t('web_tag')}</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle as={Nav.Link} className="nav-link">
                                    {t('select_language')}
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

export default HeaderAdmin