import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sender from './component/Send';
import Recieve from './component/Recieve';
function App() {
  return (

    <BrowserRouter>
      <Routes>



        <Route path="/" element={<Sender />} />
        <Route path="/rec" element={<Recieve />} />




      </Routes>
    </BrowserRouter>
  )
}

export default App