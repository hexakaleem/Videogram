import { Outlet } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">Videogram</span>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/videos" className="nav-link">All Videos</Link>
              <Link to="/channels" className="nav-link">All Channels</Link>
              <Link to="/watch-history" className="nav-link">Watch History</Link>
              <Link to={`/channel/${user.username}`} className="nav-link">My Channel</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <div className="user-menu">
                <Link to="/profile" className="user-avatar-link">
                  <img src={user.avatar} alt={user.fullName} className="user-avatar" />
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
