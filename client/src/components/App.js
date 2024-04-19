import React from 'react';
import '../assets/styles/App.css';
import LockboxComponent from './LockboxComponent';
import KeyComponent from './KeyComponent';
import DataComponent from './DataComponent';

function App() {
  return (
    <div className="App">
      {<LockboxComponent />}
      {<KeyComponent />}
      {<DataComponent />}
    </div>
  );
}

export default App;
