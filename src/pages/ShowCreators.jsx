// src/pages/ShowCreators.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const ShowCreators = () => {
    const [creators, setCreators] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchCreators = async () => {
            setLoading(true);
            let query = supabase.from('creators').select();
            
            // Apply sorting
            if (sortBy === 'newest') {
                query = query.order('created_at', { ascending: false });
            } else if (sortBy === 'oldest') {
                query = query.order('created_at', { ascending: true });
            } else if (sortBy === 'name') {
                query = query.order('name', { ascending: true });
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching creators:', error);
            } else {
                setCreators(data);
            }
            setLoading(false);
        };

        fetchCreators();
    }, [sortBy]);

    // Filter creators based on search term
    const filteredCreators = creators.filter(creator => 
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Empty state component
    const EmptyState = () => (
        <div className="empty-state">
            <h2>No Creators Yet! ✨</h2>
            <p>Start building your creator collection by adding your favorite content creators.</p>
            <Link to="/new"><button>Add Your First Creator</button></Link>
        </div>
    );

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading creators...</p>
            </div>
        );
    }

    return (
        <div>
            {creators && creators.length > 0 ? (
                <>
                    <div className="controls">
                        <div className="search-bar">
                            <input 
                                type="text" 
                                placeholder="Search creators..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filters">
                            <div className="custom-select" 
                                 onMouseEnter={() => setDropdownOpen(true)}
                                 onMouseLeave={() => setDropdownOpen(false)}
                                 onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={dropdownOpen ? 'active' : ''}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {filteredCreators.length > 0 ? (
                        <div className="grid">
                            {filteredCreators.map((creator) => (
                                <Card 
                                    key={creator.id} 
                                    id={creator.id}
                                    name={creator.name}
                                    url={creator.url}
                                    description={creator.description}
                                    imageURL={creator.imageURL}
                                    youtube={creator.youtube}
                                    twitter={creator.twitter}
                                    instagram={creator.instagram}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h2>No Results Found</h2>
                            <p>Try adjusting your search or filters.</p>
                            <button className="secondary" onClick={() => setSearchTerm('')}>Clear Search</button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default ShowCreators;