// src/components/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ id, name, url, description, imageURL }) => {
    return (
        <article>
            {imageURL && <img src={imageURL} alt={`Image of ${name}`} style={{ maxHeight: '200px', objectFit: 'cover' }} />}
            <header>
                <h3>{name}</h3>
            </header>
            <p>{description}</p>
            <footer>
                <a href={url} target="_blank" rel="noopener noreferrer" role="button" className="secondary">Channel</a>
                <Link to={`/${id}`} role="button" className="contrast">View Details</Link>
                <Link to={`/edit/${id}`} role="button">Edit</Link>
            </footer>
        </article>
    );
};

export default Card;