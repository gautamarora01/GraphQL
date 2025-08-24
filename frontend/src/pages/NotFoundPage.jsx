import { NavLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Oops! Page Not Found</p>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <NavLink to="/" className="notfound-button">
        Go Back Home
      </NavLink>
    </div>
  );
}

export default NotFoundPage;