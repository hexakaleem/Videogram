import { useEffect, useState } from 'react';
import { userApi } from '../lib/api';
import { Link } from 'react-router-dom';
import './Channels.css';

export default function Channels() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userApi.getAllChannels()
            .then((res) => setChannels(res.data?.data || []))
            .catch(() => setChannels([]))
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
        <div className="channels-page">
            <header className="page-header">
                <h1>All Channels</h1>
                <p>Discover content creators on Videogram</p>
            </header>

            {channels.length === 0 ? (
                <div className="empty-state">
                    <h2>No channels found</h2>
                </div>
            ) : (
                <div className="channel-grid">
                    {channels.map((channel) => (
                        <Link key={channel._id} to={`/channel/${channel.username}`} className="channel-card">
                            <div className="channel-avatar-wrapper">
                                <img src={channel.avatar} alt={channel.username} className="channel-avatar" />
                            </div>
                            <div className="channel-info">
                                <h3>{channel.fullName}</h3>
                                <p>@{channel.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
