// src/pages/AddCreator.jsx
import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

const AddCreator = () => {
    const navigate = useNavigate();
    const [creator, setCreator] = useState({ name: '', url: '', description: '', imageURL: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreator((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!creator.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!creator.url.trim()) {
            newErrors.url = 'URL is required';
        } else if (!isValidUrl(creator.url)) {
            newErrors.url = 'Please enter a valid URL';
        }
        
        if (!creator.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (creator.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }
        
        if (creator.imageURL && !isValidUrl(creator.imageURL)) {
            newErrors.imageURL = 'Please enter a valid image URL';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const addCreator = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        const { error } = await supabase
            .from('creators')
            .insert({ 
                name: creator.name, 
                url: creator.url, 
                description: creator.description, 
                imageURL: creator.imageURL 
            });

        setIsSubmitting(false);

        if (error) {
            console.error('Error adding creator:', error);
            alert(`Error: ${error.message}`);
        } else {
            alert('Creator added successfully!');
            navigate('/');
        }
    };

    return (
        <div className="form-container">
            <h2>Add a New Creator</h2>
            <form onSubmit={addCreator}>
                <div className="form-group">
                    <label htmlFor="name">Creator Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={creator.name} 
                        onChange={handleChange} 
                        placeholder="e.g. TikTok Star"
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
                        placeholder="https://www.tiktok.com/@username"
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
                        placeholder="Tell us about this creator (minimum 10 characters)"
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="imageURL">Profile Image URL (Optional)</label>
                    <input 
                        type="url" 
                        id="imageURL" 
                        name="imageURL" 
                        value={creator.imageURL} 
                        onChange={handleChange} 
                        placeholder="https://example.com/image.jpg"
                        className={errors.imageURL ? 'error' : ''}
                    />
                    {errors.imageURL && <div className="error-message">{errors.imageURL}</div>}
                    
                    {creator.imageURL && !errors.imageURL && (
                        <div className="image-preview">
                            <img src={creator.imageURL} alt="Preview" />
                        </div>
                    )}
                </div>
                
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding Creator...' : 'Add Creator'}
                </button>
            </form>
        </div>
    );
};

export default AddCreator;