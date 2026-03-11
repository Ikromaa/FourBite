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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d]">
            <div className="w-full max-w-md px-4">
                {/* Card */}
                <div className="bg-[#2D1B0E] rounded-2xl p-9 shadow-2xl border border-[rgba(180,100,20,0.3)]">

                    {/* Header - benar-benar center */}
                    <div className="flex flex-col items-center text-center mb-7">
                        <GiChefToque className="text-5xl text-amber-400 mb-2" />
                        <h1 className="text-3xl font-extrabold text-amber-400 tracking-wide m-0">
                            FourBite
                        </h1>
                        <p className="text-amber-400/50 text-sm mt-1">Admin Dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 text-sm" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                className="w-full py-3 pl-11 pr-4 bg-[#3a2510] border border-[rgba(180,100,20,0.3)] rounded-xl text-amber-100 placeholder-amber-400/40 text-sm outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 text-sm" />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="w-full py-3 pl-11 pr-4 bg-[#3a2510] border border-[rgba(180,100,20,0.3)] rounded-xl text-amber-100 placeholder-amber-400/40 text-sm outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#2D1B0E] text-base transition-transform
                                ${loading
                                    ? 'bg-amber-400/40 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-amber-400 to-amber-600 hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-900/30'
                                }`}
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
