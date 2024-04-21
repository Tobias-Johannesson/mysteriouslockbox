import React from 'react';
import '../assets/styles/KeyComponent.css';
import keyIcon from '../assets/images/key-icon-1.png';

const KeyComponent = ({ keys }) => {
    return (
        <div className="key-menu">
            {keys.map(key => key.obtained && (
                <div className="key-item" key={key.id} title={key.name}>
                    <img src={keyIcon} alt={key.name} className="key-image"/>
                    <span className="key-name">{key.name}</span>
                </div>
            ))}
        </div>
    );
};

export default KeyComponent;