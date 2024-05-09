import React, { useState, useEffect } from 'react';
import seed from '../assets/images/seed.png';
import sapling from '../assets/images/sapling.png';
import smallTree from '../assets/images/small-tree.png';
import largeTree from '../assets/images/large-tree.png';

const TreeComponent = ({ gratitudeCount }) => {
    const [treeImage, setTreeImage] = useState(sapling);
    const [treeSize, setTreeSize] = useState(100); // starting size in pixels

    useEffect(() => {
        if (gratitudeCount <= 0) {
            setTreeImage(seed);
            setTreeSize(100);
        } else if (gratitudeCount < 10) {
            setTreeImage(sapling);
            setTreeSize(100 + gratitudeCount * 10); // gradually increase size
        } else if (gratitudeCount < 40) {
            console.log("Test")
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
