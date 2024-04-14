import React, { useEffect } from 'react';

function DataComponent() {
  useEffect(() => {
    fetch('http://localhost:3001/api/keys')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching keys:', error));
  }, []);

  return (
    <div>
      <p>...</p>
    </div>
  );
}

export default DataComponent;
