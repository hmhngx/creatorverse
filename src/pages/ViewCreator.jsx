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

    return (
        <article>
            {creator.imageURL && <img src={creator.imageURL} alt={`Image of ${creator.name}`} style={{ maxHeight: '300px', objectFit: 'cover' }} />}
            <header>
                <h2>{creator.name}</h2>
            </header>
            <p>{creator.description}</p>
            <a href={creator.url} target="_blank" rel="noopener noreferrer" role="button">
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