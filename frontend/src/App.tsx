import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'
import SignupPage from './screens/Signup'
import LoginPage from './screens/Login'

function App() {


  return (
    <div className='bg-slate-900 h-screen w-screen'>
      <BrowserRouter>
        <Routes>
          <Route path='/landing' element={<Landing />} />
          <Route path='/game' element={<Game />} />
          <Route path='/' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
