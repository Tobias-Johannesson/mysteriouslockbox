import React, { useState, useEffect } from 'react';
import '../assets/styles/App.css';
import LockboxComponent from './LockboxComponent';
import KeyComponent from './KeyComponent';

function App() {
  const [keys, setKeys] = useState([]);

  // Fetch keys from the server
  useEffect(() => {
    const fetchKeys = async () => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiBaseUrl}/keys`);
            if (!response.ok) throw new Error('Network response was not ok');
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            const jsonData = await response.json();
            setKeys(jsonData);
        } catch (err) {
            console.error('Error fetching keys:', err.message);
        }
    };
    fetchKeys();
}, []);

  return (
    <div className="App">
      {<LockboxComponent keys={keys} />}
      {<KeyComponent keys={keys} setKeys={setKeys} />}
    </div>
  );
}

export default App;
