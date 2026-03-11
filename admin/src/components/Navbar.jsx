import React, { useState } from 'react'
import { navLinks, styles } from '../assets/dummyadmin';
import { GiChefToque } from "react-icons/gi";
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.navContainer}>
                <div className={styles.logoSection}>
                    <GiChefToque className={styles.logoIcon} />
                    <span className={styles.logoText}>Admin Panel</span>
                </div>

                {/* Hamburger button - mobile only */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={styles.menuButton}
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Desktop menu */}
                <div className={styles.desktopMenu}>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) =>
                                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`
                            }
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}

                    {/* Logout - desktop */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all border-red-900/40 text-red-300 hover:border-red-500 hover:bg-red-900/20"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`
                            }
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </NavLink>
                    ))}

                    {/* Logout - mobile */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all border-red-900/40 text-red-300 hover:border-red-500 hover:bg-red-900/20 w-full"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar
