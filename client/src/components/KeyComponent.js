import React, { useEffect, useState } from 'react';
import '../assets/styles/KeyComponent.css';

const KeyComponent = () => {
    // State to manage textbox visibility
    const [keys, setKeys] = useState([]);
    const [textboxMessage, setTextboxMessage] = useState("");
    const [showTextbox, setShowTextbox] = useState(false);

    const getKeys = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/keys");
          const jsonData = await response.json();
          setKeys(jsonData);
        } catch (err) {
          console.error(err.message);
        }
      };

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

    // Handler to hide the textbox
    const handleCloseTextbox = () => {
        setShowTextbox(false);
    };

    useEffect(() => { 
        getKeys();
    }, []);
    
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
                {keys.map(key => (
                    !key.unlocked && ( 
                        <button key={key.id} onClick={() => handleKeyClick(key)} className="keyhole-button"></button>
                    )
                ))}
            </div>
        </div>
    );
};

export default KeyComponent;
