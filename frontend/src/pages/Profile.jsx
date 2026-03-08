import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [details, setDetails] = useState({
    fullName: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setDetails({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const avatarRef = useRef();
  const coverRef = useRef();

  const handleDetailsChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordsChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setMessage({});
    setLoading(true);
    try {
      const res = await authApi.updateDetails(details);
      updateUser(res.data?.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({});
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(passwords);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage({});
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await authApi.updateAvatar(formData);
      updateUser(res.data?.data);
      setMessage({ type: 'success', text: 'Avatar updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage({});
    try {
      const formData = new FormData();
      formData.append('coverImage', file);
      const res = await authApi.updateCoverImage(formData);
      updateUser(res.data?.data);
      setMessage({ type: 'success', text: 'Cover image updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-cover">
        {user?.coverImage ? (
          <img src={user.coverImage} alt="Cover" />
        ) : (
          <div className="cover-placeholder" />
        )}
        <label className="cover-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={loading}
          />
          <span>Change cover</span>
        </label>
      </div>

      <div className="profile-header">
        <div className="profile-avatar-wrap">
          <img src={user?.avatar} alt={user?.fullName} />
          <label className="avatar-upload">
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={loading}
            />
            <span>Edit</span>
          </label>
        </div>
        <div className="profile-info">
          <h1>{user?.fullName}</h1>
          <p>@{user?.username}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          Account Details
        </button>
        <button
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      <div className="profile-content">
        {message.text && (
          <p className={message.type === 'success' ? 'success-msg' : 'error-msg'}>{message.text}</p>
        )}

        {activeTab === 'details' && (
          <form onSubmit={handleUpdateDetails} className="profile-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="fullName"
                value={details.fullName}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                name="username"
                value={details.username}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={details.email}
                onChange={handleDetailsChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="input-group">
              <label>Current Password</label>
              <input
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordsChange}
                required
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordsChange}
                required
                minLength={6}
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordsChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Change password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
