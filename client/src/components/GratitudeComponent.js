import React, { useState, useEffect } from 'react';
import '../assets/styles/GratitudeComponent.css'; // Assume custom styles for animations and layout
import DOMPurify from 'dompurify';
import backIcon from '../assets/images/back-arrow-icon.png';

const GratitudeComponent = ( {setShowMain} ) => {
    const [gratitudes, setGratitudes] = useState([]);
    const [canSubmit, setCanSubmit] = useState(false);
    const [hoursToNext, setHoursToNext] = useState(0);
    const [newGratitude, setNewGratitude] = useState('');

    // Fetch previous gratitudes when the component mounts
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
            setCanSubmit(false);
            setHoursToNext(0);  // Reset time until the next submission
        }
    };

    const handleSubmit = async (event) => {
        const apiBaseUrl = process.env.REACT_APP_API_URL;
        event.preventDefault();
        if (!canSubmit) return;

        try {
            const sanitizedContent = DOMPurify.sanitize(event.target.value);
            setNewGratitude(sanitizedContent); // Move into a onChange...

            const response = await fetch(`${apiBaseUrl}/gratitudes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newGratitude })
            });
            setNewGratitude('');
            fetchGratitudes();

            const data = await response.json();
            console.log(data);
            
        } catch (error) {
            console.error('Error submitting gratitude:', error);
        }
    };

    return (
        <div className="gratitude-tree-container">
            <div>
                <button onClick={() => setShowMain(true)} className="back-button">
                    <img src={backIcon} alt="Back to Main Page Button" />
                </button>
            </div>

            <div className="tree-display">
                <p>You have submitted {gratitudes.length} {(gratitudes.length === 1) ? 'gratitude.' : 'gratitudes.' }</p>
                <p>{canSubmit ? 'You can submit another gratitude.' : `Wait ${hoursToNext} hours to submit another.`}</p>
                {/* Animation or dynamic changes based on submissions.length */}
                {/* Display tree based on the number of submissions */}
            </div>
            
            {(canSubmit) && 
                <form onSubmit={handleSubmit}>
                    <textarea value={newGratitude} onChange={(e) => setNewGratitude(e.target.value)} disabled={!canSubmit} />
                    <button type="submit" disabled={!canSubmit}>Submit</button>
                </form>
            }
            
        </div>
    );
};

export default GratitudeComponent;
