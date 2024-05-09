import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/GratitudeComponent.css';
import backIcon from '../assets/images/back-arrow.png';
import TreeComponent from './TreeComponent';

const GratitudeComponent = ( ) => {
    const [gratitudes, setGratitudes] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [hoursToNext, setHoursToNext] = useState(0);
    const [newGratitude, setNewGratitude] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchGratitudes();
    }, []);

    const fetchGratitudes = async () => {
        const apiBaseUrl = process.env.REACT_APP_API_URL;
        try {
            const response = await fetch(`${apiBaseUrl}/gratitudes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched gratitudes:', data);

            setGratitudes(data.gratitudes);
            setCanSubmit(data.canSubmit);
            setHoursToNext(data.hoursToNext);
        } catch (error) {
            console.error('Failed to fetch gratitudes:', error);
            alert('Failed to load gratitudes, please try again.'); // User-friendly error message
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) return;

        const apiBaseUrl = process.env.REACT_APP_API_URL;
        const sanitizedContent = DOMPurify.sanitize(newGratitude);

        try {
            const response = await fetch(`${apiBaseUrl}/gratitudes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: sanitizedContent })
            });
            if (!response.ok) throw new Error('Failed to submit gratitude');

            setNewGratitude('');
            fetchGratitudes();
        } catch (error) {
            console.error('Error submitting gratitude:', error);
        }
    };

    return (
        <div className="gratitude-tree-container">
            <div>
                <button onClick={() => navigate("/")} className="back-button">
                    <img src={backIcon} alt="Back to Main Page Button" />
                </button>
            </div>

            {<TreeComponent gratitudeCount={gratitudes.length}/>}

            <div>
                <p>You have submitted {gratitudes.length} {(gratitudes.length === 1) ? 'gratitude.' : 'gratitudes.' }</p>
                <p>{canSubmit ? 'You can submit another gratitude.' : `Wait ${hoursToNext} hours to submit another.`}</p>
            </div>
            
            {canSubmit && (
                <form onSubmit={handleSubmit} className="gratitude-form">
                    <textarea 
                        className="gratitude-textarea" 
                        value={newGratitude} 
                        onChange={(e) => setNewGratitude(e.target.value)} 
                        disabled={!canSubmit} 
                    />
                    <button type="submit" disabled={!canSubmit} className="gratitude-button">
                        Submit
                    </button>
                </form>
            )}
            
        </div>
    );
};

export default GratitudeComponent;
