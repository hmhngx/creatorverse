// src/pages/AddCreator.jsx
import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

const AddCreator = () => {
    const navigate = useNavigate();
    const [creator, setCreator] = useState({ name: '', url: '', description: '', imageURL: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreator((prev) => ({ ...prev, [name]: value }));
    };

    const addCreator = async (event) => {
        event.preventDefault();
        
        const { error } = await supabase
            .from('creators')
            .insert({ 
                name: creator.name, 
                url: creator.url, 
                description: creator.description, 
                imageURL: creator.imageURL 
            });

        if (error) {
            console.error('Error adding creator:', error);
            alert(`Error: ${error.message}`);
        } else {
            alert('Creator added successfully!');
            navigate('/');
        }
    };

    return (
        <form onSubmit={addCreator}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={creator.name} onChange={handleChange} required />

            <label htmlFor="url">Channel URL</label>
            <input type="url" id="url" name="url" value={creator.url} onChange={handleChange} required />
            
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={creator.description} onChange={handleChange} required />

            <label htmlFor="imageURL">Image URL (Optional)</label>
            <input type="url" id="imageURL" name="imageURL" value={creator.imageURL} onChange={handleChange} placeholder="http://..."/>
            
            <button type="submit">Add Creator</button>
        </form>
    );
};

export default AddCreator;