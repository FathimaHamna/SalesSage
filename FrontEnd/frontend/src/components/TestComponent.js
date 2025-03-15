import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [connectionStatus, setConnectionStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/test/', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'ok') {
          setConnectionStatus(response.data.message || 'Backend is connected successfully!');
        } else {
          setConnectionStatus('Connected, but received unexpected response');
        }
        setError(null);
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('Failed to connect to the backend');
        setError(error.message);
      }
    };

    fetchBackendStatus();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Backend Connection Status:</h2>
      <p className={`mb-2 ${error ? 'text-red-500' : 'text-green-500'}`}>
        {connectionStatus}
      </p>
      {error && (
        <p className="text-sm text-red-400">
          Error details: {error}
        </p>
      )}
    </div>
  );
};

export default TestComponent;