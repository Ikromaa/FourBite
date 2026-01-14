import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Contact from '../../components/Contact/Contact'

const ContactPage = () => {

    useEffect(() => {
            window.scrollTo(0, 0);
        }, [])

    return (
        <>
            <Navbar />
            <Contact />
            <Footer />
        </>
    )
}

export default ContactPage
