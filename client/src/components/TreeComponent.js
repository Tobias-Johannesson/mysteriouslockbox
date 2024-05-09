import React, { useState, useEffect } from 'react';
import sapling from '../assets/images/sapling.png';
import smallTree from '../assets/images/smallTree.png';
import largeTree from '../assets/images/largeTree.png';

const TreeComponent = ({ gratitudeCount }) => {
    const [treeImage, setTreeImage] = useState(sapling);
    const [treeSize, setTreeSize] = useState(100); // starting size in pixels

    useEffect(() => {
        if (gratitudeCount < 10) {
            setTreeImage(sapling);
            setTreeSize(100 + gratitudeCount * 10); // gradually increase size
        } else if (gratitudeCount < 40) {
            setTreeImage(smallTree);
            setTreeSize(200 + (gratitudeCount - 10) * 5); // slower size increase
        } else {
            setTreeImage(largeTree);
            setTreeSize(350 + (gratitudeCount - 40) * 2); // even slower size increase
        }
    }, [gratitudeCount]);

    return (
        <div className="tree-container" style={{ width: treeSize, height: treeSize }}>
            <img src={treeImage} alt="Growth Tree" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default TreeComponent;
