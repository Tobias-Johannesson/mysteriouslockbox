import React from 'react';
import '../assets/styles/PageComponent.css';
import treeIcon from '../assets/images/tree-icon.png';

const PageComponent = ( {setShowMain} ) => {
    return (
        <div className="page-menu">
            <div className="page-item" key={1} title={"Tree"}>
                <button onClick={() => setShowMain(false)} className="tree-button">
                    <img src={treeIcon} alt="Tree Page Button" />
                </button>
            </div>
        </div>
    );
};

export default PageComponent;