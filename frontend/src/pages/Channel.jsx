import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../lib/api';
import './Channel.css';

export default function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) return;
    userApi.getChannelProfile(username)
      .then((res) => {
        const data = res.data?.data;
        setChannel(Array.isArray(data) ? data[0] : data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Channel not found'))
      .finally(() => setLoading(false));
  }, [username]);

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
          <h1>{channel.fullName}</h1>
          <p className="channel-username">@{channel.username}</p>
          <div className="channel-stats">
            <span>{channel.subscribersCount ?? 0} subscribers</span>
            <span>{channel.subscribedToCount ?? 0} subscribed</span>
          </div>
        </div>
      </div>

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
    </div>
  );
}
