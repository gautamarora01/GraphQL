import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

function MainNavigation() {

  const context = useContext(AuthContext);

  return (
    <header className='main-navigation-header'>
        <div className='main-navigation-logo'>
            <h1>
              <Link to='/events' style={{ textDecoration: "none", color: "inherit" }}>EventMate</Link>
            </h1>
        </div>
        <nav className='main-navigation-item'>
            <ul>
                {!context.token && <li><NavLink to='/auth'>Authenticate</NavLink></li>}
                <li><NavLink to='/events'>Events</NavLink></li>
                {context.token && <li><NavLink to='/bookings'>Bookings</NavLink></li>}
                {context.token && <li><button onClick={context.logout}>Logout</button></li>}
            </ul>
        </nav>
    </header>
  )
}

export default MainNavigation