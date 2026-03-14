import { useEffect, useState } from 'react';
import { videoApi, userApi } from '../lib/api';
import './Videos.css';

export default function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        videoApi.getAllVideos()
            .then((res) => setVideos(res.data?.data || []))
            .catch(() => setVideos([]))
            .finally(() => setLoading(false));
    }, []);

    const handleVideoClick = (videoId) => {
        userApi.addToWatchHistory(videoId)
            .catch((err) => console.error("Failed to add to watch history", err));
    };

    if (loading) {
        return (
            <div className="loader-screen">
                <div className="loader" />
            </div>
        );
    }

    return (
        <div className="videos-page">
            <header className="page-header">
                <h1>All Videos</h1>
                <p>Explore all uploaded videos on Videogram</p>
            </header>

            {videos.length === 0 ? (
                <div className="empty-state">
                    <h2>No videos found</h2>
                    <p>Check back later for more content.</p>
                </div>
            ) : (
                <div className="video-grid">
                    {videos.map((video) => (
                        <div key={video._id} className="video-card" onClick={() => handleVideoClick(video._id)}>
                            <div className="video-thumbnail">
                                <img src={video.thumbnail} alt={video.title} />
                            </div>
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <div className="video-meta">
                                    <div className="owner-info">
                                        <img src={video.owner.avatar} alt={video.owner.username} className="owner-avatar" />
                                        <span>{video.owner.fullName}</span>
                                    </div>
                                    <span className="views">{video.views} views</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
