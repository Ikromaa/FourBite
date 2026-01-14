import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import OurMenu from '../../components/OurMenu/OurMenu'

const Menu = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <Navbar />
            <OurMenu />
            <Footer />
        </>
    )
}

export default Menu


