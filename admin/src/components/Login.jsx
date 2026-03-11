import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiChefToque } from 'react-icons/gi';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://fourbite-backend.onrender.com';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/admin/login`, form);
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a120b 0%, #2a1e14 50%, #3e2b1d 100%)',
        }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '0 1rem' }}>
                {/* Card */}
                <div style={{
                    background: '#2D1B0E',
                    borderRadius: '1.25rem',
                    padding: '2.25rem 2rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(180,100,20,0.3)',
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <GiChefToque style={{
                            fontSize: '3rem',
                            color: '#f59e0b',
                            marginBottom: '0.5rem',
                        }} />
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#f59e0b',
                            margin: '0',
                            letterSpacing: '0.01em',
                        }}>
                            FourBite
                        </h1>
                        <p style={{ color: 'rgba(251,191,36,0.5)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                            Admin Dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Email */}
                        <div style={{ position: 'relative' }}>
                            <FaUser style={{
                                position: 'absolute', left: '1rem', top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#f59e0b', fontSize: '0.9rem',
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                                    background: '#3a2510',
                                    border: '1px solid rgba(180,100,20,0.3)',
                                    borderRadius: '0.75rem',
                                    color: '#fef3c7',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: 'relative' }}>
                            <FaLock style={{
                                position: 'absolute', left: '1rem', top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#f59e0b', fontSize: '0.9rem',
                            }} />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                                    background: '#3a2510',
                                    border: '1px solid rgba(180,100,20,0.3)',
                                    borderRadius: '0.75rem',
                                    color: '#fef3c7',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.12)',
                                border: '1px solid rgba(239,68,68,0.35)',
                                borderRadius: '0.65rem',
                                padding: '0.65rem 1rem',
                                color: '#fca5a5',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.9rem',
                                background: loading
                                    ? 'rgba(180,100,20,0.4)'
                                    : 'linear-gradient(to right, #f59e0b, #d97706)',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: '#2D1B0E',
                                fontWeight: '800',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(245,158,11,0.3)',
                                marginTop: '0.25rem',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                        >
                            {loading ? 'Sedang masuk...' : 'Sign In'}
                            {!loading && <FaArrowRight />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
