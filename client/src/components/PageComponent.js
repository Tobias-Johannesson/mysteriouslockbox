import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/PageComponent.css';
//import treeIcon from '../assets/images/tree-icon.png';

const PageComponent = ( {keys, setShowMain} ) => {
    const navigate = useNavigate(); // Hook for navigating

    const navigateToPage = (keyPath) => {
        navigate(keyPath); // Using the navigate function to change route
    };

    return (
        <div className="page-menu">
            {keys.map(key => key.obtained && key.path && (
                <div className="page-item" key={key.id} title={key.name}>
                    <button onClick={() => navigateToPage(key.path)} className="tree-button">
                        <img src={require(`../assets/images/${key.icon}`)} alt={`Button to ${key.name} page`} />
                    </button> 
                </div>
            ))}
        </div>
    );
};

export default PageComponent;