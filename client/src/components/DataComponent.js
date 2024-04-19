import React, { useEffect, useState } from 'react';

function DataComponent() {
  const [keys, setKeys] = useState([]);

  const getKeys = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/keys");
      const jsonData = await response.json();
      setKeys(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => { 
    getKeys();
  }, []);

  return (
    <div>
        <h1>Keys</h1>
        <ul>
            {keys.map(key => (
                <li key={key.id}>{key.name}</li>
            ))}
        </ul>
    </div>
  );
}

export default DataComponent;
