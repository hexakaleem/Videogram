import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const avatarRef = useRef();
  const coverRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (avatar) data.append('avatar', avatar);
      if (coverImage) data.append('coverImage', coverImage);

      await authApi.register(data);
      await login({ username: formData.username, password: formData.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Join Videogram and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Avatar (required)</label>
              <div className="file-input-wrap">
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="file-input"
                />
                <button
                  type="button"
                  className="btn btn-secondary file-btn"
                  onClick={() => avatarRef.current?.click()}
                >
                  {avatar ? avatar.name : 'Choose avatar'}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Cover Image (optional)</label>
              <div className="file-input-wrap">
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="file-input"
                />
                <button
                  type="button"
                  className="btn btn-secondary file-btn"
                  onClick={() => coverRef.current?.click()}
                >
                  {coverImage ? coverImage.name : 'Choose cover'}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading || !avatar}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-decoration" aria-hidden>
        <div className="decoration-grid" />
        <div className="decoration-glow" />
      </div>
    </div>
  );
}
