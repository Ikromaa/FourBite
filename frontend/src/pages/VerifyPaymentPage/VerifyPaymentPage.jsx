import React, { useEffect, useState } from 'react'
import { useCart } from '../../cartContext/cartContext'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://fourbite-backend.onrender.com';

const VerifyPaymentPage = () => {

    const { clearCart } = useCart();
    const { search } = useLocation();
    const navigate = useNavigate();
    const [statusMsg, setStatusMsg] = useState('Verifying Payment...')

    // PAYMENT GATEWAY OPENING
    useEffect(() => {
        const params = new URLSearchParams(search);
        const orderId = params.get('order_id') || params.get('orderId');
        const transactionStatus = params.get('transaction_status');

        if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
            setStatusMsg('Pembayaran gagal. Mengarahkan kembali ke checkout...');
            navigate('/checkout', { replace: true });
            return;
        }

        if (!orderId) {
            setStatusMsg('Referensi pembayaran tidak ditemukan. Membuka riwayat order...');
            navigate('/myorder', { replace: true });
            return;
        }

        axios.get(`${API_URL}/api/orders/payment-status/${orderId}`, {
            withCredentials: true
        })
        .then(({ data }) => {
            if (data.paymentStatus === 'success') {
                clearCart();
            }
            navigate('/myorder', { replace: true });
        })
        .catch(err => {
            console.error('Payment verification error:', err)
            setStatusMsg('Terjadi kesalahan saat verifikasi pembayaran.');
        })
    }, [search, clearCart, navigate])


    return (
        <div className=' min-h-screen flex items-center justify-center text-white'>
            <p>{statusMsg}</p>
        </div>
    )
}

export default VerifyPaymentPage
