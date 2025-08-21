import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './Pages/AuthPage';
import EventsPage from './Pages/EventsPage';
import BookingsPage from './Pages/BookingsPage';
import MainNavigation from './components/MainNavigation';
import NotFoundPage from './Pages/NotFoundPage';

// what do we want ? 
// authentication pages
// create events, view events
// create booking, view bookings, cancel booking

function App() {
  
  return (
    <BrowserRouter>
      <>
        <MainNavigation/>
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Navigate to={'/auth'} replace={true}/>}/>
            <Route path='/auth' element={<AuthPage/>}/>
            <Route path='/events' element={<EventsPage/>}/>
            <Route path='/bookings' element={<BookingsPage/>}/>
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  )
}

export default App
