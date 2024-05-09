import React, { useState, useEffect } from 'react';

import '../assets/styles/HomePage.css';
import KeyComponent from '../components/KeyComponent';
import LockboxComponent from '../components/LockboxComponent';
import LockComponent from '../components/LockComponent';
import RiddleInputComponent from '../components/RiddleInputComponent';
import PageComponent from '../components/PageComponent';

function Home() {
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
      <div className="Home">
        <header>
          {<KeyComponent keys={keys} />}
          {<PageComponent keys={keys} />}
        </header>
        <main>
          <div>
            {<LockboxComponent keys={keys} />}
            {<LockComponent keys={keys} setKeys={setKeys} />}
          </div>
          <div>
            {<RiddleInputComponent setKeys={setKeys} />}
          </div>
        </main>
        <footer></footer>
    </div>
  );
}

export default Home;
