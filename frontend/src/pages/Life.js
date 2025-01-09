import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Life() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/life');
        if (response.data.success) {
          setServerStatus('Server is up and running!');
        } else {
          setServerStatus('Server is down.');
        }
      } catch (error) {
        setServerStatus('Failed to connect to the server.');
      }
    };

    checkServer();
  }, []);

  return (
    <div className="server-status">
      <h1>Server Status</h1>
      <p>{serverStatus}</p>
    </div>
  );
}

export default Life;
