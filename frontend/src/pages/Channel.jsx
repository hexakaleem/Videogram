import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi, videoApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import './Channel.css';

export default function Channel() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [uploadData, setUploadData] = useState({ title: '', description: '', thumbnail: '' });
  const [uploading, setUploading] = useState(false);

  const fetchChannelData = () => {
    userApi.getChannelProfile(username)
      .then((res) => {
        const data = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data;
        setChannel(data);
        setIsSubscribed(data?.isSubscribed);
        setSubscribersCount(data?.subscribersCount || 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Channel not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!username) return;
    fetchChannelData();
  }, [username]);

  const handleToggleSubscribe = () => {
    if (!channel) return;
    userApi.toggleSubscription(channel._id)
      .then((res) => {
        setIsSubscribed(res.data?.data?.subscribed);
        setSubscribersCount(prev => res.data?.data?.subscribed ? prev + 1 : prev - 1);
      })
      .catch((err) => console.error("Toggle subscribe failed", err));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    videoApi.publishVideo({ ...uploadData, duration: Math.floor(Math.random() * 600) + 60 })
      .then(() => {
        alert("Video 'published' successfully!");
        setUploadData({ title: '', description: '', thumbnail: '' });
      })
      .catch((err) => alert("Upload failed"))
      .finally(() => setUploading(false));
  };

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="channel-error">
        <h2>Channel not found</h2>
        <p>{error || 'This channel does not exist.'}</p>
      </div>
    );
  }

  const isOwnChannel = currentUser?.username === channel.username;

  return (
    <div className="channel-page">
      <div className="channel-banner">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Channel cover" />
        ) : (
          <div className="channel-banner-placeholder" />
        )}
      </div>

      <div className="channel-info">
        <div className="channel-avatar">
          <img src={channel.avatar} alt={channel.fullName} />
        </div>
        <div className="channel-meta">
          <div className="channel-meta-header">
            <div>
              <h1>{channel.fullName}</h1>
              <p className="channel-username">@{channel.username}</p>
            </div>
            {!isOwnChannel && (
              <button
                onClick={handleToggleSubscribe}
                className={`btn ${isSubscribed ? 'btn-ghost' : 'btn-primary'}`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
          <div className="channel-stats">
            <span>{subscribersCount} subscribers</span>
            <span>{channel.subscribedToCount ?? 0} subscribed</span>
          </div>
        </div>
      </div>

      <div className="channel-grid-layout">
        <div className="channel-content">
          <h2>About this channel</h2>
          <p className="channel-about">
            {channel.email ? (
              <>Contact: {channel.email}</>
            ) : (
              'No additional information available.'
            )}
          </p>
        </div>

        {isOwnChannel && (
          <div className="upload-section">
            <h2>Upload Dummy Video</h2>
            <form onSubmit={handleUpload} className="upload-form">
              <input
                type="text"
                placeholder="Video Title"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                required
              />
              <input
                type="url"
                placeholder="Thumbnail URL"
                value={uploadData.thumbnail}
                onChange={(e) => setUploadData({ ...uploadData, thumbnail: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Publishing...' : 'Publish Video'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
