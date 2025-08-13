// src/pages/ViewCreator.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const ViewCreator = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [creator, setCreator] = useState(null);

    useEffect(() => {
        const fetchCreator = async () => {
            const { data, error } = await supabase
                .from('creators')
                .select()
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching creator:', error);
                navigate('/'); // Redirect home if creator not found
            } else {
                setCreator(data);
            }
        };

        fetchCreator();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this creator?")) {
            const { error } = await supabase
                .from('creators')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Error deleting creator:', error);
            } else {
                alert('Creator deleted successfully!');
                navigate('/');
            }
        }
    };

    if (!creator) {
        return <progress></progress>; // Loading indicator
    }

    // Check if creator has any social media links
    const hasSocialMedia = creator.youtube || creator.twitter || creator.instagram;

    return (
        <article className="creator-profile">
            {creator.imageURL && <img src={creator.imageURL} alt={`Image of ${creator.name}`} className="profile-cover-image" />}
            <header>
                <h2>{creator.name}</h2>
            </header>
            <p className="creator-description">{creator.description}</p>
            
            {hasSocialMedia && (
                <div className="social-media-container">
                    <h3>Social Media Links</h3>
                    <div className="social-links">
                        {creator.youtube && (
                            <a 
                                href={`https://youtube.com/@${creator.youtube}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-link youtube"
                                aria-label={`${creator.name} on YouTube`}
                            >
                                <span className="social-icon">📺</span>
                                <span className="social-name">YouTube</span>
                            </a>
                        )}
                        
                        {creator.twitter && (
                            <a 
                                href={`https://twitter.com/${creator.twitter}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-link twitter"
                                aria-label={`${creator.name} on Twitter`}
                            >
                                <span className="social-icon">🐦</span>
                                <span className="social-name">Twitter</span>
                            </a>
                        )}
                        
                        {creator.instagram && (
                            <a 
                                href={`https://instagram.com/${creator.instagram}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-link instagram"
                                aria-label={`${creator.name} on Instagram`}
                            >
                                <span className="social-icon">📷</span>
                                <span className="social-name">Instagram</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
            
            <a href={creator.url} target="_blank" rel="noopener noreferrer" role="button" className="main-channel-btn">
                Visit Channel 📺
            </a>
            <footer>
              <Link to={`/edit/${id}`} role="button">Edit</Link>
              <button className="secondary" onClick={handleDelete}>Delete</button>
            </footer>
        </article>
    );
};

export default ViewCreator;