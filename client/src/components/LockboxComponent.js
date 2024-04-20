import React from 'react';
import '../assets/styles/LockboxComponent.css';

const LockboxComponent = ({ keys }) => {
    // Calculate the number of keys left to be obtained
    const keysLeft = keys.reduce((acc, key) => !key.obtained ? acc + 1 : acc, 0);

    return (
        <div>
            <img src="/romantic-lockbox.png" alt="Lockbox" className="lockbox" />
            <p className="mysterious-romantic-text">
                To proceed, solve the challenges seven, gain the seven keys, and claim what is yours.
            </p>
            <p className="mysterious-romantic-text">
                {keysLeft} {keysLeft === 1 ? 'key is' : 'keys are'} left to be obtained.
            </p>
        </div>
    );
};

export default LockboxComponent;
