import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddItem from './components/AddItem'
import List from './components/List'
import Order from './components/Order'
import Login from './components/Login'
import AdminRoute from './components/AdminRoute'

const App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
      <>
        {!isLoginPage && <Navbar />}
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
