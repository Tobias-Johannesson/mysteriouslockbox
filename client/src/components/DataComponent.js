import React, { useEffect } from 'react';

function DataComponent() {
  useEffect(() => {
    fetch('http://localhost:3001/api/keys')
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error('Error fetching keys:', error));
  }, []);

  return (
    <div>
      <p>Check the console for output.</p>
    </div>
  );
}

export default DataComponent;
