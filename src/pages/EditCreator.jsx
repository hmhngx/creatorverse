// src/pages/EditCreator.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const EditCreator = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [creator, setCreator] = useState({ 
        name: '', 
        url: '', 
        description: '', 
        imageURL: '',
        youtube: '',
        twitter: '',
        instagram: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCreator = async () => {
            const { data, error } = await supabase
                .from('creators')
                .select()
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching creator:', error);
                navigate('/');
            } else {
                setCreator({
                    ...data,
                    youtube: data.youtube || '',
                    twitter: data.twitter || '',
                    instagram: data.instagram || ''
                });
            }
        };
        fetchCreator();
    }, [id, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreator((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    // Extract handle from URL or return handle as-is
    const extractHandle = (platform, input) => {
        if (!input) return '';
        input = input.trim();
        if (!input.includes('http')) {
            return input.replace(/^@/, '');
        }
        const patterns = {
            youtube: /(?:youtube\.com\/(?:@|user\/|channel\/)?)([A-Za-z0-9_-]+)/i,
            twitter: /(?:twitter\.com\/|x\.com\/)([A-Za-z0-9_]+)/i,
            instagram: /instagram\.com\/([A-Za-z0-9_.]+)/i
        };
        const match = input.match(patterns[platform]);
        if (match && match[1]) {
            return match[1].replace(/\/$/, '');
        }
        return '';
    };

    const isValidHandle = (platform, handle) => {
        const extracted = extractHandle(platform, handle);
        return !!extracted && /^[a-zA-Z0-9_.-]+$/.test(extracted);
    };
    
    const validateForm = () => {
        const newErrors = {};

        if (!creator.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!creator.url.trim()) {
            newErrors.url = 'URL is required';
        }

        if (!creator.description.trim()) {
            newErrors.description = 'Description is required';
        }

        // Validate social media handles (only if provided)
        if (creator.youtube && !isValidHandle('youtube', creator.youtube)) {
            newErrors.youtube = 'Please enter a valid YouTube handle or URL';
        }

        if (creator.twitter && !isValidHandle('twitter', creator.twitter)) {
            newErrors.twitter = 'Please enter a valid Twitter handle or URL';
        }

        if (creator.instagram && !isValidHandle('instagram', creator.instagram)) {
            newErrors.instagram = 'Please enter a valid Instagram handle or URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateCreator = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const { error } = await supabase
            .from('creators')
            .update({ 
                name: creator.name, 
                url: creator.url, 
                description: creator.description, 
                imageURL: creator.imageURL,
                youtube: extractHandle('youtube', creator.youtube),
                twitter: extractHandle('twitter', creator.twitter),
                instagram: extractHandle('instagram', creator.instagram)
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating creator:', error);
            alert(`Error: ${error.message}`);
        } else {
            alert('Creator updated successfully!');
            navigate(`/${id}`);
        }
    };

    const deleteCreator = async () => {
        if (window.confirm("Are you sure you want to delete this creator forever? This action cannot be undone.")) {
            const { error } = await supabase
                .from('creators')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Error deleting creator:', error);
            } else {
                alert('Creator has been deleted.');
                navigate('/');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Creator</h2>
            <form onSubmit={updateCreator}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={creator.name} 
                        onChange={handleChange} 
                        required 
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="url">Channel URL</label>
                    <input 
                        type="url" 
                        id="url" 
                        name="url" 
                        value={creator.url} 
                        onChange={handleChange} 
                        required 
                        className={errors.url ? 'error' : ''}
                    />
                    {errors.url && <div className="error-message">{errors.url}</div>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea 
                        id="description" 
                        name="description" 
                        value={creator.description} 
                        onChange={handleChange} 
                        required 
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="social-media-links">
                    <h3>Social Media Links</h3>
                    <p className="social-media-hint">Provide at least one of the creator's social media handles (without the @)</p>
                    
                    <div className="form-group social-input">
                        <label htmlFor="youtube">
                            <span className="social-icon youtube-icon">📺</span> YouTube
                        </label>
                        <input 
                            type="text" 
                            id="youtube" 
                            name="youtube" 
                            value={creator.youtube} 
                            onChange={handleChange} 
                            placeholder="The creator's YouTube handle (without the @)"
                            className={errors.youtube ? 'error' : ''}
                        />
                        {errors.youtube && <div className="error-message">{errors.youtube}</div>}
                    </div>
                    
                    <div className="form-group social-input">
                        <label htmlFor="twitter">
                            <span className="social-icon twitter-icon">🐦</span> Twitter
                        </label>
                        <input 
                            type="text" 
                            id="twitter" 
                            name="twitter" 
                            value={creator.twitter} 
                            onChange={handleChange} 
                            placeholder="The creator's Twitter handle (without the @)"
                            className={errors.twitter ? 'error' : ''}
                        />
                        {errors.twitter && <div className="error-message">{errors.twitter}</div>}
                    </div>
                    
                    <div className="form-group social-input">
                        <label htmlFor="instagram">
                            <span className="social-icon instagram-icon">📷</span> Instagram
                        </label>
                        <input 
                            type="text" 
                            id="instagram" 
                            name="instagram" 
                            value={creator.instagram} 
                            onChange={handleChange} 
                            placeholder="The creator's Instagram handle (without the @)"
                            className={errors.instagram ? 'error' : ''}
                        />
                        {errors.instagram && <div className="error-message">{errors.instagram}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageURL">Image URL (Optional)</label>
                    <input 
                        type="url" 
                        id="imageURL" 
                        name="imageURL" 
                        value={creator.imageURL || ''} 
                        onChange={handleChange} 
                        className={errors.imageURL ? 'error' : ''}
                    />
                    {errors.imageURL && <div className="error-message">{errors.imageURL}</div>}
                    
                    {creator.imageURL && !errors.imageURL && (
                        <div className="image-preview">
                            <img src={creator.imageURL} alt="Preview" />
                        </div>
                    )}
                </div>
                
                <div className="grid">
                    <button type="submit">Update Creator</button>
                    <button type="button" className="secondary" onClick={deleteCreator}>Delete Creator</button>
                </div>
            </form>
        </div>
    );
};

export default EditCreator;