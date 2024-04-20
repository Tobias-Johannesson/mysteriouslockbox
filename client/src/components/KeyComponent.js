import React, { useEffect, useState } from 'react';
import '../assets/styles/KeyComponent.css';

const KeyComponent = () => {
    // State to manage textbox visibility
    const [keys, setKeys] = useState([]);
    const [textboxMessage, setTextboxMessage] = useState("");
    const [showTextbox, setShowTextbox] = useState(false);

    // Fetch keys from the server
    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/keys");
                const jsonData = await response.json();
                setKeys(jsonData);
            } catch (err) {
                console.error('Error fetching keys:', err.message);
            }
        };
        fetchKeys();
    }, []);

    // Handle clicking on a key hole
    const handleKeyClick = async (key) => {
        if (!key.obtained) {
            setTextboxMessage(`The ${key.name} is not acquired yet.`)
            setShowTextbox(true);
        } else {
            try {
                const response = await fetch("http://localhost:3001/api/unlock", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ keyId: key.id })  // Assuming key.id is the ID of the key
                });
                const jsonData = await response.json();
                if (response.ok) {
                    setKeys(prevKeys => prevKeys.map(k => k.id === key.id ? {...k, unlocked: true} : k));
                    setTextboxMessage(`The ${key.name} has been acquired and you are now one step closer to solving this puzzle.`);
                } else {
                    throw new Error(jsonData.message || 'Failed to unlock');
                }
            } catch (err) {
                console.error(err.message);
                setTextboxMessage('Failed to unlock the key.');
            }
            setShowTextbox(true);
        }
    };

    // Close the textbox
    const handleCloseTextbox = () => setShowTextbox(false);
    
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
                {keys.map(key => !key.unlocked && (
                    <button key={key.id} onClick={() => handleKeyClick(key)} className="keyhole-button">
                        {key.name} {/* Optionally show the key name on the button */}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KeyComponent;
