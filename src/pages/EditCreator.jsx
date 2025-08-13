// src/pages/EditCreator.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const EditCreator = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [creator, setCreator] = useState({ name: '', url: '', description: '', imageURL: '' });

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
                setCreator(data);
            }
        };
        fetchCreator();
    }, [id, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreator((prev) => ({ ...prev, [name]: value }));
    };

    const updateCreator = async (event) => {
        event.preventDefault();
        
        const { error } = await supabase
            .from('creators')
            .update({ 
                name: creator.name, 
                url: creator.url, 
                description: creator.description, 
                imageURL: creator.imageURL 
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
        <form onSubmit={updateCreator}>
            <h3>Edit Creator</h3>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={creator.name} onChange={handleChange} required />

            <label htmlFor="url">Channel URL</label>
            <input type="url" id="url" name="url" value={creator.url} onChange={handleChange} required />
            
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={creator.description} onChange={handleChange} required />

            <label htmlFor="imageURL">Image URL (Optional)</label>
            <input type="url" id="imageURL" name="imageURL" value={creator.imageURL || ''} onChange={handleChange} />
            
            <div className="grid">
                <button type="submit">Update Creator</button>
                <button type="button" className="secondary" onClick={deleteCreator}>Delete Creator</button>
            </div>
        </form>
    );
};

export default EditCreator;