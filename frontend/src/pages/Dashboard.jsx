import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getSubscriptionStats()
      .then((res) => setStats(res.data?.data))
      .catch(() => setStats({ subscribers: 0, subscribedTo: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1>
            Hello, <span className="highlight">{user?.fullName?.split(' ')[0] || user?.username}</span>
          </h1>
          <p>Welcome to your Videogram dashboard. Explore your channel and watch history.</p>
        </div>
        <div className="hero-avatar">
          <img src={user?.avatar} alt={user?.fullName} />
        </div>
      </section>

      {loading ? (
        <div className="loader-screen">
          <div className="loader" />
        </div>
      ) : (
        <section className="dashboard-cards">
          <Link to={`/channel/${user?.username}`} className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.subscribers ?? 0}</span>
              <span className="stat-label">Subscribers</span>
            </div>
          </Link>
          <Link to="/watch-history" className="stat-card">
            <div className="stat-icon">📺</div>
            <div className="stat-content">
              <span className="stat-value">{stats?.subscribedTo ?? 0}</span>
              <span className="stat-label">Subscriptions</span>
            </div>
          </Link>
        </section>
      )}

      <section className="dashboard-quicklinks">
        <h2>Quick links</h2>
        <div className="quicklinks-grid">
          <Link to="/profile" className="quicklink-card">
            <span className="quicklink-icon">⚙️</span>
            <span>Edit Profile</span>
          </Link>
          <Link to={`/channel/${user?.username}`} className="quicklink-card">
            <span className="quicklink-icon">📢</span>
            <span>View Channel</span>
          </Link>
          <Link to="/watch-history" className="quicklink-card">
            <span className="quicklink-icon">🕐</span>
            <span>Watch History</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
