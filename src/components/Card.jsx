// src/components/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ id, name, url, description, imageURL, youtube, twitter, instagram }) => {
    // Generate avatar if no image provided
    const avatarContent = imageURL ? 
        <img src={imageURL} alt={`${name}`} /> : 
        name.charAt(0).toUpperCase();
    
    // Mock data for demonstration (in a real app, these would come from props)
    const followers = Math.floor(Math.random() * 900000) + 100000;
    const engagement = (Math.random() * 5 + 2).toFixed(1);
    const location = "Global";
    const tags = ["Creator", "Entertainment"];
    
    // Format follower count
    const formatFollowers = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };
    
    // Check if creator has any social media links
    const hasSocialMedia = youtube || twitter || instagram;
    
    return (
        <article className="creator-card">
            <div className="card-image">
                {imageURL && <img src={imageURL} alt={`Cover for ${name}`} />}
                <div className="profile-info">
                    <div className="avatar">
                        {avatarContent}
                    </div>
                    <h3 className="creator-name">{name}</h3>
                </div>
            </div>
            
            <div className="creator-stats">
                <div className="stat">
                    <span className="stat-value">{formatFollowers(followers)}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{engagement}%</span>
                    <span className="stat-label">Engagement</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{location}</span>
                    <span className="stat-label">Location</span>
                </div>
            </div>
            
            <div className="creator-content">
                <div className="tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <p className="description">{description}</p>
                
                {hasSocialMedia && (
                    <div className="card-social-links">
                        {youtube && (
                            <a 
                                href={`https://youtube.com/@${youtube}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="card-social-icon youtube"
                                aria-label={`${name} on YouTube`}
                            >
                                <span>📺</span>
                            </a>
                        )}
                        
                        {twitter && (
                            <a 
                                href={`https://twitter.com/${twitter}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="card-social-icon twitter"
                                aria-label={`${name} on Twitter`}
                            >
                                <span>🐦</span>
                            </a>
                        )}
                        
                        {instagram && (
                            <a 
                                href={`https://instagram.com/${instagram}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="card-social-icon instagram"
                                aria-label={`${name} on Instagram`}
                            >
                                <span>📷</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
            
            <div className="card-actions">
                <a href={url} target="_blank" rel="noopener noreferrer" role="button" className="secondary">
                    <span>📺</span> Channel
                </a>
                <Link to={`/${id}`} role="button" className="contrast">
                    <span>👁️</span> View
                </Link>
                <Link to={`/edit/${id}`} role="button">
                    <span>✏️</span> Edit
                </Link>
            </div>
        </article>
    );
};

export default Card;