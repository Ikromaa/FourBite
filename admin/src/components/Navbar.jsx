import React, { useState } from 'react'
import axios from 'axios';
import { navLinks, styles } from '../assets/dummyadmin';
import { GiChefToque } from "react-icons/gi";
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://fourbite-backend.onrender.com';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/admin/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error('Admin logout error:', err);
        }
        localStorage.removeItem('adminSession');
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
                        className={styles.logoutBtn}
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
                        className={`${styles.logoutBtn} w-full`}
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
