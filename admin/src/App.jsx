import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import AddItem from './components/AddItem'
import List from './components/List'
import Order from './components/Order'

const App = () => {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path='/' element={<AddItem />} />
          <Route path='/list' element={<List />} />
          <Route path='/orders' element={<Order />} />
        </Routes>
      </>
    )
}

export default App
