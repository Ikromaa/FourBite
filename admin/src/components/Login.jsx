import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GiChefToque } from 'react-icons/gi';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

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
        <div className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}>
            <div className="w-full max-w-md px-4">
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}>
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '50%',
                            width: '64px',
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            boxShadow: '0 8px 25px rgba(245,158,11,0.4)',
                        }}>
                            <GiChefToque style={{ fontSize: '2rem', color: '#1a1a2e' }} />
                        </div>
                        <h1 style={{ color: '#fbbf24', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                            FourBite Admin
                        </h1>
                        <p style={{ color: 'rgba(251,191,36,0.5)', fontSize: '0.9rem' }}>
                            Masuk untuk mengelola dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{ color: '#fbbf24', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Email Admin
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{
                                    position: 'absolute', left: '1rem', top: '50%',
                                    transform: 'translateY(-50%)', color: '#f59e0b'
                                }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@fourbite.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(251,191,36,0.25)',
                                        borderRadius: '0.75rem',
                                        color: '#fef3c7',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ color: '#fbbf24', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{
                                    position: 'absolute', left: '1rem', top: '50%',
                                    transform: 'translateY(-50%)', color: '#f59e0b'
                                }} />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(251,191,36,0.25)',
                                        borderRadius: '0.75rem',
                                        color: '#fef3c7',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.4)',
                                borderRadius: '0.75rem',
                                padding: '0.75rem 1rem',
                                color: '#fca5a5',
                                fontSize: '0.875rem',
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
                                padding: '0.875rem',
                                background: loading
                                    ? 'rgba(245,158,11,0.4)'
                                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: '#1a1a2e',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: loading ? 'none' : '0 4px 15px rgba(245,158,11,0.35)',
                                marginTop: '0.5rem',
                            }}
                        >
                            <FiLogIn />
                            {loading ? 'Sedang masuk...' : 'Masuk ke Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
