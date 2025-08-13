// src/pages/ShowCreators.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import Card from '../components/Card';

const ShowCreators = () => {
    const [creators, setCreators] = useState([]);

    useEffect(() => {
        const fetchCreators = async () => {
            const { data, error } = await supabase
                .from('creators')
                .select()
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching creators:', error);
            } else {
                setCreators(data);
            }
        };

        fetchCreators();
    }, []);

    return (
        <div>
            {creators && creators.length > 0 ? (
                <div className="grid">
                    {creators.map((creator) => (
                        <Card
                            key={creator.id}
                            id={creator.id}
                            name={creator.name}
                            url={creator.url}
                            description={creator.description}
                            imageURL={creator.imageURL}
                        />
                    ))}
                </div>
            ) : (
                <h2>No Creators Yet! 😞</h2>
            )}
        </div>
    );
};

export default ShowCreators;