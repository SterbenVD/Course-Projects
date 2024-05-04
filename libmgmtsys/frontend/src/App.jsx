import { useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import LoginPage from './pages/Login.jsx'
import About from './pages/About.jsx'
import Search from './pages/user/Search.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App