import React, { useState, useEffect } from 'react';
import '../assets/styles/GratitudeComponent.css'; // Assume custom styles for animations and layout
import backIcon from '../assets/images/back-arrow-icon.png';

const GratitudeComponent = ( {setShowMain} ) => {
    const [gratitude, setGratitude] = useState('');
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        // Load the user's past submissions and the last submission date
        // This part needs to connect with the backend to fetch data
    }, []);

    const handleInputChange = (event) => {
        setGratitude(event.target.value);
    };

    const handleSubmit = async () => {
        // Here you would ideally check if 24 hours have passed since the last submission
        // This logic should be handled on the backend for security

        const response = await fetch('/api/gratitude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gratitude })
        });
        if (response.ok) {
            const newSubmission = await response.json();
            setSubmissions([...submissions, newSubmission]);
            setGratitude(''); // Clear input after submission
        }
    };

    return (
        <div className="gratitude-tree-container">
            <div>
                <button onClick={() => setShowMain(true)} className="back-button">
                    <img src={backIcon} alt="Back to Main Page Button" />
                </button>
            </div>
            <textarea
                value={gratitude}
                onChange={handleInputChange}
                placeholder="What are you grateful for today?"
                className="gratitude-input"
            />
            <button onClick={handleSubmit} className="submit-gratitude">Submit</button>
            {/* Display tree based on the number of submissions */}
            <div className="tree-display">
                {submissions.length} gratitudes submitted
                {/* Animation or dynamic changes based on submissions.length */}
            </div>
        </div>
    );
};

export default GratitudeComponent;
