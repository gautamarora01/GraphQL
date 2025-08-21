import { NavLink } from 'react-router-dom'

function MainNavigation(props) {
  return (
    <header className='main-navigation-header'>
        <div className='main-navigation-logo'>
            <h1>EventMate</h1>
        </div>
        <nav className='main-navigation-item'>
            <ul>
                <li><NavLink to='/auth'>Authenticate</NavLink></li>
                <li><NavLink to='/events'>Events</NavLink></li>
                <li><NavLink to='/bookings'>Bookings</NavLink></li>
            </ul>
        </nav>
    </header>
  )
}

export default MainNavigation