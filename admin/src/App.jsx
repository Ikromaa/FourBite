import React from 'react'
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import AddItem from './components/AddItem'
import List from './components/List'
import Order from './components/Order'
import Login from './components/Login'
import AdminRoute from './components/AdminRoute'

const App = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
      <>
        {!isLoginPage && (
            <div style={{ position: 'relative' }}>
                <Navbar />
                <button
                    onClick={handleLogout}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 9999,
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        color: '#fca5a5',
                        padding: '0.4rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                    }}
                >
                    Logout
                </button>
            </div>
        )}
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<AdminRoute><AddItem /></AdminRoute>} />
          <Route path='/list' element={<AdminRoute><List /></AdminRoute>} />
          <Route path='/orders' element={<AdminRoute><Order /></AdminRoute>} />
        </Routes>
      </>
    )
}

export default App
