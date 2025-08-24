import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';
import MainNavigation from './components/MainNavigation';
import NotFoundPage from './pages/NotFoundPage';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// what do we want ? 
// authentication pages
// create events, view events
// create booking, view bookings, cancel booking

function App() {

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const expTimeoutRef = useRef(null);

  function login(token, userId, tokenExpiration){
    setToken(token);
    setUserId(userId);

    if(expTimeoutRef.current){
      clearTimeout(expTimeoutRef.current);
    }

    const remainingTime = tokenExpiration * 60 * 60 * 1000; 
    const expirationDate = new Date(new Date().getTime() + remainingTime);

    expTimeoutRef.current = setTimeout(() => {
      logout();
    }, remainingTime);

    localStorage.setItem('authData', JSON.stringify({
      token: token,
      userId: userId,
      expiration: expirationDate.toISOString()
    }));
  };

  function logout(){
    setToken(null);
    setUserId(null);
    localStorage.removeItem('authData');

    if(expTimeoutRef.current){
      clearTimeout(expTimeoutRef.current);
      expTimeoutRef.current = null;
    }
  };
  
  //Restore token on first mount
  useEffect(()=>{
    const storedData = JSON.parse(localStorage.getItem('authData'));
    if(storedData){
      const {token, userId, expiration} = storedData;
      const expirationDate = new Date(expiration);
      const remainingTime = expirationDate.getTime() - new Date().getTime();

      if(token && remainingTime > 0){
        setToken(token);
        setUserId(userId);
        expTimeoutRef.current = setTimeout(() => {
          logout();
        }, remainingTime);
      }
      else{
        localStorage.removeItem('authData');
        if(expTimeoutRef.current){
          clearTimeout(expTimeoutRef.current);
          expTimeoutRef.current = null;
        }
      }
    }
  },[]);

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
              {!token && <Route path='/' element={<Navigate to={'/auth'} replace/>}/>}
              {token && <Route path='/' element={<Navigate to={'/events'} replace/>}/>}
              
              {!token && <Route path='/auth' element={<AuthPage/>}/>}
              {token && <Route path='/auth' element={<Navigate to={'/events'} replace/>}/>}
              
              <Route path='/events' element={<EventsPage/>}/>
              
              <Route path='/bookings' element={<ProtectedRoute><BookingsPage/></ProtectedRoute>}/>
              
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  )
}

export default App
