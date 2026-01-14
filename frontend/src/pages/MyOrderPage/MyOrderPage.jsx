import React, { useEffect } from 'react'
import MyOrder from '../../components/MyOrder/MyOrder'

import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const MyOrderPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <Navbar />
            <MyOrder />
            <Footer />
        </>
    )
}

export default MyOrderPage
