import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';
import MainNavigation from './components/MainNavigation';
import NotFoundPage from './pages/NotFoundPage';
import { AuthContext } from './context/AuthContext';
import { useState } from 'react';

// what do we want ? 
// authentication pages
// create events, view events
// create booking, view bookings, cancel booking

function App() {

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  function login(token, userId, tokenExpiration){
    setToken(token);
    setUserId(userId);
  };

  function logout(){
    setToken(null);
    setUserId(null);
  };
  
  return ( 
    <BrowserRouter>
      <>
        <AuthContext.Provider value={{
          token: token,
          userId: userId,
          login: login,
          logout: logout
        }}>
          <MainNavigation/>
          <main className='main-content'>
            <Routes>
              {!token && <Route path='/' element={<Navigate to={'/auth'} replace={true}/>}/>}
              {token && <Route path='/' element={<Navigate to={'/events'} replace={true}/>}/>}
              {!token && <Route path='/auth' element={<AuthPage/>}/>}
              {token && <Route path='/auth' element={<Navigate to={'/events'} replace={true}/>}/>}
              <Route path='/events' element={<EventsPage/>}/>
              <Route path='/bookings' element={<BookingsPage/>}/>
              {token && <Route path="*" element={<NotFoundPage/>} />}
            </Routes>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  )
}

export default App
