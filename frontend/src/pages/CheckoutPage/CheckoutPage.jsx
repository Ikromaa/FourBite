import React, { useEffect } from 'react'
import Checkout from '../../components/Checkout/Checkout'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const CheckoutPage = () => {

    useEffect(() => {
            window.scrollTo(0, 0);
        }, [])

    return (
        <>
            <Navbar />
            <Checkout />
            <Footer />
        </>
    )
}

export default CheckoutPage
