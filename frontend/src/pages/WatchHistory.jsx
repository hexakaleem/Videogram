import { useEffect, useState } from 'react';
import { userApi } from '../lib/api';
import './WatchHistory.css';

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getWatchHistory()
      .then((res) => setHistory(res.data?.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="watch-history-page">
      <h1>Watch History</h1>
      <p className="watch-history-subtitle">
        Videos you've watched recently
      </p>

      {history.length === 0 ? (
        <div className="watch-history-empty">
          <div className="empty-icon">📺</div>
          <h2>No watch history yet</h2>
          <p>Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className="watch-history-grid">
          {history.map((video) => (
            <div key={video._id} className="history-item">
              {video.thumbnail && (
                <div className="history-thumb">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
              )}
              <div className="history-info">
                <h3>{video.title}</h3>
                {video.owner && (
                  <p className="history-owner">
                    {video.owner.fullName} • @{video.owner.username}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
