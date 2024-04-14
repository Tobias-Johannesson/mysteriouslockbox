import React, { useState, useEffect } from 'react';
import '../assets/styles/LockboxComponent.css';

const LockboxComponent = () => {
    const handleClick = (keyholeNumber) => {
        console.log(`Keyhole ${keyholeNumber} was clicked`);
        // Implement different logic based on keyholeNumber
        switch (keyholeNumber) {
            case 1:
                // Logic for keyhole 1
                break;
            case 2:
                // Logic for keyhole 2
                break;
            // Continue for other keyholes...
            default:
            console.log('Default case');
        }
      };
      
    
    return (
        <main>
            <img src="/romantic-lockbox.png" alt="Lockbox" style={{ width: '500px', display: 'block', margin: '0 auto' }} />
            <div>
            <p className="mysterious-romantic-text">
                To proceed, solve the challenges seven, gain the seven keys, and claim what is yours
            </p>
            </div>
            <div className="keyholes">
                {[...Array(7)].map((_, i) => (
                <button key={i} onClick={() => handleClick(i + 1)} className="keyhole-button"> </button>
                ))}
            </div>
        </main>
    );
};

export default LockboxComponent;
