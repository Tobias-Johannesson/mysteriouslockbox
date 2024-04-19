import React, { useState } from 'react';
import '../assets/styles/KeyComponent.css';

const KeyComponent = () => {
    // State to manage textbox visibility
    const [textboxMessage, setTextboxMessage] = useState("");
    const [showTextbox, setShowTextbox] = useState(false);

    const handleKeyholeClick = (keyholeNumber) => {
        // Custom logic for each keyhole
        setTextboxMessage(`Key ${keyholeNumber} is not acquired yet.`)
        setShowTextbox(true);
    };

    // Handler to hide the textbox
    const handleCloseTextbox = () => {
        setShowTextbox(false);
    };
    
    return (
        <div>
            {showTextbox && (
                <div className="textbox-container">
                    <div className="textbox">
                        <p>{textboxMessage}</p>
                        <button onClick={handleCloseTextbox}>Close</button>
                    </div>
                </div>
            )}
            <div className="keyholes">
                {[...Array(7)].map((_, i) => (
                    <button key={i} onClick={() => handleKeyholeClick(i + 1)} className="keyhole-button"></button>
                ))}
            </div>
        </div>
    );
};

export default KeyComponent;
